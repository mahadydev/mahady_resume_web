"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  type CSSProperties,
  type PointerEvent as RPointerEvent,
} from "react";
import Link from "next/link";
import styles from "./career-app.module.css";
import { cv } from "@/data/cv";
import { FxProvider } from "@/fx/fx-provider";
import { mintRain } from "@/fx/mint-rain";
import {
  click,
  tap,
  pop,
  swipe,
  tone,
  setMuted as fxSetMuted,
  isMuted as fxIsMuted,
} from "@/fx/sound";
import { store } from "@/fx/store";

/* -------------------------------------------------------------------------
 * App list — top 6 → grid, last 2 → dock. Order matches prototype.
 * ---------------------------------------------------------------------- */
type AppId =
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "awards"
  | "education"
  | "terminal"
  | "contact";

interface AppMeta {
  id: AppId;
  label: string;
  icon: string;
  color: string;
  badge?: string;
}

const APP_LIST: AppMeta[] = [
  { id: "about", label: "About", icon: "👤", color: "linear-gradient(140deg, #00e5a0, #009168)" },
  {
    id: "experience",
    label: "Career",
    icon: "💼",
    color: "linear-gradient(140deg, #9d8cff, #5a4ed4)",
    badge: "5",
  },
  { id: "projects", label: "Projects", icon: "🚀", color: "linear-gradient(140deg, #ff9b6b, #d65a2a)" },
  { id: "skills", label: "Skills", icon: "⚡", color: "linear-gradient(140deg, #ffc266, #d68a2a)" },
  {
    id: "awards",
    label: "Awards",
    icon: "🏆",
    color: "linear-gradient(140deg, #ff6f9c, #c4356b)",
    badge: "2",
  },
  { id: "education", label: "Edu", icon: "🎓", color: "linear-gradient(140deg, #6bd0ff, #2f7fc4)" },
  { id: "terminal", label: "Term", icon: "▶", color: "linear-gradient(140deg, #1a1d24, #0a0b10)" },
  { id: "contact", label: "Contact", icon: "✦", color: "linear-gradient(140deg, #00e5a0, #00b483)" },
];

/* -------------------------------------------------------------------------
 * Mouse-parallax hook
 * ---------------------------------------------------------------------- */
interface MouseXY {
  x: number;
  y: number;
}
function useMouseParallax(): MouseXY {
  const [m, setM] = useState<MouseXY>({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setM({ x, y });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);
  return m;
}

/* -------------------------------------------------------------------------
 * Floating 3D shape — SVG variants
 * ---------------------------------------------------------------------- */
interface ShapeProps {
  x: number;
  y: number;
  z: number;
  rot: number;
  size: number;
  color: string;
  kind: "cube" | "ring" | "sphere" | "dart" | "grid";
  mouse: MouseXY;
}
function Shape({ x, y, z, rot, size, color, kind, mouse }: ShapeProps) {
  const tx = mouse.x * z * 30;
  const ty = mouse.y * z * 30;
  const transform = `translate3d(${x}px, ${y}px, 0) translate(${tx}px, ${ty}px) rotate(${
    rot + mouse.x * z * 12
  }deg)`;
  return (
    <div className={styles.shape} style={{ transform, width: size, height: size }}>
      {kind === "cube" && (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <defs>
            <linearGradient id={`g-${color}-${size}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor={color} stopOpacity="0.7" />
              <stop offset="1" stopColor={color} stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            d="M50 8 L88 30 L88 70 L50 92 L12 70 L12 30 Z"
            stroke={color}
            strokeWidth="1"
            fill={`url(#g-${color}-${size})`}
          />
          <path
            d="M50 8 L50 50 M50 50 L88 30 M50 50 L12 30"
            stroke={color}
            strokeWidth="1"
            opacity="0.5"
          />
        </svg>
      )}
      {kind === "ring" && (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="38" stroke={color} strokeWidth="1" opacity="0.7" />
          <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="0.5" opacity="0.3" />
          <circle
            cx="50"
            cy="50"
            r="30"
            stroke={color}
            strokeWidth="0.5"
            opacity="0.5"
            strokeDasharray="2 4"
          />
        </svg>
      )}
      {kind === "sphere" && (
        <svg width={size} height={size} viewBox="0 0 100 100">
          <defs>
            <radialGradient id={`s-${color}-${size}`} cx="35%" cy="35%">
              <stop offset="0" stopColor="#fff" stopOpacity="0.3" />
              <stop offset="0.4" stopColor={color} stopOpacity="0.8" />
              <stop offset="1" stopColor={color} stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="42" fill={`url(#s-${color}-${size})`} />
          <circle cx="50" cy="50" r="42" stroke={color} strokeWidth="0.5" fill="none" opacity="0.6" />
        </svg>
      )}
      {kind === "dart" && (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <path
            d="M30 20 L70 60 L50 80 L20 50 Z"
            stroke={color}
            strokeWidth="1"
            fill={color}
            fillOpacity="0.15"
          />
          <path
            d="M20 50 L40 30 L70 60 L50 80 Z"
            stroke={color}
            strokeWidth="0.7"
            opacity="0.6"
          />
        </svg>
      )}
      {kind === "grid" && (
        <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <line
                x1={i * 25}
                y1="0"
                x2={i * 25}
                y2="100"
                stroke={color}
                strokeWidth="0.4"
                opacity="0.5"
              />
              <line
                x1="0"
                y1={i * 25}
                x2="100"
                y2={i * 25}
                stroke={color}
                strokeWidth="0.4"
                opacity="0.5"
              />
            </g>
          ))}
        </svg>
      )}
    </div>
  );
}

const SHAPES: Array<Omit<ShapeProps, "mouse">> = [
  { kind: "cube", x: -480, y: -260, z: 0.6, rot: 12, size: 140, color: "#00e5a0" },
  { kind: "ring", x: 460, y: -300, z: 0.4, rot: 0, size: 220, color: "#9d8cff" },
  { kind: "sphere", x: -560, y: 220, z: 0.5, rot: 0, size: 90, color: "#ff9b6b" },
  { kind: "dart", x: 520, y: 240, z: 0.7, rot: -18, size: 110, color: "#00e5a0" },
  { kind: "grid", x: -240, y: -340, z: 0.3, rot: 0, size: 180, color: "#3a3d48" },
  { kind: "cube", x: 320, y: -180, z: 0.35, rot: -22, size: 70, color: "#9d8cff" },
  { kind: "ring", x: -380, y: 320, z: 0.5, rot: 0, size: 80, color: "#00e5a0" },
  { kind: "sphere", x: 420, y: 0, z: 0.55, rot: 0, size: 40, color: "#ff6f9c" },
  { kind: "dart", x: -300, y: 60, z: 0.45, rot: 35, size: 50, color: "#ffc266" },
];

function BgScene({ mouse }: { mouse: MouseXY }) {
  return (
    <div className={styles.scene}>
      {SHAPES.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Shape {...s} mouse={mouse} />
        </div>
      ))}
    </div>
  );
}

function BgName({ mouse }: { mouse: MouseXY }) {
  const tx = -mouse.x * 14;
  const ty = -mouse.y * 8;
  return (
    <div className={styles["bg-name"]} style={{ zIndex: 1 }}>
      <h1 style={{ transform: `translate(${tx}px, ${ty}px)` }}>MAHADY</h1>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Top bar / Rail / Plaque / Caption / Hint
 * ---------------------------------------------------------------------- */
function TopBar({ muted, setMuted }: { muted: boolean; setMuted: (v: boolean) => void }) {
  return (
    <div className={styles.topbar}>
      <div className={styles.brand}>
        <div className={styles.dot} />
        <span>MAHADYDEV — career.app v1.0</span>
      </div>
      <div className={styles.actions}>
        <button
          className={styles["btn-ghost"]}
          onClick={() => setMuted(!muted)}
          aria-label="Toggle sound"
          data-cursor="hover"
        >
          {muted ? "🔇 SOUND" : "🔊 SOUND"}
        </button>
        <a className={styles["btn-ghost"]} href={`mailto:${cv.email}`} data-cursor="hover">
          ✉ EMAIL
        </a>
        <a
          className={styles["btn-accent"]}
          href="/assets/Mahady_Hasan_CV.pdf"
          download
          data-cursor="hover"
        >
          ↓ RESUME.PDF
        </a>
      </div>
    </div>
  );
}

function Rail({
  openApp,
  current,
}: {
  openApp: (id: AppId) => void;
  current: AppId | null;
}) {
  return (
    <div className={styles.rail}>
      {APP_LIST.map((a) => (
        <button
          key={a.id}
          className={current === a.id ? styles.active : ""}
          onClick={() => {
            tap();
            openApp(a.id);
          }}
          aria-label={a.label}
          data-cursor="hover"
        >
          <span style={{ fontSize: 16 }}>{a.icon}</span>
          <span className={styles.tip}>{a.label}</span>
        </button>
      ))}
    </div>
  );
}

function Plaque() {
  return (
    <div className={styles.plaque}>
      <div className={styles.label}>Senior Software Engineer</div>
      <h2>
        Building<br />for the <span className={styles.accent}>pocket.</span>
      </h2>
      <p>{cv.shortBio}</p>
    </div>
  );
}

function Caption({ current }: { current: AppId | null }) {
  const label = APP_LIST.find((a) => a.id === current);
  return (
    <div className={styles.caption}>
      now showing<br />
      <b>{label ? label.label.toUpperCase() : "HOME SCREEN"}</b>
    </div>
  );
}

function Hint() {
  return (
    <div className={styles.hint}>
      <span>↑↑↓↓←→←→BA</span> for a treat<br />
      drag the phone · tap icons<br />
      <span className={styles.kbd}>esc</span> closes app
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Phone: Status bar / Dynamic Island / Home / Apps
 * ---------------------------------------------------------------------- */
function StatusBar() {
  const [now, setNow] = useState<Date>(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return (
    <div className={styles["status-bar"]}>
      <span>
        {hh}:{mm}
      </span>
      <div className={styles.right}>
        <span
          style={{
            fontSize: 10,
            color: "var(--accent)",
            fontFamily: "var(--font-jb-mono), monospace",
            letterSpacing: "0.06em",
          }}
        >
          LTE
        </span>
        <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
          <rect x="0.5" y="0.5" width="18" height="10" rx="2" stroke="#fff" opacity="0.8" />
          <rect x="2" y="2" width="13" height="7" rx="1" fill="#00e5a0" />
          <rect x="20" y="3" width="2" height="5" rx="1" fill="#fff" opacity="0.6" />
        </svg>
      </div>
    </div>
  );
}

interface TempoState {
  bpm: number;
  beats: number;
}

interface IslandNotif {
  icon: string;
  text: string;
  color: string;
}
const ISLAND_NOTIFS: IslandNotif[] = [
  { icon: "●", text: "LIVE", color: "var(--accent)" },
  { icon: "✉", text: "NEW MSG", color: "#9d8cff" },
  { icon: "★", text: "BASIS '22", color: "#ffc266" },
  { icon: "↗", text: "SHIPPING", color: "var(--accent)" },
  { icon: "●", text: "OPEN TO ROLES", color: "#ff9b6b" },
];

function Island({ current, tempo }: { current: AppId | null; tempo: TempoState }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (current || (tempo && tempo.bpm)) return;
    const t = setInterval(() => setN((x) => (x + 1) % ISLAND_NOTIFS.length), 3200);
    return () => clearInterval(t);
  }, [current, tempo]);
  const cur = current ? APP_LIST.find((a) => a.id === current) : null;
  const notif = ISLAND_NOTIFS[n];
  const showTempo = tempo && tempo.bpm > 0 && !current;
  return (
    <div className={`${styles.island} ${tempo && tempo.bpm ? styles.beating : ""}`}>
      {cur ? (
        <>
          <span style={{ color: "var(--accent)" }}>○</span>
          <span
            style={{
              fontFamily: "var(--font-jb-mono), monospace",
              letterSpacing: "0.1em",
            }}
          >
            {cur.label.toUpperCase()}
          </span>
          <span style={{ color: "var(--accent)" }}>○</span>
        </>
      ) : showTempo ? (
        <span
          className={styles["island-tempo"]}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-jb-mono), monospace",
            letterSpacing: "0.1em",
            color: "var(--accent)",
          }}
        >
          <span className={styles["tt-pulse"]}>♪</span>
          {Math.round(tempo.bpm)} BPM
        </span>
      ) : (
        <span
          key={n}
          className={styles["island-roll"]}
          style={{
            color: notif.color,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-jb-mono), monospace",
            letterSpacing: "0.1em",
          }}
        >
          <span>{notif.icon}</span>
          {notif.text}
        </span>
      )}
    </div>
  );
}

function HomeScreen({ openApp }: { openApp: (id: AppId) => void }) {
  const top = APP_LIST.slice(0, 6);
  const dock = APP_LIST.slice(6, 8);
  return (
    <div className={styles.home}>
      <div className={styles["home-header"]}>
        <div className={styles.greeting}>
          {new Date().toLocaleDateString(undefined, {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </div>
        <h2>{cv.name}</h2>
        <div className={styles.role}>{cv.title.toLowerCase().replace(/ /g, "_")}.dart</div>
      </div>
      <div className={styles["app-grid"]}>
        {top.map((a) => (
          <div
            key={a.id}
            className={styles["app-icon"]}
            data-cursor="hover"
            onClick={() => {
              tap();
              openApp(a.id);
            }}
          >
            <div className={styles.tile} style={{ background: a.color }}>
              <span style={{ fontSize: 28, position: "relative", zIndex: 1 }}>{a.icon}</span>
              {a.badge && <span className={styles.badge}>{a.badge}</span>}
            </div>
            <div className={styles.label}>{a.label}</div>
          </div>
        ))}
      </div>
      <div className={styles.dock}>
        {dock.map((a) => (
          <div
            key={a.id}
            className={styles["app-icon"]}
            data-cursor="hover"
            onClick={() => {
              tap();
              openApp(a.id);
            }}
          >
            <div className={styles.tile} style={{ background: a.color }}>
              <span style={{ fontSize: 26, position: "relative", zIndex: 1 }}>{a.icon}</span>
              {a.badge && <span className={styles.badge}>{a.badge}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * App shell + per-app content
 * ---------------------------------------------------------------------- */
function AppShell({
  title,
  onBack,
  children,
}: {
  title: string;
  onBack: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className={styles["app-shell"]}>
      <div className={styles.header}>
        <button className={styles.back} onClick={onBack} data-cursor="hover">
          ← Home
        </button>
        <div className={styles.title}>{title}</div>
        <span style={{ width: 50 }} />
      </div>
      <div className={styles.body}>{children}</div>
    </div>
  );
}

function AboutApp() {
  return (
    <>
      <div className={styles.card}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(140deg, #00e5a0, #5a4ed4)",
              display: "grid",
              placeItems: "center",
              fontSize: 22,
              fontWeight: 700,
              color: "#001a13",
            }}
          >
            MH
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{cv.name}</div>
            <div style={{ fontSize: 11, color: "var(--ink-dim)" }}>{cv.title}</div>
            <div
              style={{
                fontSize: 10,
                color: "var(--accent)",
                fontFamily: "var(--font-jb-mono), monospace",
                marginTop: 2,
              }}
            >
              📍 {cv.location}
            </div>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "var(--ink-dim)", lineHeight: 1.55 }}>{cv.summary}</p>
      </div>

      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          color: "var(--ink-faint)",
          margin: "16px 0 10px",
          textTransform: "uppercase",
        }}
      >
        By the numbers
      </div>
      <div className={styles["stat-row"]}>
        {cv.stats.map((s, i) => (
          <div className={styles["stat-cell"]} key={i}>
            <div className={styles.val}>{s.value}</div>
            <div className={styles.key}>{s.label}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          color: "var(--ink-faint)",
          margin: "16px 0 10px",
          textTransform: "uppercase",
        }}
      >
        Core
      </div>
      <div className={styles.chips}>
        {cv.core.map((c) => (
          <span key={c} className={`${styles.chip} ${styles.accent}`}>
            {c}
          </span>
        ))}
      </div>
    </>
  );
}

function ExperienceApp() {
  return (
    <div className={styles.timeline}>
      {cv.experience.map((x, i) => (
        <div className={`${styles["t-item"]} ${i > 1 ? styles.dim : ""}`} key={i}>
          <div className={styles.when}>
            {x.start} → {x.end}
          </div>
          <div className={styles.role}>{x.role}</div>
          <div className={styles.co}>
            {x.company} · {x.location}
          </div>
          <ul>
            {x.bullets.slice(0, i === 0 ? 4 : 3).map((b, k) => (
              <li key={k}>{b}</li>
            ))}
          </ul>
          <div className={styles.chips} style={{ marginTop: 8 }}>
            {x.stack.slice(0, 5).map((s) => (
              <span key={s} className={styles.chip}>
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ProjectsApp() {
  const [idx, setIdx] = useState(0);
  const p = cv.projects[idx];
  const toneMap: Record<string, string> = {
    mint: "#00e5a0",
    violet: "#9d8cff",
    amber: "#ffc266",
    rose: "#ff6f9c",
  };
  const c = toneMap[p.tone] || "#00e5a0";
  return (
    <>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {cv.projects.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              tap();
              setIdx(i);
            }}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: i === idx ? c : "var(--line)",
              transition: "background .2s",
            }}
            data-cursor="hover"
          />
        ))}
      </div>
      <div className={`${styles.card} ${styles.hov}`} style={{ borderColor: c + "30" }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.12em",
            color: c,
            fontFamily: "var(--font-jb-mono), monospace",
          }}
        >
          {p.tag.toUpperCase()}
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            margin: "4px 0 8px",
          }}
        >
          {p.name}
        </div>
        <p
          style={{
            fontSize: 12,
            color: "var(--ink-dim)",
            lineHeight: 1.55,
            marginBottom: 14,
          }}
        >
          {p.blurb}
        </p>
        <div className={styles["stat-row"]}>
          {p.metrics.map((m, i) => (
            <div
              key={i}
              className={styles["stat-cell"]}
              style={{ background: c + "10", borderColor: c + "20" }}
            >
              <div className={styles.val} style={{ color: c, fontSize: 18 }}>
                {m.v}
              </div>
              <div className={styles.key}>{m.k}</div>
            </div>
          ))}
        </div>
        <div className={styles.chips} style={{ marginTop: 12 }}>
          {p.stack.map((s) => (
            <span key={s} className={styles.chip}>
              {s}
            </span>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <button
          className={styles.chip}
          onClick={() => {
            click();
            setIdx((idx - 1 + cv.projects.length) % cv.projects.length);
          }}
          data-cursor="hover"
        >
          ← prev
        </button>
        <span
          style={{
            fontSize: 10,
            color: "var(--ink-faint)",
            fontFamily: "var(--font-jb-mono), monospace",
            alignSelf: "center",
          }}
        >
          {idx + 1} / {cv.projects.length}
        </span>
        <button
          className={styles.chip}
          onClick={() => {
            click();
            setIdx((idx + 1) % cv.projects.length);
          }}
          data-cursor="hover"
        >
          next →
        </button>
      </div>
    </>
  );
}

function SkillsApp() {
  return (
    <>
      {Object.entries(cv.skills).map(([k, list]) => (
        <div key={k} style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              color: "var(--accent)",
              textTransform: "uppercase",
              marginBottom: 8,
              fontFamily: "var(--font-jb-mono), monospace",
            }}
          >
            {k}
          </div>
          <div className={styles.chips}>
            {list.map((s) => (
              <span key={s} className={styles.chip}>
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

function AwardsApp() {
  return (
    <>
      {cv.awards.map((a, i) => (
        <div className={`${styles.card} ${styles.hov}`} key={i}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background:
                  i === 0
                    ? "linear-gradient(140deg, #ffc266, #d68a2a)"
                    : "linear-gradient(140deg, #00e5a0, #009168)",
                display: "grid",
                placeItems: "center",
                fontSize: 22,
                flexShrink: 0,
              }}
            >
              🏆
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, lineHeight: 1.3 }}>{a.title}</div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--accent)",
                  fontFamily: "var(--font-jb-mono), monospace",
                  margin: "4px 0",
                  letterSpacing: "0.05em",
                }}
              >
                {a.sub.toUpperCase()} · {a.year}
              </div>
              <p style={{ fontSize: 11, color: "var(--ink-dim)", lineHeight: 1.5 }}>{a.detail}</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

function EducationApp() {
  return (
    <>
      <div className={styles.card}>
        <div
          style={{
            fontSize: 10,
            color: "var(--accent)",
            letterSpacing: "0.1em",
            fontFamily: "var(--font-jb-mono), monospace",
          }}
        >
          {cv.education.years}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, margin: "6px 0 4px" }}>
          {cv.education.degree}
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-dim)" }}>{cv.education.school}</div>
        <div style={{ fontSize: 11, color: "var(--ink-faint)", marginTop: 2 }}>
          {cv.education.location}
        </div>
      </div>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          color: "var(--ink-faint)",
          margin: "12px 0 10px",
          textTransform: "uppercase",
        }}
      >
        Languages
      </div>
      {cv.languages.map((l) => (
        <div
          key={l.name}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px 12px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.03)",
            marginBottom: 6,
            fontSize: 12,
          }}
        >
          <span>{l.name}</span>
          <span
            style={{
              color: "var(--accent)",
              fontFamily: "var(--font-jb-mono), monospace",
              fontSize: 11,
            }}
          >
            {l.level}
          </span>
        </div>
      ))}
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.12em",
          color: "var(--ink-faint)",
          margin: "16px 0 10px",
          textTransform: "uppercase",
        }}
      >
        Open Source
      </div>
      <div className={`${styles.card} ${styles.hov}`} style={{ marginBottom: 0 }}>
        <p style={{ fontSize: 12, color: "var(--ink-dim)" }}>
          Active contributor on GitHub —{" "}
          <a
            href={`https://${cv.links.github}`}
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--accent)" }}
            data-cursor="hover"
          >
            @mahadydev
          </a>
        </p>
      </div>
    </>
  );
}

type TermTok =
  | { t: "prompt" | "sep" | "path" | "cmd" | "out" | "key" | "str"; v: string }
  | { t: "br"; v?: undefined };

function TerminalApp() {
  const lines: TermTok[] = [
    { t: "prompt", v: "mahady@career" },
    { t: "sep", v: ":" },
    { t: "path", v: "~" },
    { t: "sep", v: "$ " },
    { t: "cmd", v: "whoami --verbose" },
    { t: "br" },
    { t: "out", v: "> Senior Flutter engineer, 8+ yrs." },
    { t: "br" },
    { t: "out", v: "> 1M+ users shipped across LMS, fintech, marketplace." },
    { t: "br" },
    { t: "br" },
    { t: "prompt", v: "mahady@career" },
    { t: "sep", v: ":" },
    { t: "path", v: "~/now" },
    { t: "sep", v: "$ " },
    { t: "cmd", v: "cat status.json" },
    { t: "br" },
    { t: "out", v: "{ " },
    { t: "br" },
    { t: "key", v: '  "role"' },
    { t: "out", v: ": " },
    { t: "str", v: '"Senior Software Engineer @ Appifylab"' },
    { t: "out", v: "," },
    { t: "br" },
    { t: "key", v: '  "stack"' },
    { t: "out", v: ": [" },
    { t: "str", v: '"Flutter"' },
    { t: "out", v: ", " },
    { t: "str", v: '"BLoC"' },
    { t: "out", v: ", " },
    { t: "str", v: '"AWS"' },
    { t: "out", v: "]," },
    { t: "br" },
    { t: "key", v: '  "shipping"' },
    { t: "out", v: ": " },
    { t: "str", v: '"Ezycourse — 1M+ enrollments"' },
    { t: "out", v: "," },
    { t: "br" },
    { t: "key", v: '  "open_to"' },
    { t: "out", v: ": " },
    { t: "str", v: '"Architect / Lead roles"' },
    { t: "br" },
    { t: "out", v: "}" },
    { t: "br" },
    { t: "br" },
    { t: "prompt", v: "mahady@career" },
    { t: "sep", v: ":" },
    { t: "path", v: "~" },
    { t: "sep", v: "$ " },
  ];

  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= lines.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), shown < 5 ? 80 : 50);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown]);

  return (
    <div className={styles.term}>
      {lines.slice(0, shown).map((l, i) => {
        if (l.t === "br") return <br key={i} />;
        if (l.t === "sep") return <span key={i}>{l.v}</span>;
        if (l.t === "cmd")
          return (
            <span key={i} style={{ color: "#ecedf0" }}>
              {l.v}
            </span>
          );
        return (
          <span key={i} className={styles[l.t]}>
            {l.v}
          </span>
        );
      })}
      {shown >= lines.length && <span className={styles.caret} />}
    </div>
  );
}

function ContactApp() {
  const links = [
    { k: "Email", v: cv.email, href: `mailto:${cv.email}`, icon: "✉" },
    { k: "Phone", v: cv.phone, href: `tel:${cv.phone}`, icon: "📞" },
    {
      k: "LinkedIn",
      v: cv.links.linkedin,
      href: `https://${cv.links.linkedin}`,
      icon: "in",
    },
    { k: "GitHub", v: cv.links.github, href: `https://${cv.links.github}`, icon: "gh" },
    { k: "Web", v: cv.links.site, href: `https://${cv.links.site}`, icon: "↗" },
  ];
  return (
    <>
      <div style={{ textAlign: "center", padding: "8px 0 18px" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.2em",
            color: "var(--ink-faint)",
            textTransform: "uppercase",
          }}
        >
          Get in touch
        </div>
        <div style={{ fontSize: 20, fontWeight: 600, marginTop: 6, letterSpacing: "-0.02em" }}>
          Let&apos;s build something.
        </div>
      </div>
      {links.map((l) => (
        <a
          key={l.k}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className={`${styles.card} ${styles.hov}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
            marginBottom: 8,
          }}
          data-cursor="hover"
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "rgba(0,229,160,0.1)",
              color: "var(--accent)",
              display: "grid",
              placeItems: "center",
              fontWeight: 700,
              fontSize: 13,
              fontFamily: "var(--font-jb-mono), monospace",
            }}
          >
            {l.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 10,
                color: "var(--ink-faint)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {l.k}
            </div>
            <div style={{ fontSize: 12, color: "var(--ink)" }}>{l.v}</div>
          </div>
          <span style={{ color: "var(--accent)", fontSize: 14 }}>→</span>
        </a>
      ))}
      <a
        className={styles["btn-accent"]}
        href="/assets/Mahady_Hasan_CV.pdf"
        download
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 14,
          padding: "14px 16px",
          borderRadius: 12,
          fontSize: 12,
        }}
        data-cursor="hover"
      >
        ↓ Download Resume.pdf
      </a>
    </>
  );
}

const APPS: Record<AppId, { title: string; C: () => React.ReactElement }> = {
  about: { title: "About me", C: AboutApp },
  experience: { title: "Career path", C: ExperienceApp },
  projects: { title: "Selected projects", C: ProjectsApp },
  skills: { title: "Skills", C: SkillsApp },
  awards: { title: "Awards", C: AwardsApp },
  education: { title: "Education", C: EducationApp },
  terminal: { title: "Terminal", C: TerminalApp },
  contact: { title: "Contact", C: ContactApp },
};

/* -------------------------------------------------------------------------
 * SwipeIndicator — tap for tempo, long drag up closes app
 * ---------------------------------------------------------------------- */
interface DragState {
  active: boolean;
  dy: number;
}

interface SwipeStart {
  y: number;
  t: number;
  moved: boolean;
}

function SwipeIndicator({
  onClose,
  hasOpen,
  tempo,
  onTap,
}: {
  onClose: () => void;
  hasOpen: boolean;
  tempo: TempoState;
  onTap: () => void;
}) {
  const [drag, setDrag] = useState<DragState>({ active: false, dy: 0 });
  const startRef = useRef<SwipeStart | null>(null);

  const onDown = (e: RPointerEvent<HTMLButtonElement>) => {
    startRef.current = { y: e.clientY, t: performance.now(), moved: false };
    setDrag({ active: true, dy: 0 });
    e.preventDefault();
    e.stopPropagation();
  };

  useEffect(() => {
    if (!drag.active) return;
    const move = (e: PointerEvent) => {
      if (!startRef.current) return;
      const dy = Math.max(0, e.clientY - startRef.current.y);
      if (dy > 6) startRef.current.moved = true;
      setDrag({ active: true, dy });
    };
    const up = (e: PointerEvent) => {
      if (!startRef.current) return;
      const dy = Math.max(0, e.clientY - startRef.current.y);
      const dt = performance.now() - startRef.current.t;
      if (hasOpen && dy > 60) {
        onClose();
      } else if (!startRef.current.moved && dt < 350) {
        onTap();
      }
      startRef.current = null;
      setDrag({ active: false, dy: 0 });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [drag.active, hasOpen, onClose, onTap]);

  const t = Math.min(drag.dy, 120);
  const pulseDur = tempo.bpm ? 60 / tempo.bpm : 0;
  const active = tempo.beats > 0;

  return (
    <>
      {active && (
        <div
          className={`${styles["tempo-readout"]} ${tempo.beats >= 2 ? styles.lock : ""}`}
          aria-live="polite"
        >
          <span className={styles["tt-label"]}>TAP TEMPO</span>
          <span className={styles["tt-bpm"]}>
            {tempo.bpm ? Math.round(tempo.bpm) : "—"}
          </span>
          <span className={styles["tt-unit"]}>BPM</span>
          <span className={styles["tt-beats"]}>
            {"●".repeat(Math.min(tempo.beats, 4))}
            {"○".repeat(Math.max(0, 4 - tempo.beats))}
          </span>
        </div>
      )}
      <button
        className={`${styles["home-indicator"]} ${tempo.bpm ? styles.beating : ""}`}
        onPointerDown={onDown}
        aria-label={
          hasOpen ? "Swipe up to close, or tap to set tempo" : "Tap to set tempo"
        }
        style={{
          cursor: hasOpen ? "grab" : "pointer",
          transform: `translateX(-50%) translateY(${-t * 0.4}px) scaleY(${1 + t * 0.01})`,
          background:
            hasOpen && t > 30
              ? "var(--accent)"
              : tempo.bpm
                ? "var(--accent)"
                : "#fff",
          opacity: hasOpen ? 0.7 + t / 200 : tempo.bpm ? 0.95 : 0.5,
          transition: drag.active ? "none" : "all .2s ease",
          width: hasOpen ? 110 + t * 0.6 : 110,
          animationDuration: pulseDur ? `${pulseDur}s` : undefined,
        }}
        title={
          hasOpen ? "Swipe up to close · tap for tempo" : "Tap repeatedly to set BPM"
        }
      />
    </>
  );
}

/* -------------------------------------------------------------------------
 * Phone wrap
 * ---------------------------------------------------------------------- */
interface PhoneDrag {
  x: number;
  y: number;
  dragging: boolean;
}

function Phone({
  current,
  openApp,
  closeApp,
  drag,
  tempo,
  onTempoTap,
}: {
  current: AppId | null;
  openApp: (id: AppId) => void;
  closeApp: () => void;
  drag: PhoneDrag;
  tempo: TempoState;
  onTempoTap: () => void;
}) {
  const Cur = current ? APPS[current] : null;
  const beating = tempo.bpm > 0;
  const beatDur = beating ? 60 / tempo.bpm : 0;
  // CSS custom prop on style needs explicit type.
  const wrapStyle: CSSProperties & { "--beat-dur"?: string } = {
    transform: `translate(${drag.x}px, ${drag.y}px) rotateY(${-drag.x * 0.04}deg) rotateX(${drag.y * 0.04}deg)`,
    transition: drag.dragging ? "none" : "transform .6s cubic-bezier(.2,.9,.2,1)",
    "--beat-dur": beatDur ? `${beatDur}s` : undefined,
  };
  return (
    <div
      className={`${styles["phone-wrap"]} ${beating ? styles.beat : ""}`}
      style={wrapStyle}
    >
      <div className={styles.phone} data-cursor="hover">
        <div className={styles["phone-screen"]}>
          <StatusBar />
          <Island current={current} tempo={tempo} />
          <div className={styles["screen-content"]}>
            <HomeScreen openApp={openApp} />
          </div>
          {Cur && (
            <AppShell
              title={Cur.title}
              onBack={() => {
                pop();
                closeApp();
              }}
            >
              <Cur.C />
            </AppShell>
          )}
          <SwipeIndicator
            onClose={() => {
              swipe();
              closeApp();
            }}
            hasOpen={!!current}
            tempo={tempo}
            onTap={onTempoTap}
          />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
 * Toast
 * ---------------------------------------------------------------------- */
function Toast({ msg, show }: { msg: string; show: boolean }) {
  return (
    <div className={`${styles.toast} ${show ? styles.show : ""}`}>{msg}</div>
  );
}

/* -------------------------------------------------------------------------
 * Root page
 * ---------------------------------------------------------------------- */
export default function CareerAppPage() {
  const [current, setCurrent] = useState<AppId | null>(() =>
    store.get<AppId | null>("careerLastApp", null)
  );
  useEffect(() => {
    store.set("careerLastApp", current);
  }, [current]);

  const [drag, setDrag] = useState<PhoneDrag>({ x: 0, y: 0, dragging: false });
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: "", show: false });
  const [muted, setMuted] = useState<boolean>(() => fxIsMuted());
  const mouse = useMouseParallax();
  const startRef = useRef<{ x: number; y: number } | null>(null);

  // Tap tempo state
  const [tempo, setTempo] = useState<TempoState>({ bpm: 0, beats: 0 });
  const tapTimesRef = useRef<number[]>([]);
  const tempoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onTempoTap = useCallback(() => {
    tone(900, 0.06, "triangle", 0.05);
    const now = performance.now();
    const arr = tapTimesRef.current.filter((t) => now - t < 2200);
    arr.push(now);
    if (arr.length > 6) arr.shift();
    tapTimesRef.current = arr;

    if (arr.length >= 2) {
      const diffs: number[] = [];
      for (let i = 1; i < arr.length; i++) diffs.push(arr[i] - arr[i - 1]);
      const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
      const bpm = Math.max(30, Math.min(240, 60000 / avg));
      setTempo({ bpm, beats: arr.length });
    } else {
      setTempo({ bpm: 0, beats: 1 });
    }
    if (tempoTimerRef.current) clearTimeout(tempoTimerRef.current);
    tempoTimerRef.current = setTimeout(() => {
      tapTimesRef.current = [];
      setTempo({ bpm: 0, beats: 0 });
    }, 4500);
  }, []);

  // Mute toggle sync
  useEffect(() => {
    fxSetMuted(muted);
  }, [muted]);

  // Esc closes open app
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCurrent(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Drag phone
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      if (!target.closest(`.${styles.phone}`)) return;
      // Don't start drag when interacting with any inner control or scrollable body.
      const block = `.${styles["app-icon"]}, .${styles.back}, button, a, .${styles["home-indicator"]}, .${styles.body}`;
      if (target.closest(block)) return;
      startRef.current = { x: e.clientX - drag.x, y: e.clientY - drag.y };
      setDrag((d) => ({ ...d, dragging: true }));
      e.preventDefault();
    };
    const onMove = (e: PointerEvent) => {
      if (!startRef.current) return;
      setDrag({
        x: (e.clientX - startRef.current.x) * 0.6,
        y: (e.clientY - startRef.current.y) * 0.6,
        dragging: true,
      });
    };
    const onUp = () => {
      if (!startRef.current) return;
      startRef.current = null;
      setDrag({ x: 0, y: 0, dragging: false });
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [drag.x, drag.y]);

  // Konami handler — show toast in addition to mint rain
  const onKonami = useCallback(() => {
    mintRain("#00e5a0");
    setToast({ msg: "🎉 Konami unlocked — mint rain", show: true });
    setTimeout(() => setToast({ msg: "", show: false }), 3000);
  }, []);

  // Combine mouse parallax with drag for phone position.
  const phoneDrag: PhoneDrag = {
    x: drag.x + mouse.x * 8,
    y: drag.y + mouse.y * 6,
    dragging: drag.dragging,
  };

  return (
    <div className={styles.root}>
      <BgScene mouse={mouse} />
      <BgName mouse={mouse} />
      <TopBar muted={muted} setMuted={setMuted} />
      <Plaque />
      <Caption current={current} />
      <Hint />
      <Phone
        current={current}
        openApp={(id: AppId) => setCurrent(id)}
        closeApp={() => setCurrent(null)}
        drag={phoneDrag}
        tempo={tempo}
        onTempoTap={onTempoTap}
      />
      <Rail
        openApp={(id: AppId) => {
          setCurrent(id);
        }}
        current={current}
      />
      <Toast {...toast} />
      <div className={styles.dirnav}>
        <Link href="/" data-cursor="hover">
          ◇ index
        </Link>
        <Link className={styles.cur} href="/career-app" data-cursor="hover">
          01 career.app
        </Link>
        <Link href="/terminal" data-cursor="hover">
          02 terminal
        </Link>
        <Link href="/studio" data-cursor="hover">
          03 studio
        </Link>
      </div>
      <FxProvider accent="#00e5a0" cursorMode="tap" onKonami={onKonami} />
    </div>
  );
}
