import type { ContributionCalendar } from "@/lib/github-client";
import { Caption } from "@/components/comic";
import { weeklyTotals } from "@/lib/comic";
import { profile } from "@/content";

// GitHub contributions as a night skyline: one building per week, one lit window per contribution.
export function CitySkyline({ calendar }: { calendar: ContributionCalendar | null | undefined }) {
  const weeks = weeklyTotals(calendar);
  if (!calendar || weeks.length === 0) return null;
  const width = 1000, height = 300, pad = 20, gap = 3;
  const slot = (width - pad * 2) / weeks.length;
  const busiest = Math.max(...weeks);
  const github = profile.links.find((link) => link.label === "GitHub");

  return (
    <section id="city" className="city" aria-labelledby="city-heading">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMax slice" role="img"
        aria-label={`Skyline of ${weeks.length} weeks of GitHub contributions: ${calendar.totalContributions.toLocaleString("en-US")} in all, ${busiest} in the busiest week.`}>
        <circle cx={width - 110} cy="64" r="22" className="moon" />
        <circle cx={width - 100} cy="58" r="20" className="sky" />
        {weeks.map((count, i) => {
          // Capped at 60% of the sky, so the moon and copy stay clear; the busiest weeks fill every window.
          const cols = 2, rows = Math.min(24, Math.max(2, Math.ceil((count + 2) / cols)));
          const tall = rows * 7 + 16 + ((i * 37) % 19);
          const x = pad + i * slot, w = slot - gap, cw = (w - 4) / cols;
          return (
            <g key={i}>
              <rect x={x} y={height - tall} width={w} height={tall} className={i % 3 ? "bldg" : "bldg alt"} />
              {Array.from({ length: rows * cols }, (_, k) => {
                const row = Math.floor(k / cols), col = k % cols;
                return <rect key={k} x={x + 2 + col * cw + cw * 0.18} y={height - 16 - row * 7} width={cw * 0.64} height="3.4" className={k < count ? "lit" : "dark"} />;
              })}
            </g>
          );
        })}
      </svg>
      <div className="city-copy">
        <Caption>The last 12 months</Caption>
        <h2 id="city-heading">The City at Night<i>.</i></h2>
        <p>One building per week. Every lit window is a contribution: <b>{calendar.totalContributions.toLocaleString("en-US")}</b> in all.</p>
        {github && <a href={github.href}>See it on GitHub ↗</a>}
      </div>
    </section>
  );
}
