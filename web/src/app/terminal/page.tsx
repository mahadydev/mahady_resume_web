"use client";

import Link from "next/link";
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cv } from "@/data/cv";
import { FxProvider } from "@/fx/fx-provider";
import { tap, click, pop, errorTone, chord } from "@/fx/sound";
import { store } from "@/fx/store";
import styles from "./terminal.module.css";

type FileEntry = {
  id: string;
  path: string;
  name: string;
  icon: string;
  tab: string;
  title: string;
};

const FILES: FileEntry[] = [
  { id: "readme", path: "~/", name: "README.md", icon: "📄", tab: "README.md", title: "readme" },
  { id: "about", path: "~/profile/", name: "about.md", icon: "📄", tab: "about.md", title: "about" },
  { id: "experience", path: "~/career/", name: "experience.log", icon: "📜", tab: "experience.log", title: "experience" },
  { id: "projects", path: "~/career/", name: "projects.dart", icon: "🎯", tab: "projects.dart", title: "projects" },
  { id: "skills", path: "~/profile/", name: "skills.yaml", icon: "⚙", tab: "skills.yaml", title: "skills" },
  { id: "awards", path: "~/career/", name: "awards.md", icon: "★", tab: "awards.md", title: "awards" },
  { id: "education", path: "~/profile/", name: "education.json", icon: "{}", tab: "education.json", title: "education" },
  { id: "contact", path: "~/", name: "contact.sh", icon: "▶", tab: "contact.sh", title: "contact" },
  { id: "snake", path: "~/games/", name: "snake.game", icon: "◆", tab: "snake.game", title: "snake" },
];

// ---- Boot --------------------------------------------------------------
function Boot({ onDone }: { onDone: () => void }) {
  const lines = useMemo(
    () => [
      "BIOS v8.0 ... OK",
      "Memory check: 8+ years experience ... PASSED",
      "Mounting /career ... OK",
      "Loading flutter.module ... OK",
      "Starting bloc.service ... OK",
      "Initializing user: mahady",
      "",
      "Welcome — type `help` or click a file.",
      "",
    ],
    []
  );
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= lines.length) {
      const t = setTimeout(onDone, 600);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setN((x) => x + 1), 110);
    return () => clearTimeout(t);
  }, [n, lines.length, onDone]);
  const ascii = `   __  __    _    _   _    _    ____  __   __
  |  \\/  |  / \\  | | | |  / \\  |  _ \\ \\ \\ / /
  | |\\/| | / _ \\ | |_| | / _ \\ | | | | \\ V /
  | |  | |/ ___ \\|  _  |/ ___ \\| |_| |  | |
  |_|  |_/_/   \\_\\_| |_/_/   \\_\\____/   |_|
                                              `;
  return (
    <div className={styles.boot}>
      <pre style={{ color: "var(--accent)", opacity: 0.85, marginBottom: 8 }}>{ascii}</pre>
      <pre>
        {lines
          .slice(0, n)
          .map((l, i) => (l ? `[ ${i.toString().padStart(2, "0")} ] ${l}` : "") + "\n")
          .join("")}
        {n < lines.length ? "█" : ""}
      </pre>
    </div>
  );
}

// ---- Sidebar -----------------------------------------------------------
function Sidebar({
  active,
  onOpen,
  openTabs,
}: {
  active: string;
  onOpen: (id: string) => void;
  openTabs: string[];
}) {
  const folders: Record<string, FileEntry[]> = {};
  FILES.forEach((f) => {
    folders[f.path] = folders[f.path] || [];
    folders[f.path].push(f);
  });
  return (
    <div className={styles.sidebar}>
      <div className={styles.sec}>Explorer</div>
      <div className={styles.tree}>
        <div className={`${styles.treeRow} ${styles.dim}`} style={{ pointerEvents: "none" }}>
          <span className={styles.icon}>▾</span> career/
        </div>
        {Object.entries(folders).map(([path, files]) => (
          <div key={path}>
            <div
              className={`${styles.treeRow} ${styles.dim}`}
              style={{ pointerEvents: "none", paddingLeft: 22 }}
            >
              <span className={styles.icon}>▾</span>{" "}
              {path.replace("~/", "").replace("/", "") || "root"}
            </div>
            {files.map((f) => (
              <div
                key={f.id}
                className={`${styles.treeRow} ${styles.treeFolder} ${active === f.id ? styles.active : ""}`}
                style={{ paddingLeft: 38 }}
                data-cursor="tap"
                onClick={() => {
                  tap();
                  onOpen(f.id);
                }}
              >
                <span className={styles.icon}>{f.icon}</span>
                <span>{f.name}</span>
                {openTabs.includes(f.id) && (
                  <span className={styles.ind} style={{ color: "var(--accent)" }}>
                    ●
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.profile}>
        <div className={styles.avatar}>MH</div>
        <div>
          <div style={{ color: "var(--ink)" }}>{cv.firstName}</div>
          <div style={{ color: "var(--ink-faint)", fontSize: 10 }}>online · open to roles</div>
        </div>
      </div>
    </div>
  );
}

// ---- Tab contents ------------------------------------------------------
function Readme() {
  return (
    <div>
      <div className={styles.cmt}># MAHADYDEV / README.md</div>
      <div className={styles.h1Big}>
        {cv.firstName} <span className={styles.accent}>Hasan</span>
      </div>
      <div className={styles.sub}>
        {cv.title} · {cv.subtitle}
        <br />
        Based in {cv.location} · Open to remote / hybrid roles.
      </div>

      <div className={styles.sectionTitle}>$ whoami</div>
      <p style={{ fontSize: 13, color: "var(--ink-dim)", lineHeight: 1.7, maxWidth: 640 }}>
        {cv.summary}
      </p>

      <div className={styles.sectionTitle}>$ stats --since=2017</div>
      <div className={styles.statBar}>
        {cv.stats.map((s, i) => (
          <div key={i} className={styles.b}>
            <div className={styles.v}>{s.value}</div>
            <div className={styles.k}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.sectionTitle}>$ ls ~/</div>
      <div style={{ fontSize: 12.5, lineHeight: 1.9, color: "var(--ink-dim)" }}>
        {FILES.map((f) => (
          <div key={f.id}>
            <span className={styles.dim}>drwx— </span>
            <span className={styles.path}>{f.path}</span>
            <span className={styles.hl}>{f.name}</span>
            <span className={styles.dim}> — {f.title}</span>
          </div>
        ))}
      </div>

      <div className={styles.sectionTitle}>$ help</div>
      <div style={{ fontSize: 12.5, color: "var(--ink-dim)", lineHeight: 1.8 }}>
        <div>· Click any file in the explorer to open it as a tab.</div>
        <div>
          · Try the konami code: <span className={styles.hl}>↑↑↓↓←→←→BA</span>
        </div>
        <div>· Drag the project windows around in projects.dart.</div>
        <div>
          · Press <span className={styles.hl}>esc</span> to close active tab.
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <div>
      <div className={styles.cmt}>{"/// about.md — long-form profile"}</div>
      <div className={styles.h1Big}>
        About<span className={styles.accent}>.</span>
      </div>
      <div className={styles.sub}>{cv.shortBio}</div>

      <div className={styles.sectionTitle}>profile.json</div>
      <pre style={{ fontSize: 12.5, lineHeight: 1.65 }}>
        <span className={styles.out}>{"{"}</span>
        {"\n"}
        <span className={styles.key}>{`  "name"`}</span>
        <span className={styles.out}>: </span>
        <span className={styles.str}>{`"${cv.name}"`}</span>
        <span className={styles.out}>,</span>
        {"\n"}
        <span className={styles.key}>{`  "title"`}</span>
        <span className={styles.out}>: </span>
        <span className={styles.str}>{`"${cv.title}"`}</span>
        <span className={styles.out}>,</span>
        {"\n"}
        <span className={styles.key}>{`  "location"`}</span>
        <span className={styles.out}>: </span>
        <span className={styles.str}>{`"${cv.location}"`}</span>
        <span className={styles.out}>,</span>
        {"\n"}
        <span className={styles.key}>{`  "email"`}</span>
        <span className={styles.out}>: </span>
        <span className={styles.str}>{`"${cv.email}"`}</span>
        <span className={styles.out}>,</span>
        {"\n"}
        <span className={styles.key}>{`  "experience_years"`}</span>
        <span className={styles.out}>: </span>
        <span className={styles.num}>8</span>
        <span className={styles.out}>,</span>
        {"\n"}
        <span className={styles.key}>{`  "users_shipped_to"`}</span>
        <span className={styles.out}>: </span>
        <span className={styles.num}>1_000_000</span>
        <span className={styles.out}>,</span>
        {"\n"}
        <span className={styles.key}>{`  "team_max"`}</span>
        <span className={styles.out}>: </span>
        <span className={styles.num}>12</span>
        <span className={styles.out}>,</span>
        {"\n"}
        <span className={styles.key}>{`  "core"`}</span>
        <span className={styles.out}>: [</span>
        {"\n"}
        {cv.core.map((c, i) => (
          <span key={c}>
            {"    "}
            <span className={styles.str}>{`"${c}"`}</span>
            <span className={styles.out}>{i < cv.core.length - 1 ? "," : ""}</span>
            {"\n"}
          </span>
        ))}
        <span className={styles.out}>{"  ],"}</span>
        {"\n"}
        <span className={styles.key}>{`  "open_to"`}</span>
        <span className={styles.out}>: [</span>
        <span className={styles.str}>{`"Architect"`}</span>
        <span className={styles.out}>, </span>
        <span className={styles.str}>{`"Lead"`}</span>
        <span className={styles.out}>, </span>
        <span className={styles.str}>{`"Principal"`}</span>
        <span className={styles.out}>]</span>
        {"\n"}
        <span className={styles.out}>{"}"}</span>
      </pre>

      <div className={styles.sectionTitle}>contact</div>
      <dl className={styles.kvs}>
        <dt>email</dt>
        <dd>
          <a href={`mailto:${cv.email}`}>{cv.email}</a>
        </dd>
        <dt>phone</dt>
        <dd>{cv.phone}</dd>
        <dt>linkedin</dt>
        <dd>
          <a href={`https://${cv.links.linkedin}`} target="_blank" rel="noreferrer">
            {cv.links.linkedin}
          </a>
        </dd>
        <dt>github</dt>
        <dd>
          <a href={`https://${cv.links.github}`} target="_blank" rel="noreferrer">
            {cv.links.github}
          </a>
        </dd>
        <dt>web</dt>
        <dd>
          <a href={`https://${cv.links.site}`} target="_blank" rel="noreferrer">
            {cv.links.site}
          </a>
        </dd>
      </dl>
    </div>
  );
}

function Experience() {
  return (
    <div>
      <div className={styles.cmt}># tail -f experience.log</div>
      <div className={styles.h1Big}>
        Career<span className={styles.accent}>.log</span>
      </div>
      <div className={styles.sub}>
        {cv.experience.length} positions · 2017 → present · Bangladesh
      </div>
      {cv.experience.map((x, i) => (
        <div className={styles.job} key={i}>
          <div className={styles.row1}>
            <span className={styles.role}>{x.role}</span>
            <span className={styles.when}>
              {x.start} → {x.end}
            </span>
          </div>
          <div className={styles.co}>
            @ {x.company} · {x.location} · <span className={styles.dim}>{x.scope}</span>
          </div>
          <ul>
            {x.bullets.map((b, k) => (
              <li key={k}>{b}</li>
            ))}
          </ul>
          <div className={styles.chips} style={{ marginTop: 10 }}>
            {x.stack.map((s) => (
              <span key={s} className={styles.tchip}>
                {s}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

type DragState = { i: number; dx: number; dy: number } | null;
type Pos = { left: number; top: number };

function Projects() {
  const initial: Pos[] = [
    { left: 20, top: 0 },
    { left: 360, top: 50 },
    { left: 700, top: 0 },
    { left: 200, top: 280 },
  ];
  const [pos, setPos] = useState<Pos[]>(initial);
  const [drag, setDrag] = useState<DragState>(null);
  const [zMax, setZMax] = useState(1);
  const [zs, setZs] = useState<number[]>(cv.projects.map(() => 1));

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!drag) return;
      setPos((prev) => {
        const np = [...prev];
        np[drag.i] = {
          left: e.clientX - drag.dx,
          top: e.clientY - drag.dy,
        };
        return np;
      });
    };
    const onUp = () => setDrag(null);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [drag]);

  const startDrag = (i: number, e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a, button")) return;
    click();
    const rect = e.currentTarget.getBoundingClientRect();
    setDrag({ i, dx: e.clientX - rect.left, dy: e.clientY - rect.top });
    setZs((prev) => {
      const nz = [...prev];
      nz[i] = zMax + 1;
      return nz;
    });
    setZMax((z) => z + 1);
  };

  const dotColors = ["#ff5f56", "#ffbd2e", "#27c93f"];

  return (
    <div>
      <div className={styles.cmt}>{"// drag me around — windows remember z-order"}</div>
      <div className={styles.h1Big}>
        Projects<span className={styles.accent}>.</span>
      </div>
      <div className={styles.sub}>
        {cv.projects.length} selected shipping products · drag to rearrange
      </div>

      <div className={styles.projWindows}>
        {cv.projects.map((p, i) => (
          <div
            key={p.name}
            className={`${styles.projWin} ${drag && drag.i === i ? styles.dragging : ""}`}
            style={{ left: pos[i].left, top: pos[i].top, zIndex: zs[i] }}
            onPointerDown={(e) => startDrag(i, e)}
            data-cursor="grab"
          >
            <div className={styles.pwHead}>
              {dotColors.map((c, k) => (
                <div key={k} className={styles.l} style={{ background: c }} />
              ))}
              <span className={styles.t}>{p.name.toLowerCase()}.dart</span>
            </div>
            <div className={styles.pwBody}>
              <div className={styles.tag}>{p.tag}</div>
              <h4>{p.name}</h4>
              <p>{p.blurb}</p>
              <div className={styles.metr}>
                {p.metrics.map((m, k) => (
                  <div key={k} className={styles.m}>
                    <div className={styles.v}>{m.v}</div>
                    <div className={styles.k}>{m.k}</div>
                  </div>
                ))}
              </div>
              <div className={styles.chips}>
                {p.stack.map((s) => (
                  <span key={s} className={styles.tchip}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Skills() {
  const groups = cv.skills;
  const score = (s: string): number => {
    if (s.includes("Expert")) return 98;
    if (["Flutter", "Dart", "BLoC", "Clean Architecture", "BLoC (Expert)"].includes(s)) return 95;
    if (["AWS Amplify", "AppSync", "Firebase", "REST", "GraphQL", "DDD", "SOLID"].includes(s))
      return 88;
    return 70 + Math.floor((s.length * 7) % 20);
  };
  return (
    <div>
      <div className={styles.cmt}># skills.yaml — depth indicators are vibes-based</div>
      <div className={styles.h1Big}>
        Skills<span className={styles.accent}>.</span>
      </div>
      <div className={styles.sub}>
        {Object.values(groups).flat().length} entries · grouped by domain
      </div>
      {Object.entries(groups).map(([g, items]) => (
        <div key={g} style={{ marginBottom: 22 }}>
          <div className={styles.sectionTitle}>{g}</div>
          <div className={styles.skillsGrid}>
            {items.map((s) => (
              <div className={styles.skillLine} key={s}>
                <span className={styles.nm}>{s}</span>
                <div className={styles.meter}>
                  <i style={{ width: score(s) + "%" }} />
                </div>
                <span className={styles.pct}>{score(s)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function Awards() {
  return (
    <div>
      <div className={styles.cmt}>{"# awards.md — externally validated"}</div>
      <div className={styles.h1Big}>
        Awards<span className={styles.accent}>.</span>
      </div>
      <div className={styles.sub}>
        {cv.awards.length} recognitions across team and individual categories.
      </div>
      {cv.awards.map((a, i) => (
        <div
          key={i}
          style={{
            padding: 18,
            background: "var(--panel)",
            border: "1px solid var(--line)",
            borderRadius: 10,
            marginBottom: 14,
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 12,
                background:
                  i === 0
                    ? "linear-gradient(140deg, var(--accent), var(--blue))"
                    : "linear-gradient(140deg, var(--warn), var(--rose))",
                display: "grid",
                placeItems: "center",
                fontSize: 26,
                color: "#001a13",
                fontFamily: "var(--font-space-grotesk), sans-serif",
              }}
            >
              ★
            </div>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--accent)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                {a.sub} · {a.year}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-space-grotesk), sans-serif",
                  fontSize: 19,
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                  marginBottom: 6,
                }}
              >
                {a.title}
              </div>
              <p style={{ fontSize: 12.5, color: "var(--ink-dim)", lineHeight: 1.6 }}>{a.detail}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function EducationView() {
  const e = cv.education;
  return (
    <div>
      <div className={styles.cmt}>{"// education.json"}</div>
      <div className={styles.h1Big}>
        Edu<span className={styles.accent}>.</span>
      </div>
      <pre style={{ fontSize: 13, lineHeight: 1.65 }}>
        <span className={styles.out}>{"{"}</span>
        {"\n"}
        <span className={styles.key}>{`  "degree"`}</span>
        <span className={styles.out}>: </span>
        <span className={styles.str}>{`"${e.degree}"`}</span>
        <span className={styles.out}>,</span>
        {"\n"}
        <span className={styles.key}>{`  "school"`}</span>
        <span className={styles.out}>: </span>
        <span className={styles.str}>{`"${e.school}"`}</span>
        <span className={styles.out}>,</span>
        {"\n"}
        <span className={styles.key}>{`  "location"`}</span>
        <span className={styles.out}>: </span>
        <span className={styles.str}>{`"${e.location}"`}</span>
        <span className={styles.out}>,</span>
        {"\n"}
        <span className={styles.key}>{`  "years"`}</span>
        <span className={styles.out}>: </span>
        <span className={styles.str}>{`"${e.years}"`}</span>
        <span className={styles.out}>,</span>
        {"\n"}
        <span className={styles.key}>{`  "languages"`}</span>
        <span className={styles.out}>: {"{"}</span>
        {"\n"}
        {cv.languages.map((l, i) => (
          <span key={l.name}>
            {"    "}
            <span className={styles.key}>{`"${l.name.toLowerCase()}"`}</span>
            <span className={styles.out}>: </span>
            <span className={styles.str}>{`"${l.level}"`}</span>
            <span className={styles.out}>{i < cv.languages.length - 1 ? "," : ""}</span>
            {"\n"}
          </span>
        ))}
        <span className={styles.out}>{"  },"}</span>
        {"\n"}
        <span className={styles.key}>{`  "open_source"`}</span>
        <span className={styles.out}>: </span>
        <span className={styles.str}>{`"active contributor"`}</span>
        {"\n"}
        <span className={styles.out}>{"}"}</span>
      </pre>
    </div>
  );
}

function Contact() {
  const [typed, setTyped] = useState(0);
  const full = "$ ./contact.sh --hire-me\n\n";
  useEffect(() => {
    if (typed >= full.length) return;
    const t = setTimeout(() => setTyped(typed + 1), 35);
    return () => clearTimeout(t);
  }, [typed, full.length]);
  const done = typed >= full.length;
  return (
    <div>
      <pre style={{ fontSize: 14, color: "var(--accent)", marginBottom: 16 }}>
        {full.slice(0, typed)}
        {!done && <span className={styles.caret} />}
      </pre>
      {done && (
        <>
          <div className={styles.h1Big}>
            Let&apos;s talk<span className={styles.accent}>.</span>
          </div>
          <div className={styles.sub}>
            Available for architect, lead and senior IC roles. Remote / hybrid · global timezones
            friendly.
          </div>
          <dl className={styles.kvs}>
            <dt>email</dt>
            <dd>
              <a href={`mailto:${cv.email}`} data-cursor="hover">
                {cv.email}
              </a>
            </dd>
            <dt>phone</dt>
            <dd>{cv.phone}</dd>
            <dt>linkedin</dt>
            <dd>
              <a
                href={`https://${cv.links.linkedin}`}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
              >
                {cv.links.linkedin}
              </a>
            </dd>
            <dt>github</dt>
            <dd>
              <a
                href={`https://${cv.links.github}`}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
              >
                {cv.links.github}
              </a>
            </dd>
            <dt>portfolio</dt>
            <dd>
              <a
                href={`https://${cv.links.site}`}
                target="_blank"
                rel="noreferrer"
                data-cursor="hover"
              >
                {cv.links.site}
              </a>
            </dd>
          </dl>
          <div style={{ marginTop: 22, display: "flex", gap: 8 }}>
            <a
              className={styles.winBtn}
              href={`mailto:${cv.email}`}
              data-cursor="hover"
              style={{ background: "var(--accent)", color: "#001a13", borderColor: "transparent" }}
            >
              → Email me
            </a>
            <a
              className={styles.winBtn}
              href="/assets/Mahady_Hasan_CV.pdf"
              download
              data-cursor="hover"
            >
              ↓ Resume.pdf
            </a>
          </div>
        </>
      )}
    </div>
  );
}

// ---- Snake game --------------------------------------------------------
const SNAKE_COLS = 30;
const SNAKE_ROWS = 20;
const SNAKE_TICK = 110;

type Cell = { x: number; y: number };

function snakeInitial(): Cell[] {
  const mid = { x: Math.floor(SNAKE_COLS / 2), y: Math.floor(SNAKE_ROWS / 2) };
  return [
    { x: mid.x - 2, y: mid.y },
    { x: mid.x - 1, y: mid.y },
    { x: mid.x, y: mid.y },
  ];
}

function randCell(taken: Cell[]): Cell {
  while (true) {
    const c: Cell = {
      x: Math.floor(Math.random() * SNAKE_COLS),
      y: Math.floor(Math.random() * SNAKE_ROWS),
    };
    if (!taken.some((t) => t.x === c.x && t.y === c.y)) return c;
  }
}

function SnakeGame() {
  const [snake, setSnake] = useState<Cell[]>(snakeInitial);
  const [dir, setDir] = useState<Cell>({ x: 1, y: 0 });
  const dirRef = useRef<Cell>(dir);
  const queueRef = useRef<Cell[]>([]);
  const [food, setFood] = useState<Cell>(() => randCell(snakeInitial()));
  const [running, setRunning] = useState(false);
  const [over, setOver] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(() => store.get<number>("snakeBest", 0));
  const [paused, setPaused] = useState(false);
  const liveRef = useRef<HTMLDivElement | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);
  useEffect(() => {
    store.set("snakeBest", best);
  }, [best]);

  const restart = useCallback(() => {
    const s = snakeInitial();
    setSnake(s);
    setDir({ x: 1, y: 0 });
    dirRef.current = { x: 1, y: 0 };
    queueRef.current = [];
    setFood(randCell(s));
    setScore(0);
    setOver(false);
    setRunning(true);
    setPaused(false);
    tap();
  }, []);

  // Tick
  useEffect(() => {
    if (!running || over || paused) return;
    const id = setInterval(() => {
      setSnake((prev) => {
        let nd = dirRef.current;
        while (queueRef.current.length) {
          const cand = queueRef.current.shift()!;
          if (cand.x === -nd.x && cand.y === -nd.y) continue;
          nd = cand;
          break;
        }
        dirRef.current = nd;
        setDir(nd);

        const head = prev[prev.length - 1];
        const nextHead: Cell = { x: head.x + nd.x, y: head.y + nd.y };

        if (
          nextHead.x < 0 ||
          nextHead.x >= SNAKE_COLS ||
          nextHead.y < 0 ||
          nextHead.y >= SNAKE_ROWS
        ) {
          errorTone();
          setOver(true);
          setRunning(false);
          setBest((b) => Math.max(b, score));
          if (liveRef.current) liveRef.current.textContent = `Game over. Score ${score}.`;
          return prev;
        }
        if (prev.some((c, i) => i !== 0 && c.x === nextHead.x && c.y === nextHead.y)) {
          errorTone();
          setOver(true);
          setRunning(false);
          setBest((b) => Math.max(b, score));
          if (liveRef.current) liveRef.current.textContent = `Game over. Score ${score}.`;
          return prev;
        }

        const ate = nextHead.x === food.x && nextHead.y === food.y;
        const next = ate ? [...prev, nextHead] : [...prev.slice(1), nextHead];
        if (ate) {
          tap();
          setScore((s) => s + 1);
          setFood(randCell(next));
          if (liveRef.current) liveRef.current.textContent = `Score ${score + 1}.`;
        }
        return next;
      });
    }, SNAKE_TICK);
    return () => clearInterval(id);
  }, [running, over, paused, food, score]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!running && (e.key === "Enter" || e.key === " ")) {
        if (over || !running) {
          e.preventDefault();
          restart();
          return;
        }
      }
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setPaused((p) => !p);
        return;
      }
      const map: Record<string, Cell> = {
        ArrowUp: { x: 0, y: -1 },
        w: { x: 0, y: -1 },
        W: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        s: { x: 0, y: 1 },
        S: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        a: { x: -1, y: 0 },
        A: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        d: { x: 1, y: 0 },
        D: { x: 1, y: 0 },
      };
      const d = map[e.key];
      if (d) {
        e.preventDefault();
        queueRef.current.push(d);
        if (queueRef.current.length > 3)
          queueRef.current = queueRef.current.slice(-3);
      }
    };
    const el = boardRef.current;
    if (el) el.addEventListener("keydown", onKey);
    return () => {
      if (el) el.removeEventListener("keydown", onKey);
    };
  }, [running, over, restart]);

  // Touch swipe
  useEffect(() => {
    const el = boardRef.current;
    if (!el) return;
    let sx = 0,
      sy = 0,
      active = false;
    const start = (e: TouchEvent) => {
      const t = e.touches[0];
      sx = t.clientX;
      sy = t.clientY;
      active = true;
    };
    const end = (e: TouchEvent) => {
      if (!active) return;
      active = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - sx,
        dy = t.clientY - sy;
      if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;
      const d: Cell =
        Math.abs(dx) > Math.abs(dy)
          ? dx > 0
            ? { x: 1, y: 0 }
            : { x: -1, y: 0 }
          : dy > 0
            ? { x: 0, y: 1 }
            : { x: 0, y: -1 };
      queueRef.current.push(d);
    };
    el.addEventListener("touchstart", start, { passive: true });
    el.addEventListener("touchend", end, { passive: true });
    return () => {
      el.removeEventListener("touchstart", start);
      el.removeEventListener("touchend", end);
    };
  }, []);

  type CellRender = { ch: string; cls: string };
  const grid: CellRender[][] = [];
  for (let y = 0; y < SNAKE_ROWS; y++) {
    const row: CellRender[] = [];
    for (let x = 0; x < SNAKE_COLS; x++) {
      const isHead = snake[snake.length - 1].x === x && snake[snake.length - 1].y === y;
      const isBody = !isHead && snake.some((s) => s.x === x && s.y === y);
      const isFood = food.x === x && food.y === y;
      if (isHead) row.push({ ch: "█", cls: styles.snkHead });
      else if (isBody) row.push({ ch: "▓", cls: styles.snkBody });
      else if (isFood) row.push({ ch: "◆", cls: styles.snkFood });
      else row.push({ ch: "·", cls: styles.snkDot });
    }
    grid.push(row);
  }

  return (
    <div>
      <div className={styles.cmt}># snake.game — eat the ◆, avoid yourself and the walls</div>
      <div className={styles.h1Big}>
        Snake<span className={styles.accent}>.exe</span>
      </div>
      <div className={styles.sub}>
        arrows / wasd to move · p to pause · swipe on touch · enter to (re)start
      </div>

      <div className={styles.snakeHud}>
        <span className={styles.seg}>
          SCORE <b>{String(score).padStart(3, "0")}</b>
        </span>
        <span className={styles.seg}>
          BEST <b>{String(best).padStart(3, "0")}</b>
        </span>
        <span className={styles.seg}>
          LEN <b>{String(snake.length).padStart(2, "0")}</b>
        </span>
        <span className={styles.spacer} />
        <span
          className={styles.seg}
          style={{
            color: over
              ? "var(--rose)"
              : paused
                ? "var(--warn)"
                : running
                  ? "var(--accent)"
                  : "var(--ink-faint)",
          }}
        >
          {over
            ? "● GAME OVER"
            : paused
              ? "● PAUSED"
              : running
                ? "● RUNNING"
                : "○ IDLE"}
        </span>
      </div>

      <div
        ref={boardRef}
        tabIndex={0}
        role="application"
        aria-label="Snake game board. Use arrow keys to control the snake."
        className={styles.snakeBoard}
        onFocus={() => {
          if (!running && !over) setRunning(true);
        }}
        onClick={() => boardRef.current && boardRef.current.focus()}
      >
        <pre className={styles.snakeGrid} aria-hidden="true">
          {grid.map((row, y) => (
            <div key={y} className={styles.snkRow}>
              {row.map((c, x) => (
                <span key={x} className={c.cls}>
                  {c.ch}
                </span>
              ))}
            </div>
          ))}
        </pre>
        {!running && !over && (
          <div className={styles.snakeOverlay}>
            <div className={styles.snkTitle}>▶ click or press enter to start</div>
            <div className={styles.snkSub}>↑ ← ↓ → · wasd · p pauses · esc closes tab</div>
          </div>
        )}
        {over && (
          <div className={styles.snakeOverlay}>
            <div className={styles.snkTitle} style={{ color: "var(--rose)" }}>
              GAME OVER
            </div>
            <div className={styles.snkSub}>
              score {score} · best {Math.max(best, score)}
            </div>
            <button
              className={`${styles.winBtn} ${styles.snkRestart}`}
              onClick={restart}
              data-cursor="tap"
            >
              ↻ restart [enter]
            </button>
          </div>
        )}
        {paused && !over && (
          <div className={styles.snakeOverlay}>
            <div className={styles.snkTitle} style={{ color: "var(--warn)" }}>
              PAUSED
            </div>
            <div className={styles.snkSub}>press p to resume</div>
          </div>
        )}
      </div>

      <div ref={liveRef} className={styles.srOnly} aria-live="polite" />

      <div className={styles.snakeTouch} aria-hidden="true">
        {[
          { k: "↑", d: { x: 0, y: -1 } },
          { k: "←", d: { x: -1, y: 0 } },
          { k: "↓", d: { x: 0, y: 1 } },
          { k: "→", d: { x: 1, y: 0 } },
        ].map((b) => (
          <button
            key={b.k}
            className={styles.snkBtn}
            onPointerDown={() => {
              queueRef.current.push(b.d);
              if (!running && !over) setRunning(true);
              tap();
            }}
          >
            {b.k}
          </button>
        ))}
        <button
          className={`${styles.snkBtn} ${styles.snkAct}`}
          onClick={() => {
            if (over) restart();
            else setPaused((p) => !p);
          }}
        >
          {over ? "↻" : paused ? "▶" : "‖"}
        </button>
      </div>

      <div className={styles.sectionTitle}>$ cat HIGH_SCORES</div>
      <div
        style={{
          fontSize: 12.5,
          color: "var(--ink-dim)",
          lineHeight: 1.9,
          fontFamily: "var(--font-jb-mono), monospace",
        }}
      >
        <div>
          <span className={styles.dim}>001 </span>
          <span className={styles.hl}>mahady</span>
          <span className={styles.dim}> ······ </span>
          {String(Math.max(best, score)).padStart(3, "0")}
          <span className={styles.dim}> (you)</span>
        </div>
        <div>
          <span className={styles.dim}>002 </span>guest_dev<span className={styles.dim}> ··· </span>
          042
        </div>
        <div>
          <span className={styles.dim}>003 </span>flutter_fan<span className={styles.dim}> · </span>
          028
        </div>
        <div>
          <span className={styles.dim}>004 </span>recruiter<span className={styles.dim}> ··· </span>
          015
        </div>
      </div>
    </div>
  );
}

// ---- Matrix rain -------------------------------------------------------
function MatrixRain() {
  const cols = 40;
  const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ▢▣▤▥▦";
  const [items] = useState(() =>
    Array.from({ length: cols }).map((_, i) => {
      const rng = Math.random;
      const text = Array.from({ length: 30 })
        .map(() => chars[Math.floor(rng() * chars.length)])
        .join("");
      return {
        i,
        text,
        left: `${(i / cols) * 100}%`,
        animation: `fall ${2 + rng() * 3}s linear infinite`,
        animationDelay: `${rng() * 2}s`,
        opacity: 0.4 + rng() * 0.6,
      };
    })
  );
  return (
    <div className={styles.matrix}>
      {items.map((c) => (
        <div
          key={c.i}
          className={styles.col}
          style={{
            left: c.left,
            animation: c.animation,
            animationDelay: c.animationDelay,
            opacity: c.opacity,
          }}
        >
          {c.text}
        </div>
      ))}
    </div>
  );
}

function Toast({ msg, show }: { msg: string; show: boolean }) {
  return <div className={`${styles.toast} ${show ? styles.show : ""}`}>$ {msg}</div>;
}

// ---- Tab map -----------------------------------------------------------
const TABS: Record<string, () => React.ReactElement> = {
  readme: Readme,
  about: About,
  experience: Experience,
  projects: Projects,
  skills: Skills,
  awards: Awards,
  education: EducationView,
  contact: Contact,
  snake: SnakeGame,
};

// ---- Page --------------------------------------------------------------
export default function TerminalPage() {
  const [booted, setBooted] = useState(false);
  const [openTabs, setOpenTabs] = useState<string[]>(() =>
    store.get<string[]>("termTabs", ["readme"])
  );
  const [active, setActive] = useState<string>(() => store.get<string>("termActive", "readme"));
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({ msg: "", show: false });
  const [matrixOn, setMatrixOn] = useState(false);

  useEffect(() => {
    store.set("termTabs", openTabs);
  }, [openTabs]);
  useEffect(() => {
    store.set("termActive", active);
  }, [active]);

  const openTab = useCallback((id: string) => {
    setActive(id);
    setOpenTabs((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const closeTab = useCallback(
    (id: string) => {
      const idx = openTabs.indexOf(id);
      const remaining = openTabs.filter((t) => t !== id);
      if (remaining.length === 0) {
        setOpenTabs(["readme"]);
        setActive("readme");
        return;
      }
      setOpenTabs(remaining);
      if (active === id) setActive(remaining[Math.max(0, idx - 1)]);
    },
    [openTabs, active]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openTabs.length > 1) {
        closeTab(active);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, openTabs, closeTab]);

  const triggerMatrix = useCallback(() => {
    setMatrixOn(true);
    setToast({ msg: "matrix mode unlocked", show: true });
    chord();
    setTimeout(() => setMatrixOn(false), 5000);
    setTimeout(() => setToast({ msg: "", show: false }), 3000);
  }, []);

  const Cur = TABS[active] ?? Readme;
  const curFile = FILES.find((f) => f.id === active);

  const rootStyle: CSSProperties = {};

  return (
    <div className={styles.root} style={rootStyle}>
      {!booted && <Boot onDone={() => setBooted(true)} />}
      <div className={styles.dirnav}>
        <Link href="/" data-cursor="hover">◇ index</Link>
        <Link href="/career-app" data-cursor="hover">01 career.app</Link>
        <Link className={styles.cur} href="/terminal" data-cursor="hover">02 terminal</Link>
        <Link href="/studio" data-cursor="hover">03 studio</Link>
      </div>
      <div className={styles.window}>
        <div className={styles.titlebar}>
          <div className={styles.lights}>
            <div className={`${styles.l} ${styles.r}`} />
            <div className={`${styles.l} ${styles.y}`} />
            <div className={`${styles.l} ${styles.g}`} />
          </div>
          <div className={styles.title}>mahady@dev:~ — zsh — 142×38</div>
          <div className={styles.windowActions}>
            <a
              className={styles.winBtn}
              href="/assets/Mahady_Hasan_CV.pdf"
              download
              data-cursor="hover"
            >
              ↓ resume.pdf
            </a>
          </div>
        </div>
        <div className={styles.main}>
          <Sidebar active={active} onOpen={openTab} openTabs={openTabs} />
          <div className={styles.content}>
            <div className={styles.tabs}>
              {openTabs.map((id) => {
                const f = FILES.find((x) => x.id === id);
                if (!f) return null;
                return (
                  <div
                    key={id}
                    className={`${styles.tab} ${active === id ? styles.active : ""}`}
                    onClick={() => {
                      tap();
                      setActive(id);
                    }}
                    data-cursor="tap"
                  >
                    <span className={styles.dot} />
                    <span>{f.tab}</span>
                    <span
                      className={styles.tabClose}
                      onClick={(e) => {
                        e.stopPropagation();
                        pop();
                        closeTab(id);
                      }}
                      data-cursor="hover"
                    >
                      ×
                    </span>
                  </div>
                );
              })}
            </div>
            <div className={styles.viewport}>
              <Cur />
            </div>
            <div className={styles.statusbar}>
              <span className={`${styles.seg} ${styles.accent}`}>● {curFile?.title}</span>
              <span className={styles.seg}>main</span>
              <span className={styles.seg}>utf-8</span>
              <span className={styles.seg}>{cv.location}</span>
              <span className={styles.spacer} />
              <span className={styles.seg}>ln 1, col 1</span>
              <span className={styles.seg}>Spaces: 2</span>
              <span className={`${styles.seg} ${styles.accent}`}>flutter@3.x</span>
            </div>
          </div>
        </div>
      </div>
      <Toast msg={toast.msg} show={toast.show} />
      {matrixOn && <MatrixRain />}
      <div className={styles.scanline} aria-hidden="true" />
      <FxProvider accent="#00ff9c" cursorMode="code" onKonami={triggerMatrix} />
    </div>
  );
}
