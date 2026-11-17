"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { Caption, Stamp } from "@/components/comic";

type Report = { number: number; title: string; why?: string; added: number; removed: number; highlight: boolean; href: string; merged: string | null };
export type Folder = {
  name: string;
  fullName: string;
  about: string;
  stars: number | null;
  merged: number;
  mergedHref: string;
  quote: { text: string; author: string; href: string; pr: string } | null;
  prs: Report[];
};

function Evidence({ pr, scale }: { pr: Report; scale: number }) {
  const total = pr.added + pr.removed;
  return (
    <div className="diff">
      <div className="bar" style={{ width: `${(Math.sqrt(total) / scale) * 100}%` }} aria-hidden="true">
        <i style={{ width: `${(pr.added / total) * 100}%` }} /><i />
      </div>
      <span>+{pr.added.toLocaleString("en")} <em>−{pr.removed.toLocaleString("en")}</em> lines</span>
    </div>
  );
}

function ReportSlip({ pr, folder, lead, scale }: { pr: Report; folder: Folder; lead: boolean; scale: number }) {
  return (
    <article className={`report ${lead ? "lead" : "sm"}`}>
      <p className="r-title"><span>Field report</span><b>No. {pr.number}</b></p>
      {lead && (
        <dl className="r-fields">
          <div><dt>Jurisdiction</dt><dd>{folder.fullName}</dd></div>
          <div><dt>Closed</dt><dd>{pr.merged ?? "Merged"}</dd></div>
          <div><dt>Evidence</dt><dd>+{pr.added} −{pr.removed}</dd></div>
        </dl>
      )}
      <div className="r-body">
        {lead && <span className="lbl">Incident</span>}
        <p className="inc">{pr.title}</p>
        {pr.why && <Caption className="r-why">Why it mattered: {pr.why}</Caption>}
        <div className="r-foot"><Evidence pr={pr} scale={scale} /><a href={pr.href}>Read PR #{pr.number} ↗</a></div>
      </div>
      <Stamp className="mstamp" date={pr.merged?.toUpperCase()}>Merged</Stamp>
    </article>
  );
}

// One manila folder per project, as an accessible tab list (arrow keys move between tabs).
export function FieldFolders({ folders }: { folders: Folder[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (event: KeyboardEvent, index: number) => {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + folders.length) % folders.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="folders">
      <div className="tabs" role="tablist" aria-label="Open-source projects">
        {folders.map((folder, i) => (
          <button key={folder.fullName} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab" id={`fr-tab-${i}`} aria-controls={`fr-panel-${i}`}
            aria-selected={i === active} tabIndex={i === active ? 0 : -1} className="tab" onClick={() => setActive(i)} onKeyDown={(event) => onKey(event, i)}>
            {folder.name}<small>{folder.stars !== null && `★ ${folder.stars} · `}{folder.merged} merged</small>
          </button>
        ))}
      </div>
      {folders.map((folder, i) => {
        const lead = folder.prs.find((pr) => pr.why) ?? folder.prs[0];
        const more = folder.prs.filter((pr) => pr.highlight && pr !== lead);
        const rest = folder.prs.filter((pr) => !pr.highlight && pr !== lead);
        const scale = Math.max(...folder.prs.map((pr) => Math.sqrt(pr.added + pr.removed)));
        return (
          <div key={folder.fullName} className="folder" role="tabpanel" id={`fr-panel-${i}`} aria-labelledby={`fr-tab-${i}`} hidden={i !== active}>
            <div className="f-head">
              <div><h3>{folder.name}<span>{folder.fullName}</span></h3><p>{folder.about}.</p></div>
              <p className="f-meta">{folder.stars !== null && <span>★ {folder.stars} stars</span>}<a href={folder.mergedHref}>All {folder.merged} merged ↗</a></p>
            </div>
            <div className="lead-wrap">
              <ReportSlip pr={lead} folder={folder} lead scale={scale} />
              {folder.quote ? (
                <aside className="clip">
                  <svg className="pc" viewBox="0 0 22 58" aria-hidden="true"><path d="M7 50V12a5 5 0 0 1 10 0v38a8 8 0 0 1-16 0V16" /></svg>
                  <q>{folder.quote.text}</q>
                  <span>{folder.quote.author} · maintainer · <a href={folder.quote.href}>on PR #{folder.quote.pr} ↗</a></span>
                </aside>
              ) : process.env.NODE_ENV !== "production" && (
                // Content gap, shown to the author in development only.
                <aside className="clip none"><p>No maintainer quote clipped yet.</p></aside>
              )}
            </div>
            {more.length > 0 && <div className="more">{more.map((pr) => <ReportSlip key={pr.number} pr={pr} folder={folder} lead={false} scale={scale} />)}</div>}
            {rest.length > 0 && (
              <div className="ledger">
                <table>
                  <caption>Also merged</caption>
                  <thead><tr><th scope="col">No.</th><th scope="col">Closed</th><th scope="col">What changed</th><th scope="col">Lines</th></tr></thead>
                  <tbody>
                    {rest.map((pr) => (
                      <tr key={pr.number}><td className="mono"><a href={pr.href}>#{pr.number}</a></td><td className="mono">{pr.merged ?? "—"}</td><td>{pr.title}</td><td className="mono">+{pr.added} −{pr.removed}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
