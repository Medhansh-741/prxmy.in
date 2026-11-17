"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { clockIn, formatMinutes, JAIPUR, AGENCY, nightShift } from "@/lib/comic";

// The current minute, read only in the browser (null on the server) and
// refreshed every 30 seconds, so prerendered markup always matches.
const subscribe = (tick: () => void) => {
  const id = setInterval(tick, 30_000);
  return () => clearInterval(id);
};
const minute = () => Math.floor(Date.now() / 60_000);
const none = () => null;

function Clock({ label, timeZone, at }: { label: string; timeZone: string; at: Date | null }) {
  const time = at && clockIn(at, timeZone);
  const night = time ? time.hour < 6 || time.hour >= 18 : false;
  const hand = (turns: number, length: number) =>
    `M50 50L${50 + Math.sin(turns * Math.PI * 2) * length} ${50 - Math.cos(turns * Math.PI * 2) * length}`;
  return (
    <div className={`ns-clock${night ? " night" : ""}`}>
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <circle cx="50" cy="50" r="46" className="face" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2, r = i % 3 ? 40 : 36;
          const p = (n: number) => n.toFixed(2); // rounded, so server and browser trig agree
          return <path key={i} d={`M${p(50 + Math.sin(a) * r)} ${p(50 - Math.cos(a) * r)}L${p(50 + Math.sin(a) * 43)} ${p(50 - Math.cos(a) * 43)}`} className={i % 3 ? "tick" : "tick major"} />;
        })}
        {time && <path d={hand(((time.hour % 12) + time.minute / 60) / 12, 22)} className="hand hour" />}
        {time && <path d={hand(time.minute / 60, 34)} className="hand" />}
        <circle cx="50" cy="50" r="4" className="pin" />
        {night && <path d="M74 22a8 8 0 1 0 6 12a6.5 6.5 0 1 1-6-12z" className="moon" />}
      </svg>
      <b>{label}</b>
      <span>{time ? formatMinutes(time.hour * 60 + time.minute) : "--:--"}</span>
    </div>
  );
}

// The title row (heading passed in), the live hook line, two clocks, and the
// 24-hour bar of Jaipur's day with the agency's 9–5 drawn on it.
export function NightClock({ children }: { children: ReactNode }) {
  const now = useSyncExternalStore(subscribe, minute, none);
  const at = now === null ? null : new Date(now * 60_000);
  const shift = at && nightShift(at);
  const pct = (minutes: number) => `${(minutes / 14.4).toFixed(2)}%`;

  return (
    <>
      <div className="ns-top">
        <div>
          {children}
          <p className="ns-hook">Schrader is in Traverse City, Michigan. Their 9 a.m. is <b>{shift ? shift.opensInJaipur : "evening"}</b> in Jaipur, so my workday starts when the city goes dark.</p>
        </div>
        <div className="ns-clocks">
          <Clock label="Jaipur" timeZone={JAIPUR} at={at} />
          <Clock label="Traverse City" timeZone={AGENCY} at={at} />
        </div>
      </div>
      <div className="ns-ribbon">
        <div className="rb-track" role="img" aria-label={`A day on Jaipur's clock, with the agency's 9 to 5${shift ? ` starting at ${shift.opensInJaipur}` : ""} marked on it.`}>
          <div className="rb-night" style={{ left: 0, width: "27%" }} />
          <div className="rb-night" style={{ left: "75%", width: "25%" }} />
          {shift?.spans.map(([from, to]) => <div key={from} className="rb-work" style={{ left: pct(from), width: pct(to - from) }} />)}
          {shift && <div className="rb-now" style={{ left: pct(shift.jaipurMinutes) }} />}
        </div>
        <div className="rb-ticks" aria-hidden="true"><span style={{ left: 0 }}>12 a.m.</span><span style={{ left: "25%" }}>6 a.m.</span><span style={{ left: "50%" }}>Noon</span><span style={{ left: "75%" }}>6 p.m.</span><span style={{ left: "100%" }}>12 a.m.</span></div>
        <p className="rb-key">
          <span><i className="k-day" />Daylight in Jaipur (approx.)</span>
          <span><i className="k-night" />Night</span>
          <span><i className="k-work" />Agency hours, 9–5 ET</span>
          <span className={`rb-status${shift?.open ? " on" : ""}`}>
            <i className="lamp" />
            {!shift ? "Checking the clocks…" : shift.open
              ? `Agency hours: open · ${formatMinutes(shift.agencyMinutes)} in Traverse City`
              : `Agency hours: closed · opens ${shift.nextIsMonday ? "Mon, " : ""}${shift.opensInJaipur} IST`}
          </span>
        </p>
      </div>
    </>
  );
}
