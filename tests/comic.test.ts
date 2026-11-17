import assert from "node:assert/strict";
import test from "node:test";
import { focusLinesPath, nightShift, tallyMarks, weeklyTotals } from "../src/lib/comic.ts";

const day = (date: string, contributionCount: number) => ({ date, contributionCount });

test("weeklyTotals sums each week and keeps the last 52", () => {
  const weeks = Array.from({ length: 54 }, (_, i) => ({ contributionDays: [day("2026-01-01", i), day("2026-01-02", 1)] }));
  const totals = weeklyTotals({ from: "", to: "", totalContributions: 0, weeks });
  assert.equal(totals.length, 52);
  assert.equal(totals[0], 3); // week 2: 2 + 1
  assert.equal(totals.at(-1), 54); // week 53: 53 + 1
});

test("weeklyTotals returns nothing without a calendar", () => {
  assert.deepEqual(weeklyTotals(null), []);
});

test("focusLinesPath is deterministic and draws one wedge per line", () => {
  const path = focusLinesPath(12);
  assert.equal(path, focusLinesPath(12));
  assert.equal(path.match(/Z/g)?.length, 12);
});

test("nightShift follows US daylight saving", () => {
  const winter = nightShift(new Date("2026-11-06T12:00:00Z"));
  assert.equal(winter.opensInJaipur, "7:30 p.m.");
  assert.deepEqual(winter.spans, [[1170, 1440], [0, 210]]);
  assert.equal(nightShift(new Date("2026-07-01T12:00:00Z")).opensInJaipur, "6:30 p.m.");
});

test("nightShift knows when the agency is open", () => {
  assert.equal(nightShift(new Date("2026-11-04T15:00:00Z")).open, true); // Wed 10:00 ET
  const friday = nightShift(new Date("2026-11-06T23:00:00Z")); // Fri 18:00 ET
  assert.equal(friday.open, false);
  assert.equal(friday.nextIsMonday, true);
});

test("tallyMarks draws one mark per item, in fives", () => {
  assert.equal(tallyMarks(57).length, 57);
  assert.equal(tallyMarks(5).length, 5);
});
