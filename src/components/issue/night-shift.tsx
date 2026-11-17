import { education, experience, feedback } from "@/content";
import { Caption, Docket } from "@/components/comic";
import { NightClock } from "@/components/issue/night-clock";
import { ExtLink } from "@/components/ui";
import { tallyMarks } from "@/lib/comic";

// Experience as one literal night shift, then education "by day".
export function NightShift() {
  const job = experience[0];
  const [, ...afterFirst] = job.points;
  const shops = job.links ?? [];
  const quote = feedback.client;

  return (
    <section id="night-shift" className="ns" aria-labelledby="night-shift-heading">
      <NightClock>
        <h2 id="night-shift-heading">The Night Shift<i>.</i></h2>
      </NightClock>

      <Docket className="ns-docket" fields={[
        { label: "Shift", value: "No. 01" },
        { label: "Agency", value: job.org },
        { label: "Role", value: job.role },
        { label: "Based", value: job.place },
        { label: "Since", value: <span className="live">{job.period.replace("Present", "now")}</span> },
      ]} />

      <div className="shift">
        <article className="sp s-badge">
          <Caption className="sp-cap">{job.period.split(" – ")[0]}</Caption>
          <svg className="badge-art" viewBox="0 0 200 240" role="img" aria-label="Staff badge: freelancer crossed out, team stamped">
            <path d="M72 0 92 60M128 0 108 60" className="lanyard" />
            <rect x="86" y="54" width="28" height="16" className="clip" />
            <rect x="30" y="66" width="140" height="164" rx="8" className="card" />
            <path d="M30 96V74a8 8 0 0 1 8-8h124a8 8 0 0 1 8 8v22Z" className="band" />
            <text x="100" y="87" textAnchor="middle" className="org">{job.org}</text>
            <rect x="46" y="108" width="46" height="54" className="photo" />
            <path d="M54 146c4-7 12-10 15-10s11 3 15 10zM55 124h28l-5-2-1-8c-2-3-14-3-16 0l-1 8z" className="ink" /><circle cx="69" cy="128" r="8" className="ink" />
            <text x="102" y="126" className="who">P. GUPTA</text>
            <text x="102" y="142" className="mono">WEB DEV</text>
            <text x="46" y="188" className="mono">FREELANCER</text>
            <path d="M44 184H124" className="strike" />
            <g transform="rotate(-12 132 200)"><rect x="98" y="186" width="68" height="28" className="stamp" /><text x="132" y="208" textAnchor="middle" className="stamp-text">TEAM</text></g>
          </svg>
          <p>Joined as a <b>freelancer</b>, now <b>on the team</b>.</p>
        </article>

        {job.mergedPRs && (
          <article className="sp dk s-tally">
            <Caption className="sp-cap">{job.period.replace("Present", "now")}</Caption>
            <svg className="tally" viewBox="0 0 560 170" role="img" aria-label={`${job.mergedPRs} tally marks, one per merged pull request`}>
              {tallyMarks(job.mergedPRs).map((m, i) => <line key={i} x1={m.x1} y1={m.y1} x2={m.x2} y2={m.y2} />)}
            </svg>
            <div className="tally-row">
              <b>{job.mergedPRs} merged<small>pull requests</small></b>
              <p>Across the agency’s client and in-house sites. One mark per merge.</p>
            </div>
          </article>
        )}

        <article className="sp s-street">
          <div className="street">
            <Caption className="sp-cap">{job.place.split(" · ")[0]} · the client sites</Caption>
            <div className="moon" aria-hidden="true" />
            <ul className="shops">
              {shops.map((shop, i) => {
                const hq = i === shops.length - 1;
                return (
                  <li key={shop.href} className={`shop${hq ? " hq" : ""}${i % 2 ? " flat" : ""}`}>
                    <div className="win" style={{ "--h": `${[40, 70, 52, 34, 84][i % 5]}px` } as React.CSSProperties} aria-hidden="true" />
                    <ExtLink href={shop.href} className="sign">{shop.label}<small>{hq ? "the agency ↗" : "visit ↗"}</small></ExtLink>
                    <div className="door" aria-hidden="true" />
                  </li>
                );
              })}
            </ul>
            <p className="bay" aria-hidden="true">Grand Traverse Bay</p>
          </div>
          <div className="street-txt"><p>{afterFirst[1]}</p><ul className="tags" aria-label="Built with"><li>Next.js</li><li>Resend</li><li>Turso</li></ul></div>
        </article>

        <article className="sp s-audit">
          <Caption className="sp-cap">In-house</Caption>
          <svg className="gauge" viewBox="0 0 240 146" role="img" aria-label="Audit gauge (illustration, no score)">
            <path d="M30 120A90 90 0 0 1 75 42.06" className="g-red" />
            <path d="M75 42.06A90 90 0 0 1 165 42.06" className="g-amber" />
            <path d="M165 42.06A90 90 0 0 1 210 120" className="g-ink" />
            <path d="M120 120 180 88" className="needle" /><circle cx="120" cy="120" r="9" className="hub" />
            <text x="120" y="142" textAnchor="middle" className="mono">PAGESPEED · LIGHTHOUSE AUDIT</text>
          </svg>
          <p>{afterFirst[0]}</p>
        </article>

        <article className="sp s-quote">
          <Caption className="sp-cap">The client, on the record</Caption>
          <div className="quote-wrap">
            <span className="offpanel" aria-hidden="true">the boss, off-panel</span>
            <blockquote className="qballoon" cite={quote.href}>
              <svg className="qtail" viewBox="0 0 40 36" aria-hidden="true"><path d="M4 36 36 0 22 36" /></svg>
              <p>{quote.fullText?.[0].split(". ")[0]}. {quote.excerpt}</p>
            </blockquote>
          </div>
          <p className="q-attr"><span><b>{quote.author}</b> · {quote.context.split(" · ")[0]}</span><ExtLink href={quote.href}>Full recommendation ↗</ExtLink></p>
        </article>
      </div>

      <div className="ghost-shift">
        <div className="gp" aria-hidden="true" /><div className="gp" aria-hidden="true" /><div className="gp" aria-hidden="true" />
        <div className="gtxt"><strong>Shift 02, still in pencils.</strong><span>Open to full-time roles and freelance projects.</span><a className="comic-btn" href="#letters">Pitch me a story <span aria-hidden="true">→</span></a></div>
      </div>

      <Caption className="byday-cap">Meanwhile, by day…</Caption>
      <div className="byday" id="by-day">
        {education.map((school) => (
          <article key={school.name} className="sch">
            <h3>{school.name}</h3>
            <p>{school.degree}</p>
            <p className="meta">{school.place} · {school.period}</p>
            {school.note && <p className="big"><b>{school.note.replace(/^SGPA /, "")}</b><span>{school.note.startsWith("SGPA") ? "SGPA" : "Class XII"}</span></p>}
          </article>
        ))}
      </div>
    </section>
  );
}
