import type { ReactNode } from "react";
import { focusLinesPath } from "@/lib/comic";

// Shared comic devices. Each one has a job (see DESIGN.md, "Comic devices and their jobs").

// The narrator: time, place, impact. Amber, because amber means light.
export function Caption({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`comic-caption ${className}`}>{children}</span>;
}

// A person speaking. Position the tail with CSS on the caller's class.
export function Balloon({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`comic-balloon ${className}`}>{children}</p>;
}

// An event happened. One per screen.
export function Burst({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`comic-burst ${className}`}>
      <svg viewBox="0 0 150 120" preserveAspectRatio="none" aria-hidden="true">
        <polygon points="75,3 88,32 124,14 110,48 147,58 112,72 128,108 90,90 70,118 62,86 18,98 40,66 3,44 46,40 36,6" />
      </svg>
      <span>{children}</span>
    </div>
  );
}

// A status decision (MERGED, TEAM, BOOKED), with its date when there is one.
export function Stamp({ children, date, className = "" }: { children: ReactNode; date?: string; className?: string }) {
  return (
    <span className={`comic-stamp ${className}`}>
      {children}
      {date && <small>{date}</small>}
    </span>
  );
}

// A typed strip of real metadata: case number, dates, place, role.
export function Docket({ fields, className = "" }: { fields: { label: string; value: ReactNode }[]; className?: string }) {
  return (
    <dl className={`comic-docket ${className}`}>
      {fields.map((field) => (
        <div key={field.label}>
          <dt>{field.label}</dt>
          <dd>{field.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// A handwritten margin note in non-photo blue, with a drawn arrow to what it means.
export function PencilNote({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`pencil-note ${className}`}>
      <svg viewBox="0 0 46 30" aria-hidden="true"><path d="M44 24C32 26 14 22 6 6" /><path d="M2 12 6 5 13 9" /></svg>
      <span>{children}</span>
    </p>
  );
}

// Tapered lines converging on whatever sits at the centre of the parent.
export function FocusLines({ className = "" }: { className?: string }) {
  return (
    <svg className={`comic-focus ${className}`} viewBox="-260 -150 520 300" aria-hidden="true">
      <path d={focusLinesPath()} />
    </svg>
  );
}
