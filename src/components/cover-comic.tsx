"use client";

import Image from "next/image";
import { useRef, useState, type PointerEvent } from "react";
import { Balloon, Burst, Caption } from "@/components/comic";
import type { hero as heroCopy } from "@/content";

type Copy = typeof heroCopy;

const art = { src: "/art/the-night-shift.webp", width: 1000, height: 1250, sizes: "(min-width: 800px) 400px, 80vw" };

// Issue #1 as a physical comic: it leans toward the mouse, and opening it swings
// the cover back to page 2, the recap. The inside page is inert while closed.
export function CoverComic({ weeks, copy, availability }: { weeks: number[]; copy: Copy; availability: string }) {
  const [open, setOpen] = useState(false);
  const inner = useRef<HTMLDivElement>(null);

  const tilt = (x: number, y: number) => {
    inner.current?.style.setProperty("--ry", `${x}deg`);
    inner.current?.style.setProperty("--rx", `${y}deg`);
  };
  const toggle = () => {
    tilt(0, 0);
    setOpen((value) => !value);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (open || event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = event.currentTarget.getBoundingClientRect();
    tilt(((event.clientX - box.left) / box.width - 0.5) * 12, -((event.clientY - box.top) / box.height - 0.5) * 10);
  };

  const cut = copy.series.lastIndexOf(" "); // "The Prxmy" / "Files" on two lines
  const max = Math.max(1, ...weeks);
  const slot = 100 / Math.max(weeks.length, 1);

  return (
    <figure className={`book-wrap${open ? " open" : ""}`} aria-label={`Issue #${copy.issue.number} of ${copy.series}`}>
      <div
        className="book"
        onPointerMove={onPointerMove}
        onPointerLeave={() => tilt(0, 0)}
        onClick={(event) => { if (!(event.target as Element).closest("a,button")) toggle(); }}
      >
        <div className="book-inner" ref={inner}>
          <div className="book-pages">
            <div className="book-inside" inert={!open}>
              <Caption>Previously in {copy.series}…</Caption>
              <ul>
                {copy.recap.map((line) => <li key={line.lead}><b>{line.lead}</b>{line.rest}</li>)}
              </ul>
              <div className="book-inside-actions">
                <a href="/resume" className="comic-btn">Résumé <span aria-hidden="true">→</span></a>
                <span>{availability}</span>
              </div>
            </div>
          </div>

          <div className="book-cover">
            <div className="book-face book-front">
              <div className="c-top">
                <p className="c-box">No.<b>{copy.issue.number}</b>{copy.issue.date}<br />{copy.issue.price}</p>
                <div>
                  <p className="c-logo">{copy.series.slice(0, cut)}<br />{copy.series.slice(cut + 1)}<i>.</i></p>
                  <p className="c-sub">{copy.tagline}</p>
                </div>
              </div>
              <div className="c-art">
                <Image {...art} alt="" aria-hidden className="c-pencils" loading="eager" />
                <Image {...art} alt="Original noir illustration: a detective at a desk at night, studying diagrams under a red lamp" className="c-inks" loading="eager" fetchPriority="high" />
                <Balloon className="c-balloon">{copy.balloon[0]}<br />{copy.balloon[1]}</Balloon>
                <svg className="c-tail" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M24 18.4 L37 26.5 L31.5 17.2" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
              <div className="c-bot">
                <p className="c-lines"><b>Inside:</b> {copy.coverLines}</p>
                {weeks.length > 0 && (
                  <div className="c-bar" aria-hidden="true">
                    <svg viewBox="0 0 100 40" preserveAspectRatio="none">
                      {weeks.map((count, i) => (
                        <rect key={i} x={(i * slot).toFixed(2)} y="0" height="40" width={Math.max(0.35, (count / max) * slot * 0.85).toFixed(2)} />
                      ))}
                    </svg>
                    <span>{weeks.length} weeks</span>
                  </div>
                )}
              </div>
              <Burst className="c-flash">{copy.burst.text}<small>{copy.burst.note}</small></Burst>
            </div>
            <div className="book-face book-back" aria-hidden="true">
              <b>{copy.series}</b>
              <span>No. {copy.issue.number}. Published by Prakhar Gupta, Jaipur, India.</span>
              <span>Written, pencilled, inked and deployed by P. Gupta.</span>
            </div>
          </div>
        </div>
      </div>
      <button type="button" className="book-toggle" aria-expanded={open} onClick={toggle}>
        {open ? "Close the file" : "Open the file"}
      </button>
    </figure>
  );
}
