// Pure helpers for the comic layer. No React, so they can be tested with node --test.
import type { ContributionCalendar } from "./github-client.ts";

// Contributions per week, oldest first, at most the last 52 weeks.
export function weeklyTotals(calendar: ContributionCalendar | null | undefined): number[] {
  if (!calendar) return [];
  return calendar.weeks
    .map((week) => week.contributionDays.reduce((sum, day) => sum + day.contributionCount, 0))
    .slice(-52);
}

// Tapered focus lines converging on (0, 0): thin at an inner ellipse, wide at an outer one.
// Deterministic for a given seed, so server and client render the same path.
export function focusLinesPath(count = 70, seed = 3): string {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const f = (n: number) => n.toFixed(1);
  let d = "";
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + rnd() * 0.05;
    const w = 0.008 + rnd() * 0.016;
    const k = 1 + rnd() * 0.35;
    d += `M${f(Math.cos(a) * 125 * k)} ${f(Math.sin(a) * 36 * k)}`;
    d += `L${f(Math.cos(a - w) * 320)} ${f(Math.sin(a - w) * 190)}`;
    d += `L${f(Math.cos(a + w) * 320)} ${f(Math.sin(a + w) * 190)}Z`;
  }
  return d;
}

// ── The Night Shift: Jaipur vs the agency in Michigan ──────────────────────
export const JAIPUR = "Asia/Kolkata";
export const AGENCY = "America/Detroit";
const OPEN = 9 * 60;
const CLOSE = 17 * 60;

export function clockIn(date: Date, timeZone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone, hour: "numeric", minute: "2-digit", hourCycle: "h23", weekday: "short" })
      .formatToParts(date).map((part) => [part.type, part.value]),
  );
  return { hour: Number(parts.hour) % 24, minute: Number(parts.minute), weekday: parts.weekday as string };
}

// "7:30 p.m." from minutes after midnight.
export function formatMinutes(total: number): string {
  const minutes = ((total % 1440) + 1440) % 1440;
  const hour = Math.floor(minutes / 60);
  return `${hour % 12 || 12}:${String(minutes % 60).padStart(2, "0")} ${hour < 12 ? "a.m." : "p.m."}`;
}

// Where the agency's 9–5 lands on Jaipur's clock right now (it moves with US daylight saving).
export function nightShift(date: Date) {
  const jaipur = clockIn(date, JAIPUR);
  const agency = clockIn(date, AGENCY);
  const jaipurMinutes = jaipur.hour * 60 + jaipur.minute;
  const agencyMinutes = agency.hour * 60 + agency.minute;
  const offset = (((jaipurMinutes - agencyMinutes) % 1440) + 1440) % 1440;
  const start = (OPEN + offset) % 1440;
  const end = (CLOSE + offset) % 1440;
  const weekend = agency.weekday === "Sat" || agency.weekday === "Sun";
  return {
    jaipurMinutes,
    agencyMinutes,
    opensInJaipur: formatMinutes(OPEN + offset),
    // Agency hours as spans on a 0–1440 Jaipur day; split in two when they cross midnight.
    spans: start < end ? [[start, end]] : [[start, 1440], [0, end]],
    open: !weekend && agencyMinutes >= OPEN && agencyMinutes < CLOSE,
    nextIsMonday: weekend || (agency.weekday === "Fri" && agencyMinutes >= CLOSE),
  };
}

// Tally marks in fives (four strokes and a diagonal), as SVG line segments.
export function tallyMarks(count: number, perRow = 6, seed = 7) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const marks: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let left = count, group = 0; left > 0; group++) {
    const x0 = 30 + (group % perRow) * 88;
    const y0 = 16 + Math.floor(group / perRow) * 84;
    const strokes = Math.min(4, left);
    for (let i = 0; i < strokes; i++) {
      const x = x0 + i * 14 + (rnd() - 0.5) * 3;
      marks.push({ x1: x, y1: y0 + (rnd() - 0.5) * 4, x2: x + (rnd() - 0.5) * 5, y2: y0 + 56 + (rnd() - 0.5) * 4 });
    }
    left -= strokes;
    if (left > 0 && strokes === 4) {
      marks.push({ x1: x0 - 10, y1: y0 + 50, x2: x0 + 54, y2: y0 + 8 });
      left--;
    }
  }
  return marks;
}
