"use client";

import { useEffect, useRef, useState } from "react";
import { useBooking } from "@/components/use-booking";
import { booking as copy, profile } from "@/content";
import { parseLocalDate } from "@/lib/dates";

// Formatters use the visitor's own locale and zone; they only run once the
// zone is known (`ready`), so server and client markup match.
const dayParts = (date: Date) => ({
  weekday: date.toLocaleDateString(undefined, { weekday: "short" }),
  day: date.toLocaleDateString(undefined, { day: "numeric" }),
  month: date.toLocaleDateString(undefined, { month: "short" }),
});
const clock = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
const shortDay = new Intl.DateTimeFormat(undefined, { weekday: "short", day: "numeric", month: "short" });
const full = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" });
const letterDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

// The Cal.com booking flow written as a letter: "I'd like a [length] call. How
// about [day] at [time]." On success it folds into a postmarked envelope.
export function LetterBooking() {
  const b = useBooking();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { if (b.booked) heading.current?.focus(); }, [b.booked]);

  if (b.booked) {
    const joinUrl = [b.booked.meetingUrl, b.booked.location].find((url) => url?.startsWith("http")) ?? null;
    return (
      <div className="envelope" role="status">
        <svg viewBox="0 0 460 280" role="img" aria-label="Your letter, sealed, postmarked Jaipur and stamped booked">
          <rect x="4" y="4" width="452" height="272" className="env-paper" />
          <path d="M4 4 230 150 456 4" className="env-flap" /><path d="M4 276 180 120M456 276 280 120" className="env-fold" />
          <rect x="372" y="20" width="62" height="74" className="env-stamp" /><rect x="378" y="26" width="50" height="50" className="env-ink" />
          <g className="env-postmark"><circle cx="352" cy="64" r="34" /><path d="M386 54c14-6 26 6 40 0s26 6 34 0M386 66c14-6 26 6 40 0s26 6 34 0M386 78c14-6 26 6 40 0" /></g>
          <text x="352" y="68" textAnchor="middle" className="env-mono">JAIPUR</text>
          <text x="60" y="238" className="env-mono">FROM</text>
          <text x="60" y="262" className="env-hand blue">{b.name.slice(0, 28)}</text>
          <text x="236" y="196" className="env-hand big">Prakhar Gupta</text>
          <text x="236" y="226" className="env-hand">Jaipur, India</text>
          <g transform="rotate(-10 110 140)"><rect x="40" y="118" width="150" height="44" className="env-booked" /><text x="115" y="152" textAnchor="middle" className="env-booked-text">BOOKED</text></g>
        </svg>
        <h3 ref={heading} tabIndex={-1}>{full.format(new Date(b.booked.start))}</h3>
        <p>{copy.confirmed}</p>
        <p className="env-actions">
          {joinUrl && <a href={joinUrl} target="_blank" rel="noopener noreferrer">{joinUrl.includes("meet.google.com") ? "Join Google Meet" : "Join link"} ↗</a>}
          <button type="button" className="comic-btn out" onClick={b.bookAnother}>{copy.another}</button>
        </p>
      </div>
    );
  }

  const open = (day: string) => (b.slots[day]?.length ?? 0) > 0;

  return (
    <form className="letter" onSubmit={b.onSubmit} aria-label="Book a call">
      <div className="lhead">
        <span className="wm">prxmy<i>.</i></span>
        <span className="addr">Prakhar Gupta<br />Jaipur, India<br />{b.today && letterDate.format(parseLocalDate(b.today))}</span>
      </div>
      <svg className="postage" viewBox="0 0 66 80" aria-hidden="true">
        <rect x="2" y="2" width="62" height="76" className="perf" /><rect x="8" y="8" width="50" height="52" className="ink" />
        <circle cx="44" cy="20" r="5" className="moon" />
        <path d="M14 56c4-9 11-13 19-13s15 4 19 13zM19 32h28l-6-2-1-9c-3-4-11-4-14 0l-1 9z" className="red" /><circle cx="33" cy="36" r="7" className="red" />
        <text x="33" y="73" textAnchor="middle">₹0 · POST</text>
      </svg>
      <p className="dear">Dear Prakhar,</p>

      {b.loadError ? (
        <p className="err" role="alert">{b.loadError} Write to <a href={`mailto:${profile.email}`}>{profile.email}</a> instead.</p>
      ) : (
        <p className="ml">I’d like a{" "}
          {b.eventTypes.length === 0 ? <span className="hand">…</span> : b.eventTypes.map((type) => (
            <button key={type.id} type="button" className="lchip" aria-pressed={type.id === b.eventTypeId} disabled={b.submitting}
              onClick={() => { b.setEventTypeId(type.id); b.setSlot(null); }}>{type.lengthInMinutes}-minute</button>
          ))}{" "}call.
        </p>
      )}

      <fieldset className="lfield">
        <legend>How about <small>next 14 days</small></legend>
        {!b.ready ? <p className="hint">Checking the calendar…</p> : (
          <ul className="days">
            {b.days.map((day) => {
              const parts = dayParts(parseLocalDate(day));
              return (
                <li key={day}>
                  <button type="button" className="lchip" aria-pressed={day === b.day} disabled={!open(day) || b.slotsLoading || b.submitting}
                    aria-label={shortDay.format(parseLocalDate(day))} onClick={() => { b.setDay(day); b.setSlot(null); }}>
                    <span>{parts.weekday}</span><b>{parts.day}</b><span>{parts.month}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </fieldset>

      <fieldset className="lfield" aria-live="polite" aria-busy={b.slotsLoading}>
        <legend>at {b.timeZone && <small>times in your zone · {b.timeZone.replace(/_/g, " ")}</small>}</legend>
        {b.slotsLoading ? <p className="hint">Checking…</p>
          : b.slotsError ? <p className="err" role="alert">{b.slotsError} <button type="button" className="linkish" onClick={b.retrySlots}>Try again</button></p>
          : b.daySlots.length === 0 ? <p className="hint">{b.days.some(open) ? "Nothing open that day. Pick another." : copy.empty}</p>
          : (
            <ul className="lchipset">
              {b.daySlots.map((option) => (
                <li key={option.start}><button type="button" className="lchip" aria-pressed={option.start === b.slot} disabled={b.submitting}
                  onClick={() => b.setSlot(option.start)}>{clock.format(new Date(option.start))}</button></li>
              ))}
            </ul>
          )}
      </fieldset>

      <div className="signed">
        <span className="lab">Signed,</span>
        <div className="two-in">
          <label className="lin"><span>Name</span><input required maxLength={100} autoComplete="name" value={b.name} onChange={(event) => b.setName(event.target.value)} /></label>
          <label className="lin"><span>Email</span><input required type="email" maxLength={200} autoComplete="email" value={b.email} onChange={(event) => b.setEmail(event.target.value)} /></label>
        </div>
      </div>
      <div className="ps">
        <span className="lab">P.S.</span>
        <label className="lin"><span>Anything to share? Optional</span><textarea rows={3} maxLength={1000} value={b.notes} onChange={(event) => b.setNotes(event.target.value)} /></label>
      </div>
      {/* Honeypot: hidden from people and assistive tech, filled in by form bots. */}
      <div className="trap" aria-hidden="true"><label>Website <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" /></label></div>

      {b.formError && <p className="err" role="alert">{b.formError}</p>}
      <div className="lfoot">
        <button type="submit" className="comic-btn" disabled={!b.slot || b.submitting}>
          {b.submitting ? "Posting…" : b.slot ? `Post it: ${shortDay.format(new Date(b.slot))}, ${clock.format(new Date(b.slot))}` : "Pick a time first"}
        </button>
        <p className="pencil-note"><svg viewBox="0 0 46 30" aria-hidden="true"><path d="M44 24C32 26 14 22 6 6" /><path d="M2 12 6 5 13 9" /></svg><span>lands on my calendar with a Meet link</span></p>
      </div>
      <p className="fallback">{copy.fallback} <a href={`mailto:${profile.email}`}>{profile.email}</a></p>
    </form>
  );
}

// Drag in the margin to sketch in blue pencil; the line inks black on release. Stays on this screen.
export function Doodle() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [used, setUsed] = useState(false);
  const strokes = useRef<{ points: [number, number][]; inked: boolean }[]>([]);
  const current = useRef<{ points: [number, number][]; inked: boolean } | null>(null);

  const redraw = () => {
    const el = canvas.current, ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    ctx.clearRect(0, 0, el.width, el.height);
    for (const stroke of strokes.current) {
      ctx.strokeStyle = stroke.inked ? getComputedStyle(el).color : "#8fb8d8";
      ctx.lineWidth = stroke.inked ? 2.6 : 2;
      ctx.lineCap = ctx.lineJoin = "round";
      ctx.beginPath();
      stroke.points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
    }
  };
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const size = new ResizeObserver(() => {
      const box = el.getBoundingClientRect(), ratio = devicePixelRatio || 1;
      el.width = box.width * ratio;
      el.height = box.height * ratio;
      el.getContext("2d")?.setTransform(ratio, 0, 0, ratio, 0, 0);
      redraw();
    });
    size.observe(el);
    return () => size.disconnect();
  }, []);
  const at = (event: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
    const box = event.currentTarget.getBoundingClientRect();
    return [event.clientX - box.left, event.clientY - box.top];
  };
  const end = () => {
    const stroke = current.current;
    current.current = null;
    if (stroke) setTimeout(() => { stroke.inked = true; redraw(); }, 220);
  };

  return (
    <div className={`doodle${used ? " used" : ""}`}>
      <canvas ref={canvas} aria-label="Sketch area: drag to draw"
        onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); current.current = { points: [at(event)], inked: false }; strokes.current.push(current.current); setUsed(true); }}
        onPointerMove={(event) => { if (!current.current) return; current.current.points.push(at(event)); redraw(); }}
        onPointerUp={end} onPointerCancel={end} />
      <span className="doodle-hint" aria-hidden="true">psst: drag here to sketch.<br />It inks when you let go.</span>
      <button type="button" onClick={() => { strokes.current = []; redraw(); setUsed(false); }}>Clear</button>
    </div>
  );
}

export function CopyText({ text }: { text: string }) {
  const [label, setLabel] = useState("Copy");
  return (
    <button type="button" className="copy-btn" onClick={() => navigator.clipboard.writeText(text).then(() => setLabel("Copied"), () => setLabel("Select it above"))}>{label}</button>
  );
}
