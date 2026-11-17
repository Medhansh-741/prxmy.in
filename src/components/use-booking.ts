"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import type { CalBooking, CalEventType, CalSlot } from "@/lib/cal";
import { addDays, localDate, parseLocalDate } from "@/lib/dates";
import { booking as copy } from "@/content";

const DAYS_AHEAD = 14;

// Values that only exist in a browser have to be read after hydration, or the
// prerendered markup won't match. `useSyncExternalStore` is the supported way
// to do that: `null` on the server, the real value in the browser.
const subscribeToNothing = () => () => {};
const serverSnapshot = () => null;
const currentTimeZone = () =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
const currentLocalDate = () => localDate(new Date());

// The Cal.com booking flow (meeting types → 14 days of slots → booking), shared
// by /book and the letters page so both stay one implementation.
export function useBooking() {
  const timeZone = useSyncExternalStore(subscribeToNothing, currentTimeZone, serverSnapshot);
  const today = useSyncExternalStore(subscribeToNothing, currentLocalDate, serverSnapshot);

  const [eventTypes, setEventTypes] = useState<CalEventType[]>([]);
  const [eventTypeId, setEventTypeId] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [slots, setSlots] = useState<Record<string, CalSlot[]>>({});
  const [slotsError, setSlotsError] = useState<string | null>(null);
  // The request key whose slots are in `slots`, so "loading" stays derived.
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [reload, setReload] = useState(0);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [booked, setBooked] = useState<CalBooking | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/cal/event-types")
      .then((res) => res.json())
      .then((data: { eventTypes?: CalEventType[]; error?: string }) => {
        if (cancelled) return;

        const types = data.eventTypes ?? [];
        if (types.length === 0) {
          setLoadError(data.error ?? "No meeting types are available right now.");
          return;
        }

        const preferred = types.find((type) => type.slug === copy.preferredSlug);
        setEventTypes(types);
        setEventTypeId((preferred ?? types[0]).id);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Couldn't load the meeting types.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // The strip of selectable days, as `YYYY-MM-DD` in the visitor's zone.
  const days = useMemo(() => {
    if (!today) return [];
    const anchor = parseLocalDate(today);
    return Array.from({ length: DAYS_AHEAD }, (_, index) => localDate(addDays(anchor, index)));
  }, [today]);

  const first = days[0];
  const last = days[days.length - 1];
  const requestKey =
    eventTypeId && timeZone && first && last
      ? `${eventTypeId}|${first}|${last}|${timeZone}|${reload}`
      : null;

  useEffect(() => {
    if (!requestKey || !eventTypeId || !first || !last || !timeZone) return;

    const controller = new AbortController();

    // Cal.com reads `start`/`end` as UTC days, so pad by one day on each side;
    // the keys it returns are local to `timeZone`, which is what we look up.
    const params = new URLSearchParams({
      eventTypeId: String(eventTypeId),
      start: localDate(addDays(parseLocalDate(first), -1)),
      end: localDate(addDays(parseLocalDate(last), 1)),
      timeZone,
    });

    fetch(`/api/cal/slots?${params}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data: { slots?: Record<string, CalSlot[]>; error?: string }) => {
        const available = data.slots ?? {};

        setSlotsError(data.error ?? null);
        setSlots(available);
        setSlot(null);
        setDay((current) => {
          if (current && (available[current]?.length ?? 0) > 0) return current;
          return days.find((candidate) => (available[candidate]?.length ?? 0) > 0) ?? first;
        });
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AbortError") return;
        setSlotsError("Couldn't load availability.");
        setSlots({});
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadedKey(requestKey);
      });

    return () => controller.abort();
  }, [requestKey, eventTypeId, first, last, timeZone, days]);

  const slotsLoading = requestKey !== null && loadedKey !== requestKey;
  const daySlots = day ? (slots[day] ?? []) : [];
  const ready = Boolean(timeZone && today);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!eventTypeId || !slot || submitting) return;
    const website = new FormData(event.currentTarget).get("website");

    setSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch("/api/cal/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventTypeId, start: slot, timeZone, name, email, notes, website }),
      });
      const data: { booking?: CalBooking; error?: string } = await res.json();

      if (!res.ok || !data.booking) {
        setFormError(data.error ?? "That slot couldn't be booked. Try another one.");
        setSubmitting(false);
        // The slot may have been taken while the form was open.
        setReload((count) => count + 1);
        return;
      }

      setBooked(data.booking);
    } catch {
      setFormError("Couldn't reach the server. Check your connection and try again.");
      setSubmitting(false);
    }
  }


  function bookAnother() {
    setBooked(null);
    setSubmitting(false);
    setSlot(null);
    setNotes("");
    setReload((count) => count + 1);
  }

  return {
    timeZone, today, eventTypes, eventTypeId, setEventTypeId, loadError,
    days, slots, slotsError, slotsLoading, day, setDay, slot, setSlot, daySlots, ready,
    name, setName, email, setEmail, notes, setNotes, submitting, formError, booked,
    onSubmit, bookAnother, retrySlots: () => setReload((count) => count + 1),
  };
}
