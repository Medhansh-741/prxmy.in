"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { profile } from "@/content";
import type {
  ContributionCalendar,
  ContributionDay,
} from "@/lib/github-client";

export function Arrow({ diagonal = true }: { diagonal?: boolean }) {
  return (
    <svg
      className="wb-arrow"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h15m-6-6 6 6-6 6"} />
    </svg>
  );
}

export function CopyEmail() {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  async function copy() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setState("copied");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setState("idle"), 2500);
    } catch {
      setState("error");
    }
  }
  return (
    <div className="wb-copy">
      <button type="button" onClick={copy} aria-label="Copy email address">
        <span>{state === "copied" ? "Copied. Talk soon!" : "Copy email"}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <rect x="8" y="8" width="12" height="12" rx="1" />
          <path d="M15 8V4H4v11h4" />
        </svg>
      </button>
      <span
        role="status"
        className={state === "error" ? "wb-copy-error" : "sr-only"}
      >
        {state === "copied"
          ? "Email address copied to clipboard."
          : state === "error"
            ? "Couldn’t copy. Use the email link to get in touch."
            : ""}
      </span>
    </div>
  );
}

function fanLabel(day: ContributionDay) {
  return `${day.contributionCount} contributions on ${new Date(day.date + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}`;
}

export function FanCalendar({ calendar }: { calendar: ContributionCalendar }) {
  const days = calendar.weeks.flatMap((week) => week.contributionDays);
  const [inspected, setInspected] = useState(days.at(-1)!);
  const [active, setActive] = useState(days.at(-1)!.date);
  const refs = useRef(new Map<string, HTMLButtonElement>());
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const moves: Record<string, number> = {
      ArrowLeft: -7,
      ArrowRight: 7,
      ArrowUp: -1,
      ArrowDown: 1,
    };
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? days.length - 1
          : event.key in moves
            ? Math.max(0, Math.min(days.length - 1, index + moves[event.key]))
            : null;
    if (next === null) return;
    event.preventDefault();
    setActive(days[next].date);
    setInspected(days[next]);
    refs.current.get(days[next].date)?.focus();
  }
  const startIndexes = calendar.weeks.map((_, i) =>
    calendar.weeks
      .slice(0, i)
      .reduce((n, w) => n + w.contributionDays.length, 0),
  );
  return (
    <div className="wb-fan-calendar">
      <div className="wb-calendar-scroll">
        <div className="wb-fan-months" aria-hidden="true">
          {calendar.weeks.map((week, i) => {
            const date = week.contributionDays[0].date;
            return (
              <span key={date}>
                {i === 0 ||
                date.slice(0, 7) !==
                  calendar.weeks[i - 1].contributionDays[0].date.slice(0, 7)
                  ? new Date(date + "T00:00:00Z").toLocaleDateString("en-GB", {
                      month: "short",
                      timeZone: "UTC",
                    })
                  : ""}
              </span>
            );
          })}
        </div>
        <div
          className="wb-fan-weeks"
          role="group"
          aria-label="Daily GitHub contributions. Use arrow keys to explore; Home and End jump to first and last day."
        >
          {calendar.weeks.map((week, wi) => (
            <div className="wb-fan-week" key={week.contributionDays[0].date}>
              {week.contributionDays.map((day, di) => (
                <button
                  key={day.date}
                  type="button"
                  className="wb-fan-day"
                  data-intensity={
                    day.contributionCount === 0
                      ? 0
                      : day.contributionCount < 3
                        ? 1
                        : day.contributionCount < 9
                          ? 2
                          : day.contributionCount < 25
                            ? 3
                            : 4
                  }
                  style={{
                    gridRow: new Date(day.date + "T00:00:00Z").getUTCDay() + 1,
                  }}
                  tabIndex={active === day.date ? 0 : -1}
                  title={fanLabel(day)}
                  aria-label={fanLabel(day)}
                  ref={(element) => {
                    if (element) refs.current.set(day.date, element);
                    else refs.current.delete(day.date);
                  }}
                  onMouseEnter={() => setInspected(day)}
                  onFocus={() => {
                    setActive(day.date);
                    setInspected(day);
                  }}
                  onClick={() => {
                    setActive(day.date);
                    setInspected(day);
                  }}
                  onKeyDown={(event) => navigate(event, startIndexes[wi] + di)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 11C3 13 1 4 7 3c4-1 6 3 5 8Zm1 1C11 3 20 1 21 7c1 4-3 6-8 5Zm-1 1c9-2 11 7 5 8-4 1-6-3-5-8Zm-1-1C13 21 4 23 3 17c-1-4 3-6 8-5Z" />
                  </svg>
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="wb-fan-caption">
        <p role="status" aria-live="polite">
          {fanLabel(inspected)}
        </p>
        <span>
          One fan, one day.{" "}
          <span className="wb-fan-hint">Hover or use arrow keys.</span>
        </span>
      </div>
    </div>
  );
}
