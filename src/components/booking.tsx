"use client";

import { useBooking } from "@/components/use-booking";
import { parseLocalDate } from "@/lib/dates";
import { booking as copy, profile } from "@/content";

// Slot timestamps come back with the offset of the visitor's own zone, so the
// browser's default locale and zone format them correctly. These are only used
// after the visitor's own zone is known, which keeps server and client markup
// identical.
const weekday = new Intl.DateTimeFormat(undefined, { weekday: "short" });
const dayOfMonth = new Intl.DateTimeFormat(undefined, { day: "numeric" });
const monthShort = new Intl.DateTimeFormat(undefined, { month: "short" });
const clock = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
const full = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const chip = (active: boolean) =>
  [
    "booking-choice border px-3 py-2 text-sm transition-colors",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
    "disabled:cursor-not-allowed disabled:opacity-40",
    active
      ? "border-ink bg-ink text-ivory"
      : "border-line text-muted hover:border-ink hover:text-ink",
  ].join(" ");

const field =
  "booking-field border border-line bg-ivory px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-ink";

export function Booking() {
  const {
    timeZone, eventTypes, eventTypeId, setEventTypeId, loadError,
    days, slots, slotsError, slotsLoading, day, setDay, slot, setSlot, daySlots, ready,
    name, setName, email, setEmail, notes, setNotes, submitting, formError, booked,
    onSubmit, bookAnother, retrySlots,
  } = useBooking();

  if (booked) {
    // Cal.com puts the conferencing link in `location` for some integrations
    // and `meetingUrl` for others; take whichever is a URL.
    const joinUrl =
      [booked.meetingUrl, booked.location].find((url) => url?.startsWith("http")) ?? null;

    return (
      <div className="booking-confirmed border-y border-line py-8" role="status">
        <p className="font-mono text-xs tracking-wide text-faint uppercase">Confirmed</p>
        <h2 className="mt-3 font-serif text-3xl leading-tight tracking-tight">
          {full.format(new Date(booked.start))}
        </h2>
        <p className="mt-3 max-w-md leading-relaxed text-muted">{copy.confirmed}</p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {joinUrl && (
            <a href={joinUrl} className="link" target="_blank" rel="noopener noreferrer">
              {joinUrl.includes("meet.google.com") ? "Join Google Meet" : "Join link"}{" "}
              <span aria-hidden className="text-faint">↗</span>
            </a>
          )}
          <button
            type="button"
            className="link text-muted hover:text-ink"
            onClick={bookAnother}
          >
            {copy.another}
          </button>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="booking-unavailable" role="status">
        <h2>Arrange a call by email</h2>
        <p>{loadError}</p>
        <a href={`mailto:${profile.email}`} className="wb-plain-link link">{profile.email} ↗</a>
      </div>
    );
  }

  return (
    <div className="booking-controls">

      {eventTypes.length === 0 && !loadError && <p role="status" className="text-sm text-muted">Loading meeting types…</p>}

      {eventTypes.length > 0 && (
        <fieldset>
          <legend className="font-mono text-xs tracking-wide text-faint uppercase">01 / Meeting length</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {eventTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                aria-pressed={type.id === eventTypeId}
                disabled={submitting}
                onClick={() => {
                  setEventTypeId(type.id);
                  setSlot(null);
                }}
                className={chip(type.id === eventTypeId)}
              >
                {type.title}<span className="booking-duration">{type.lengthInMinutes} min</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div className="mt-8">
        <p className="font-mono text-xs tracking-wide text-faint uppercase">02 / Choose a date</p>
        <ul className="booking-dates mt-3" aria-label="Available dates in the next two weeks">
          {!ready && <li className="text-sm text-faint">Loading availability…</li>}
          {ready &&
            days.map((candidate) => {
              const date = parseLocalDate(candidate);
              const available = (slots[candidate]?.length ?? 0) > 0;
              return (
                <li key={candidate}>
                  <button
                    type="button"
                    disabled={!available || slotsLoading || submitting}
                    aria-pressed={candidate === day}
                    onClick={() => {
                      setDay(candidate);
                      setSlot(null);
                    }}
                    className={`${chip(candidate === day)} w-full px-0 text-center leading-tight`}
                  >
                    <span className="block text-xs tracking-wide uppercase">
                      {weekday.format(date)}
                    </span>
                    <span className="block text-base">{dayOfMonth.format(date)}</span>
                    <span className="booking-date-month block text-xs uppercase">
                      {monthShort.format(date)}
                    </span>
                  </button>
                </li>
              );
            })}
        </ul>
      </div>

      <div className="mt-8" aria-live="polite" aria-busy={slotsLoading}>
        <p className="font-mono text-xs tracking-wide text-faint uppercase">
          03 / Choose a time{timeZone && <span className="normal-case"> · {timeZone.replace(/_/g, " ")}</span>}
        </p>
        {slotsLoading ? (
          <p className="mt-3 text-sm text-faint">Checking…</p>
        ) : slotsError ? (
          <p role="alert" className="mt-3 text-sm text-muted">
            {slotsError}{" "}<button type="button" className="link" onClick={retrySlots}>Try again</button>
          </p>
        ) : daySlots.length === 0 ? (
          <p className="mt-3 text-sm text-muted">{days.some((candidate) => (slots[candidate]?.length ?? 0) > 0) ? "No times available on this date. Please choose another day." : copy.empty}</p>
        ) : (
          <ul className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {daySlots.map((option) => (
              <li key={option.start}>
                <button
                  type="button"
                  aria-pressed={option.start === slot}
                  disabled={submitting}
                  onClick={() => setSlot(option.start)}
                  className={`${chip(option.start === slot)} w-full px-0 text-center`}
                >
                  {clock.format(new Date(option.start))}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={onSubmit} className="mt-10 border-t border-line pt-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm">
            Name
            <input
              required
              maxLength={100}
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={field}
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm">
            Email
            <input
              required
              type="email"
              maxLength={200}
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={field}
            />
          </label>
        </div>

        <label className="mt-4 flex flex-col gap-1.5 text-sm">
          <span>
            Anything to share? <span className="text-faint">Optional</span>
          </span>
          <textarea
            rows={3}
            maxLength={1000}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className={`${field} resize-y`}
          />
        </label>

        {/* Honeypot: hidden from people and assistive tech, filled in by form bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <button
            type="submit"
            disabled={!slot || submitting}
            className="noir-button noir-button-red booking-submit disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting
              ? "Booking…"
              : slot
                ? `Book ${clock.format(new Date(slot))}`
                : "Pick a time"}
          </button>
          <p className="text-xs text-faint">
            {copy.fallback}{" "}
            <a href={`mailto:${profile.email}`} className="link">
              {profile.email}
            </a>
          </p>
        </div>

        {formError && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {formError}
          </p>
        )}
      </form>
    </div>
  );
}
