import type { ReactNode } from "react";

// Case art: one original illustration per project, each drawn as a map of the
// thing (DESIGN.md): ink lines, hatching for tone, amber for light, red for the
// event, a ring on what the case is about. Illustrations, not real data.
type Pt = [number, number];
const W = 640, H = 420;

// Fixed-seed random, so the server and the browser draw the same picture.
const random = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

// Keep the part of `poly` on p's side of the bisector between p and q.
function clip(poly: Pt[], p: Pt, q: Pt): Pt[] {
  const [dx, dy] = [q[0] - p[0], q[1] - p[1]];
  const k = (dx * (p[0] + q[0]) + dy * (p[1] + q[1])) / 2;
  const side = ([x, y]: Pt) => dx * x + dy * y - k;
  return poly.flatMap((a, i) => {
    const b = poly[(i + 1) % poly.length], sa = side(a), sb = side(b);
    const out: Pt[] = sa <= 0 ? [a] : [];
    if (sa * sb < 0) { const t = sa / (sa - sb); out.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]); }
    return out;
  });
}

// Voronoi cells of a jittered grid (wards, fields), each with a random tone.
function cells(seed: number, cols: number, rows: number, sx: number, sy: number) {
  const rand = random(seed), seeds: Pt[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) seeds.push([c * sx - 10 + rand() * sx * 5 / 7, r * sy - 14 + rand() * sy * 2 / 3]);
  const frame: Pt[] = [[-4, -4], [W + 4, -4], [W + 4, H + 4], [-4, H + 4]];
  return seeds
    .map((p) => ({ p, poly: seeds.reduce((poly, q) => (q === p ? poly : clip(poly, p, q)), frame), tone: rand() }))
    .filter((c) => c.poly.length > 2) // seeds past the edge leave no visible cell
    .map(({ p, poly, tone }) => ({ p, tone, d: "M" + poly.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") + "Z" }));
}
const tone = (t: number, lamp = 0.2, hatch = 0.6) => (t < lamp ? "var(--lamp)" : t < hatch ? "url(#case-hatch)" : "none");

function Art({ children, bg = "var(--surface)" }: { children: ReactNode; bg?: string }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" className="project-visual" aria-hidden="true">
      <defs>
        <pattern id="case-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V9" stroke="var(--ink)" strokeOpacity=".7" strokeWidth="1.3" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill="var(--surface)" />
      {bg !== "var(--surface)" && <rect width={W} height={H} fill={bg} />}
      {children}
    </svg>
  );
}

function Pin({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0C-4-12-15-20-15-32a15 15 0 0 1 30 0C15-20 4-12 0 0Z" fill="var(--signal)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
      <circle cy="-32" r="5.5" fill="var(--paper)" />
    </g>
  );
}
const Ring = ({ x, y, r }: { x: number; y: number; r: number }) => <circle cx={x} cy={y} r={r} fill="none" stroke="var(--ink)" strokeWidth="2.5" strokeDasharray="7 6" />;
function Tag({ x, y, w, children }: { x: number; y: number; w: number; children: string }) {
  return <><rect x={x - w / 2} y={y - 13} width={w} height="26" fill="var(--ink)" /><text x={x} y={y + 5} textAnchor="middle" fill="var(--paper)">{children}</text></>;
}

// EcoAudit: the case board. One repo file under the magnifier, and a pinned
// card for each kind of waste it hunts, threaded to the line that proves it.
const evidence = [
  { label: "CODE", x: 30, y: 30, r: -4, hi: 1, to: [228, 222] },
  { label: "INFRA", x: 30, y: 240, r: 3, hi: 2, to: [228, 222] },
  { label: "LOGGING", x: 460, y: 30, r: 4, hi: 0, to: [412, 222] },
  { label: "LLM", x: 460, y: 240, r: -3, hi: 3, to: [412, 222] },
];
const fileLines = [[0, 90, 40], [1, 120, 0], [1, 60, 70], [2, 110, 0], [2, 140, 0], [1, 80, 30], [0, 0, 0], [0, 100, 50], [1, 130, 0]];
function EcoAudit() {
  return (
    <Art bg="url(#case-hatch)">
      {evidence.map(({ label, x, y, r, hi }) => (
        <g key={label} transform={`translate(${x} ${y}) rotate(${r} 75 60)`}>
          <rect x="6" y="6" width="150" height="116" fill="var(--ink)" />
          <rect width="150" height="116" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
          <rect width="150" height="28" fill="var(--ink)" />
          <text x="12" y="19" fill="var(--paper)">{label}</text>
          <rect x="8" y={36 + hi * 18} width="134" height="16" fill="var(--lamp)" />
          {[96, 64, 112, 76].map((w, i) => <path key={i} d={`M${16 + (i % 2) * 14} ${44 + i * 18}h${w}`} stroke="var(--ink)" strokeOpacity=".75" strokeWidth="6" />)}
        </g>
      ))}
      <rect x="227" y="104" width="210" height="250" fill="var(--ink)" />
      <rect x="215" y="92" width="210" height="250" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
      <rect x="215" y="92" width="210" height="24" fill="url(#case-hatch)" stroke="var(--ink)" strokeWidth="2.5" />
      <rect x="217" y="212" width="206" height="20" fill="var(--lamp)" />
      {fileLines.map(([indent, a, b], i) => a > 0 && <path key={i} d={`M${232 + indent * 18} ${138 + i * 21}h${a}${b ? `m10 0h${b}` : ""}`} stroke="var(--ink)" strokeOpacity=".8" strokeWidth="7" />)}
      {evidence.map(({ label, x, y, to }) => <path key={label} d={`M${x + 126} ${y + 2}Q${(x + 126 + to[0]) / 2} ${(y + to[1]) / 2 + 60} ${to[0]} ${to[1]}`} fill="none" stroke="var(--signal)" strokeWidth="2.5" />)}
      <path d="M336 258l46 46" stroke="var(--ink)" strokeWidth="16" strokeLinecap="round" />
      <path d="M364 286l18 18" stroke="var(--signal)" strokeWidth="9" strokeLinecap="round" />
      <circle cx="304" cy="222" r="46" fill="var(--paper)" fillOpacity=".2" stroke="var(--ink)" strokeWidth="6" />
      {evidence.map(({ label, x, y }) => <Pin key={label} x={x + 126} y={y + 20} s={0.7} />)}
      <circle cx="228" cy="222" r="5" fill="var(--signal)" stroke="var(--ink)" strokeWidth="2" />
      <circle cx="412" cy="222" r="5" fill="var(--signal)" stroke="var(--ink)" strokeWidth="2" />
      <g transform="translate(320 52) rotate(-5)">
        <rect x="-96" y="-19" width="192" height="38" fill="var(--paper)" stroke="var(--signal)" strokeWidth="3" />
        <rect x="-91" y="-14" width="182" height="28" fill="none" stroke="var(--signal)" strokeWidth="1.5" />
        <text y="5" textAnchor="middle" style={{ fill: "var(--signal)" }}>≈120 DETECTORS</text>
      </g>
    </Art>
  );
}

// JanSamadhan: Delhi's wards, the complaints pinned on them, one ward in focus.
function WardMap() {
  const wards = cells(7, 10, 7, 70, 68);
  const focus: Pt = [255, 182];
  const picked = wards.reduce((a, b) => (Math.hypot(b.p[0] - focus[0], b.p[1] - focus[1]) < Math.hypot(a.p[0] - focus[0], a.p[1] - focus[1]) ? b : a));
  const river = "M482-10C470 60 502 108 488 168S468 262 492 320 502 396 488 440";
  return (
    <Art>
      {wards.map((w) => <path key={w.d} d={w.d} fill={w === picked ? "#f6dfb4" : tone(w.tone)} stroke="var(--ink)" strokeWidth="1.8" strokeLinejoin="round" />)}
      <path d={river} stroke="var(--ink)" strokeWidth="20" fill="none" />
      <path d={river} stroke="#cfe3f0" strokeWidth="15" fill="none" />
      <text transform="translate(508 292) rotate(90)" style={{ fontSize: 17 }}>Yamuna</text>
      <Ring x={focus[0]} y={focus[1] - 18} r={62} />
      <Pin x={focus[0]} y={focus[1]} s={1.5} />
      <Pin x={152} y={84} />
      <Pin x={370} y={300} s={1.05} />
      <Pin x={92} y={346} s={1.05} />
    </Art>
  );
}

// RailMind: two trains on one track, closing fast. The plan throws the switch
// and the red train takes the loop before they meet.
function Loco({ fill }: { fill: string }) {
  return (
    <>
      <path d="M0-14V-60H94L134-38V-14Z" fill={fill} stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
      <path d="M8-66H64" stroke="var(--ink)" strokeWidth="6" />
      <rect x="12" y="-54" width="28" height="16" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
      <path d="M0-28H130" stroke="var(--lamp)" strokeWidth="5" />
      <circle cx="120" cy="-38" r="5" fill="var(--lamp)" stroke="var(--ink)" strokeWidth="2" />
      <path d="M0-14H134M134-14l14 12h-20Z" stroke="var(--ink)" strokeWidth="6" fill="var(--ink)" strokeLinejoin="round" />
      {[18, 44, 90, 116].map((x) => <g key={x}><circle cx={x} cy="-6" r="8" fill="var(--ink)" /><circle cx={x} cy="-6" r="2.5" fill="var(--paper)" /></g>)}
    </>
  );
}
// A train, with two faded copies trailing behind it for motion blur.
function Train({ x, dir, fill }: { x: number; dir: 1 | -1; fill: string }) {
  return [0.08, 0.2, 1].map((opacity, i) => (
    <g key={i} opacity={opacity} transform={`translate(${x - dir * (2 - i) * 22} 300) scale(${dir * 1.5} 1.5)`}><Loco fill={fill} /></g>
  ));
}
function Track({ d }: { d: string }) {
  return <g fill="none"><path d={d} stroke="var(--ink)" strokeOpacity=".8" strokeWidth="22" strokeDasharray="4 14" /><path d={d} stroke="var(--ink)" strokeWidth="12" /><path d={d} stroke="var(--surface)" strokeWidth="5" /></g>;
}
const speed = [[214, 0, 50, 3], [232, 8, 64, 5], [250, 0, 42, 3], [268, 14, 60, 4], [284, 0, 52, 2], [218, 598, 640, 3], [236, 586, 640, 5], [256, 606, 640, 3], [274, 592, 640, 4]];
function RailMind() {
  const main = "M-10 306H650", loop = "M270 306C360 306 420 340 500 440";
  return (
    <Art>
      {Array.from({ length: 36 }, (_, i) => {
        const a = (i * 10 + (i % 3) * 3) * Math.PI / 180, r0 = 150 + (i % 4) * 22;
        return <path key={i} d={`M${320 + Math.cos(a) * r0} ${250 + Math.sin(a) * r0}L${320 + Math.cos(a) * 480} ${250 + Math.sin(a) * 480}`} stroke="var(--ink)" strokeOpacity=".22" strokeWidth={1 + (i % 3)} />;
      })}
      <path d="M0 196Q120 136 240 186T480 174T640 164V330H0Z" fill="url(#case-hatch)" opacity=".45" />
      <rect y="318" width={W} height="110" fill="url(#case-hatch)" />
      <path d="M0 318H640" stroke="var(--ink)" strokeWidth="2" />
      <Track d={main} />
      <Track d={loop} />
      {speed.map(([y, x1, x2, w]) => <path key={`${x1}-${y}`} d={`M${x1} ${y}H${x2}`} stroke="var(--ink)" strokeWidth={w} strokeLinecap="round" />)}
      <path d="M318 298V176" stroke="var(--ink)" strokeWidth="4" />
      <rect x="306" y="144" width="24" height="42" rx="5" fill="var(--ink)" />
      <circle cx="318" cy="156" r="6" fill="var(--lamp)" />
      <circle cx="318" cy="173" r="6" fill="var(--surface)" fillOpacity=".3" />
      <Train x={40} dir={1} fill="var(--signal)" />
      <Train x={600} dir={-1} fill="var(--ink)" />
      <path d="M264 290H276C362 290 416 322 484 410" fill="none" stroke="var(--signal)" strokeWidth="3" strokeDasharray="8 6" />
      <path d="m-9-8 9 8-9 8" fill="none" stroke="var(--signal)" strokeWidth="3" transform="translate(484 410) rotate(52)" />
      <Ring x={292} y={300} r={44} />
      <Tag x={566} y={346} w={90}>DIVERT</Tag>
    </Art>
  );
}

// oracle-academy: a CLI. The Student Hub, driven from a terminal.
const session: [string, number][] = [["oracle login", 170], ["oracle whoami", 120], ["oracle list", 0]];
function OracleAcademy() {
  return (
    <Art bg="url(#case-hatch)">
      <g transform="rotate(-2 320 210)">
        <rect x="58" y="48" width="540" height="340" fill="var(--ink)" />
        <rect x="46" y="36" width="540" height="340" fill="var(--ink)" stroke="var(--ink)" strokeWidth="3" />
        <rect x="46" y="36" width="540" height="32" fill="var(--paper)" stroke="var(--ink)" strokeWidth="3" />
        {["var(--signal)", "var(--lamp)", "var(--surface)"].map((fill, i) => <circle key={fill} cx={66 + i * 18} cy="52" r="5.5" fill={fill} stroke="var(--ink)" strokeWidth="1.5" />)}
        <text x="316" y="57" textAnchor="middle">~/oracle-academy</text>
        {session.map(([cmd, out], i) => (
          <g key={cmd}>
            <text x="70" y={100 + i * 56} fill="var(--paper)"><tspan style={{ fill: "var(--lamp)" }}>$ </tspan>{cmd}</text>
            {out > 0 && <><text x="86" y={128 + i * 56} style={{ fill: "var(--lamp)" }}>✓</text><path d={`M108 ${123 + i * 56}h${out}`} stroke="var(--paper)" strokeOpacity=".6" strokeWidth="7" /></>}
          </g>
        ))}
        <rect x="80" y="252" width="400" height="24" fill="var(--lamp)" />
        {[0, 1, 2].map((row) => [[90, 60], [170, 170], [360, 70]].map(([x, w]) => (
          <path key={`${row}-${x}`} d={`M${x} ${236 + row * 28}h${w}`} stroke={row === 1 ? "var(--ink)" : "var(--paper)"} strokeOpacity={row === 1 ? 0.85 : 0.6} strokeWidth="7" />
        )))}
        <ellipse cx="280" cy="264" rx="226" ry="30" fill="none" stroke="var(--lamp)" strokeWidth="2.5" strokeDasharray="7 6" />
        <text x="70" y="340" fill="var(--paper)"><tspan style={{ fill: "var(--lamp)" }}>$ </tspan>oracle sections --class</text>
        <rect x="318" y="326" width="11" height="18" fill="var(--signal)" />
      </g>
    </Art>
  );
}

// Leafline: city blocks, a spoken complaint pinned on one, routed by street to
// the department that owns it.
function Leafline() {
  const rand = random(3), blocks: { x: number; y: number; t: number }[] = [];
  for (let r = 0; r < 7; r++) { const shift = rand() * 40; for (let c = 0; c < 9; c++) blocks.push({ x: c * 78 - 30 + shift, y: r * 66 - 24, t: rand() }); }
  return (
    <Art>
      {blocks.map((b) => <rect key={`${b.x}-${b.y}`} x={b.x} y={b.y} width="64" height="52" fill={tone(b.t, 0.15, 0.55)} stroke="var(--ink)" strokeWidth="1.8" />)}
      <path d="M-10 440L660 20" stroke="var(--ink)" strokeWidth="24" />
      <path d="M-10 440L660 20" stroke="var(--surface)" strokeWidth="18" />
      <path d="M212 250V312H540V346" fill="none" stroke="var(--signal)" strokeWidth="4" strokeDasharray="10 7" />
      <Ring x={212} y={232} r={60} />
      <Pin x={212} y={250} s={1.5} />
      <Pin x={420} y={350} />
      <Pin x={560} y={250} />
      <path d="M150 168l38 22-14-30" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="118" cy="128" rx="78" ry="42" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2.5" />
      <path d="M82 114h70M72 132h90M90 150h50" stroke="var(--ink)" strokeOpacity=".6" strokeWidth="6" />
      <Tag x={540} y={360} w={130}>DEPARTMENT</Tag>
    </Art>
  );
}

const scenes: Record<string, () => ReactNode> = { ecoaudit: EcoAudit, jansamadhan: WardMap, railmind: RailMind, "oracle-academy": OracleAcademy, leafline: Leafline };

export function ProjectVisual({ slug }: { slug: string }) {
  const Scene = scenes[slug] ?? EcoAudit;
  return <Scene />;
}
