"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import { cv } from "@/data/cv";
import { FxProvider } from "@/fx/fx-provider";
import { mintRain } from "@/fx/mint-rain";
import { chord, click, pop, success, swipe, tap } from "@/fx/sound";
import styles from "./studio.module.css";

type Mouse = { x: number; y: number };

function useMouse(): Mouse {
  const [m, setM] = useState<Mouse>({ x: 0, y: 0 });
  useEffect(() => {
    const f = (e: MouseEvent) =>
      setM({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    window.addEventListener("mousemove", f);
    return () => window.removeEventListener("mousemove", f);
  }, []);
  return m;
}

function useScroll(): number {
  const [y, setY] = useState<number>(0);
  useEffect(() => {
    const f = () => setY(window.scrollY);
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  return y;
}

/* ------------------------------------------------------------------ */
/* Nav                                                                 */
/* ------------------------------------------------------------------ */

function Nav() {
  return (
    <>
      <div className={styles.dirnav}>
        <Link href="/">◇ index</Link>
        <Link href="/career-app">01 career.app</Link>
        <Link href="/terminal">02 terminal</Link>
        <Link className={styles.cur} href="/studio">
          03 studio
        </Link>
      </div>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          Mahady<span style={{ color: "var(--accent)" }}>.</span>
        </div>
        <div className={styles.links}>
          <a href="#work" data-cursor="hover">
            Work
          </a>
          <a href="#career" data-cursor="hover">
            Career
          </a>
          <a href="#skills" data-cursor="hover">
            Skills
          </a>
          <a href="#awards" data-cursor="hover">
            Awards
          </a>
          <a href="#contact" data-cursor="hover">
            Contact
          </a>
          <a href="/assets/Mahady_Hasan_CV.pdf" download data-cursor="hover">
            ↓ CV
          </a>
        </div>
      </nav>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

function Hero({ mouse, scroll }: { mouse: Mouse; scroll: number }) {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const tx = mouse.x * 16;
  const ty = mouse.y * 12;

  return (
    <section className={styles.hero}>
      {/* Floating decoration */}
      <svg
        className={styles.deco}
        style={{
          top: 80,
          right: 90,
          width: 110,
          height: 110,
          transform: `translate(${-tx}px, ${-ty}px) rotate(${scroll * 0.04}deg)`,
        }}
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M50 5 L95 50 L50 95 L5 50 Z"
          stroke="var(--accent)"
          strokeWidth="0.7"
        />
        <path
          d="M50 20 L80 50 L50 80 L20 50 Z"
          stroke="var(--accent)"
          strokeWidth="0.7"
          opacity="0.5"
        />
        <circle cx="50" cy="50" r="3" fill="var(--accent)" />
      </svg>
      <svg
        className={styles.deco}
        style={{
          bottom: 80,
          left: 60,
          width: 80,
          height: 80,
          transform: `translate(${tx * 1.2}px, ${ty}px) rotate(${-scroll * 0.05}deg)`,
        }}
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="40" stroke="var(--rose)" strokeWidth="0.7" />
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="var(--rose)"
          strokeWidth="0.5"
          strokeDasharray="2 4"
          opacity="0.5"
        />
        <line
          x1="10"
          y1="50"
          x2="90"
          y2="50"
          stroke="var(--rose)"
          strokeWidth="0.5"
          opacity="0.6"
        />
      </svg>
      <svg
        className={styles.deco}
        style={{
          top: "40%",
          left: 40,
          width: 60,
          height: 60,
          transform: `translate(${tx * 0.8}px, ${-ty * 1.4}px)`,
        }}
        viewBox="0 0 100 100"
        fill="none"
      >
        <path
          d="M30 20 L70 60 L50 80 L20 50 Z"
          fill="var(--accent)"
          fillOpacity="0.2"
          stroke="var(--accent)"
          strokeWidth="0.7"
        />
      </svg>

      <div className={styles["hero-left"]}>
        <div className={styles.eyebrow}>
          Senior Engineer · Flutter Architect · Dhaka, BD
        </div>
        <h1>
          I build for the <i>pocket.</i>
        </h1>
        <p className={styles.lede}>
          {cv.shortBio} Currently shipping{" "}
          <span style={{ color: "var(--accent)" }}>Ezycourse</span> at Appifylab —
          an LMS serving 200+ institutions and a million-plus learners.
        </p>
        <div className={styles["hero-marks"]}>
          <span>
            <b data-count="8" data-count-suffix="+">
              0
            </b>
            years
          </span>
          <span>
            <b data-count="1000000" data-count-fmt="m" data-count-suffix="+">
              0
            </b>
            users shipped
          </span>
          <span>
            <b data-count="200" data-count-suffix="+">
              0
            </b>
            clients
          </span>
          <span>
            <b data-count="12">0</b>team peak
          </span>
        </div>
      </div>

      <div
        className={styles["hero-phone"]}
        style={{ transform: `rotate(${mouse.x * 4}deg)` }}
      >
        <div
          className={styles["hp-frame"]}
          style={{
            transform: `rotate(${-4 + mouse.x * 3}deg) translate(${tx * 0.6}px, ${
              ty * 0.4
            }px)`,
          }}
        >
          <div className={styles["hp-screen"]}>
            <div className={styles.time}>{time}</div>
            <div className={styles.widget}>
              <div className={styles.lbl}>Now Shipping</div>
              <div className={styles.val}>Ezycourse v3</div>
              <div className={styles.stack}>
                <span>flutter</span>
                <span>bloc</span>
                <span>aws</span>
              </div>
            </div>
            <div className={`${styles.widget} ${styles.row}`}>
              <div>
                <div className={styles.lbl}>Coverage</div>
                <div className={styles.val}>95%</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className={styles.lbl}>Uptime</div>
                <div className={styles.val}>99.9%</div>
              </div>
            </div>
            <div className={styles.widget}>
              <div className={styles.lbl}>Available</div>
              <div className={styles.val} style={{ color: "var(--accent)" }}>
                ● for opportunities
              </div>
            </div>
            <div
              className={styles.widget}
              style={{
                background: "rgba(232,106,85,0.06)",
                borderColor: "rgba(232,106,85,0.2)",
              }}
            >
              <div className={styles.lbl} style={{ color: "var(--rose)" }}>
                Latest commit
              </div>
              <div
                className={styles.val}
                style={{
                  fontSize: 13,
                  fontFamily: "var(--font-jb-mono), monospace",
                  letterSpacing: 0,
                }}
              >
                fix(home): swipe gesture priority
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles["hero-right"]}>
        <div className={styles["float-card"]} data-cursor="hover">
          <div className={styles.ico}>★</div>
          <div className={styles.ttl}>BASIS ICT Award &apos;22</div>
          <div className={styles.desc}>
            National champion for Probash Bondhu — a fintech app for expatriates.
          </div>
        </div>
        <div
          className={`${styles["float-card"]} ${styles.b}`}
          data-cursor="hover"
        >
          <div
            className={styles.ico}
            style={{ background: "var(--rose)", color: "#fff" }}
          >
            ↗
          </div>
          <div className={styles.ttl}>10× client revenue</div>
          <div className={styles.desc}>
            Smart upsell engine across white-labelled LMS deployments.
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* About                                                               */
/* ------------------------------------------------------------------ */

function About() {
  return (
    <section id="about">
      <div className={styles["sec-num"]} data-reveal="up">
        01 — About
      </div>
      <h2 className={styles["sec-h"]} data-reveal="chars">
        A decade in motion.
      </h2>
      <p className={styles["sec-sub"]}>
        From WordPress sites in 2017 to Flutter monorepos shipping to a million
        users — same person, longer feedback loop.
      </p>
      <div className={styles["bio-grid"]}>
        <div className={styles.copy}>
          I&apos;m a <span className={styles.hi}>Senior Mobile Engineer</span>{" "}
          with eight-plus years building cross-platform applications that scale.
          I&apos;ve led teams of <span className={styles.hi}>five to twelve</span>,
          mentored juniors into seniors, and stood up CI/CD pipelines that cut
          deployment time by 60%. My happy place is the intersection of Clean
          Architecture, BLoC, and performance budgets — where elegant code meets
          a 60fps frame.
        </div>
        <div className={styles["stats-stack"]}>
          {cv.stats.map((s, i) => {
            const symMatch = s.value.match(/[+%]/);
            const sym = symMatch ? symMatch[0] : "";
            const num = s.value.replace(/[+%]/g, "");
            return (
              <div key={i} className={styles.r}>
                <span className={styles.v}>
                  {num}
                  {sym && <sup>{sym}</sup>}
                </span>
                <span className={styles.k}>{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Career                                                              */
/* ------------------------------------------------------------------ */

function Career() {
  const [open, setOpen] = useState<number>(0);
  return (
    <section id="career">
      <div className={styles["sec-num"]} data-reveal="up">
        02 — Career
      </div>
      <h2 className={styles["sec-h"]} data-reveal="chars">
        Five chapters, one through-line.
      </h2>
      <p className={styles["sec-sub"]}>
        Ship things people use. Build the team that ships next. Repeat.
      </p>
      <div className={styles["exp-list"]}>
        {cv.experience.map((x, i) => {
          const roleHeading = x.role
            .replace("Senior Software Engineer", "Senior Engineer")
            .split(" — ")[0];
          const isOpen = open === i;
          return (
            <div
              key={i}
              className={`${styles.exp} ${isOpen ? styles.open : ""}`}
              onClick={() => {
                tap();
                setOpen(isOpen ? -1 : i);
              }}
              data-cursor="hover"
            >
              <div className={styles.when}>
                {x.start}
                <br />→ {x.end}
              </div>
              <div>
                <div className={styles.role}>
                  {roleHeading}{" "}
                  <span className={styles.accent}>@ {x.company}</span>
                </div>
                <div className={styles.co}>{x.location}</div>
                <div className={styles.scope}>{x.scope}</div>
              </div>
              <div className={styles["exp-arr"]}>+</div>
              <div className={styles["exp-detail"]}>
                <div className={styles["exp-detail-inner"]}>
                  <div />
                  <div>
                    <ul>
                      {x.bullets.map((b, k) => (
                        <li key={k}>{b}</li>
                      ))}
                    </ul>
                    <div className={styles["exp-stack"]}>
                      {x.stack.map((s) => (
                        <span key={s}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Work — drag-to-stack polaroid deck                                  */
/* ------------------------------------------------------------------ */

const uid = () => "s-" + Math.random().toString(36).slice(2, 9);

const INIT_LAYOUT: { x: number; y: number; rot: number }[] = [
  { x: 60, y: 30, rot: -5 },
  { x: 430, y: 90, rot: 3 },
  { x: 770, y: 20, rot: -2 },
  { x: 260, y: 330, rot: 5 },
];

interface Card {
  id: string;
  x: number;
  y: number;
  rot: number;
  stack: string;
}

interface DragState {
  id: string;
  dx: number;
  dy: number;
}

function Work() {
  const buildInit = useCallback<() => Card[]>(
    () =>
      cv.projects.map((p, i) => ({
        id: p.name,
        x: INIT_LAYOUT[i].x,
        y: INIT_LAYOUT[i].y,
        rot: INIT_LAYOUT[i].rot,
        stack: "s-init-" + i,
      })),
    []
  );
  const [cards, setCards] = useState<Card[]>(buildInit);
  const [order, setOrder] = useState<string[]>(() =>
    cv.projects.map((p) => p.name)
  );
  const [drag, setDrag] = useState<DragState | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [pulse, setPulse] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  const get = useCallback(
    (id: string): Card | undefined => cards.find((c) => c.id === id),
    [cards]
  );
  const stackOf = useCallback(
    (sid: string): string[] =>
      order.filter((id) => {
        const c = cards.find((x) => x.id === id);
        return !!c && c.stack === sid;
      }),
    [order, cards]
  );
  const visualPos = useCallback(
    (id: string): { x: number; y: number; rot: number } => {
      const c = get(id);
      if (!c) return { x: 0, y: 0, rot: 0 };
      const members = stackOf(c.stack);
      const bot = get(members[0]) || c;
      const idx = members.indexOf(id);
      const offMag = idx;
      return {
        x: bot.x + offMag * 5,
        y: bot.y + offMag * 4,
        rot:
          bot.rot +
          (idx === 0 ? 0 : (idx % 2 ? -1.6 : 1.6) * Math.min(idx, 3)),
      };
    },
    [get, stackOf]
  );
  const stackIdx = useCallback(
    (id: string): number => {
      const c = get(id);
      if (!c) return 0;
      return stackOf(c.stack).indexOf(id);
    },
    [get, stackOf]
  );
  const stackSize = useCallback(
    (id: string): number => {
      const c = get(id);
      if (!c) return 1;
      return stackOf(c.stack).length;
    },
    [get, stackOf]
  );

  const bringFront = useCallback((id: string) => {
    setOrder((o) => [...o.filter((x) => x !== id), id]);
  }, []);

  const startDrag = useCallback(
    (id: string, e: ReactPointerEvent<HTMLDivElement>) => {
      const pos = visualPos(id);
      const r = e.currentTarget.getBoundingClientRect();
      setCards((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, x: pos.x, y: pos.y, rot: pos.rot, stack: uid() }
            : c
        )
      );
      bringFront(id);
      setDrag({ id, dx: e.clientX - r.left, dy: e.clientY - r.top });
      click();
    },
    [bringFront, visualPos]
  );

  useEffect(() => {
    if (!drag) return;
    const move = (e: PointerEvent) => {
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - drag.dx;
      const y = e.clientY - rect.top - drag.dy;
      setCards((prev) =>
        prev.map((c) => (c.id === drag.id ? { ...c, x, y } : c))
      );
      const cx = x + 160;
      const cy = y + 140;
      let target: string | null = null;
      for (let i = order.length - 1; i >= 0; i--) {
        const id = order[i];
        if (id === drag.id) continue;
        const p = visualPos(id);
        if (cx >= p.x && cx <= p.x + 320 && cy >= p.y && cy <= p.y + 260) {
          target = id;
          break;
        }
      }
      setHint(target);
    };
    const up = () => {
      if (hint) {
        const t = get(hint);
        const did = drag.id;
        if (t) {
          setCards((prev) =>
            prev.map((c) =>
              c.id === did
                ? { ...c, x: t.x, y: t.y, rot: t.rot, stack: t.stack }
                : c
            )
          );
          success();
          setPulse(t.stack);
          window.setTimeout(() => setPulse(null), 500);
        }
      } else {
        pop();
      }
      setDrag(null);
      setHint(null);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [drag, order, hint, get, visualPos]);

  const spread = useCallback(() => {
    swipe();
    setCards(buildInit());
    setOrder(cv.projects.map((p) => p.name));
  }, [buildInit]);

  const stackAll = useCallback(() => {
    chord();
    const sid = uid();
    setCards((prev) =>
      prev.map((c, i) => ({ ...c, x: 380, y: 160, rot: -8 + i * 3, stack: sid }))
    );
    setPulse(sid);
    window.setTimeout(() => setPulse(null), 500);
  }, []);

  const splitFromKey = useCallback(
    (id: string) => {
      const c = get(id);
      if (!c) return;
      const members = stackOf(c.stack);
      if (members.length < 2) return;
      const idx = members.indexOf(id);
      const drift = idx % 2 ? 1 : -1;
      setCards((prev) =>
        prev.map((x) =>
          x.id === id ? { ...x, x: c.x + 240 * drift, y: c.y + 40, stack: uid() } : x
        )
      );
      bringFront(id);
      tap();
    },
    [bringFront, get, stackOf]
  );

  return (
    <section id="work">
      <div className={styles["sec-num"]} data-reveal="up">
        03 — Selected Work
      </div>
      <h2 className={styles["sec-h"]} data-reveal="chars">
        Four products, one million users.
      </h2>
      <p className={styles["sec-sub"]}>
        Drag a card onto another to stack them — like polaroids in a deck. Drag
        the top one off to split. The buttons are for the keyboard crowd.
      </p>
      <div className={styles["stage-actions"]}>
        <button
          className={styles["sa-btn"]}
          onClick={stackAll}
          data-cursor="hover"
        >
          ◇ stack all
        </button>
        <button
          className={styles["sa-btn"]}
          onClick={spread}
          data-cursor="hover"
        >
          ↺ lay out
        </button>
        <div className={styles["sa-hint"]}>drag · stack · split</div>
      </div>
      <div className={styles["proj-stage"]} ref={stageRef}>
        {order.map((id, z) => {
          const c = get(id);
          if (!c) return null;
          const p = cv.projects.find((pr) => pr.name === id);
          if (!p) return null;
          const pos = visualPos(id);
          const idx = stackIdx(id);
          const size = stackSize(id);
          const isTop = idx === size - 1;
          const stacked = size > 1;
          const classes = [
            styles["proj-card"],
            styles[`tone-${p.tone}`],
            drag && drag.id === id ? styles.dragging : "",
            hint === id ? styles["drop-target"] : "",
            stacked && !isTop ? styles.buried : "",
            pulse === c.stack ? styles["merge-pulse"] : "",
          ]
            .filter(Boolean)
            .join(" ");
          return (
            <div
              key={id}
              className={classes}
              style={{
                left: pos.x,
                top: pos.y,
                transform: `rotate(${pos.rot}deg)`,
                zIndex: z + 1,
                pointerEvents: stacked && !isTop ? "none" : "auto",
              }}
              role="button"
              tabIndex={stacked && !isTop ? -1 : 0}
              aria-label={`${p.name} — ${p.tag}. ${
                stacked ? `Stack of ${size}. ` : ""
              }Drag to stack with another card.`}
              onPointerDown={(e) => {
                if ((e.target as HTMLElement).closest("a, button")) return;
                startDrag(id, e);
              }}
              onKeyDown={(e: ReactKeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (stacked) splitFromKey(id);
                  else bringFront(id);
                  tap();
                }
              }}
              data-cursor="hover"
            >
              {stacked && isTop && (
                <div className={styles["stack-badge"]}>+{size - 1}</div>
              )}
              <div className={styles.tag}>{p.tag}</div>
              <h3>{p.name}</h3>
              <p>{p.blurb}</p>
              <div className={styles.metr}>
                {p.metrics.map((m, k) => (
                  <div key={k} className={styles.m}>
                    <div className={styles.v}>{m.v}</div>
                    <div className={styles.k}>{m.k}</div>
                  </div>
                ))}
              </div>
              <div className={styles.stk}>
                {p.stack.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Skills                                                              */
/* ------------------------------------------------------------------ */

function Skills() {
  return (
    <section id="skills">
      <div className={styles["sec-num"]} data-reveal="up">
        04 — Skills
      </div>
      <h2 className={styles["sec-h"]} data-reveal="chars">
        A constellation, not a list.
      </h2>
      <p className={styles["sec-sub"]}>
        Things I reach for first. Hover anything that catches your eye.
      </p>
      <div className={styles.const}>
        {Object.entries(cv.skills).map(([g, items]) => (
          <div key={g} className={styles.group}>
            <div className={styles.gh}>{g.toLowerCase()}.</div>
            <div className={styles.items}>
              {items.map((s) => (
                <span
                  key={s}
                  className={styles.item}
                  data-cursor="hover"
                  onMouseEnter={() => tap()}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Awards                                                              */
/* ------------------------------------------------------------------ */

function Awards() {
  return (
    <section id="awards">
      <div className={styles["sec-num"]} data-reveal="up">
        05 — Recognition
      </div>
      <h2 className={styles["sec-h"]} data-reveal="chars">
        Trophies, once.
      </h2>
      <p className={styles["sec-sub"]}>
        External validation is nice. Shipping is better. But these are kind of
        fun.
      </p>
      <div className={styles["awards-row"]}>
        {cv.awards.map((a, i) => (
          <div key={i} className={styles.award} data-cursor="hover">
            {i === 0 && <div className={styles.ribbon}>Champion</div>}
            <div className={styles.year}>{a.year}</div>
            <h3>{a.title}</h3>
            <p>{a.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Education                                                           */
/* ------------------------------------------------------------------ */

function EducationSection() {
  return (
    <section id="education">
      <div className={styles["sec-num"]}>06 — Education</div>
      <h2 className={styles["sec-h"]}>
        The <i>foundation.</i>
      </h2>
      <div className={styles["edu-card"]}>
        <div className={styles.icon}>
          e<span style={{ fontStyle: "italic" }}>.</span>
        </div>
        <div>
          <div className={styles.y}>{cv.education.years}</div>
          <div className={styles.deg}>{cv.education.degree}</div>
          <div className={styles.sch}>
            {cv.education.school} · {cv.education.location}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div className={styles.y}>Languages</div>
          {cv.languages.map((l) => (
            <div
              key={l.name}
              style={{
                fontFamily: "var(--font-newsreader), serif",
                fontSize: 18,
                marginTop: 4,
              }}
            >
              {l.name}{" "}
              <span style={{ color: "var(--ink-faint)", fontSize: 13 }}>
                · {l.level}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Contact                                                             */
/* ------------------------------------------------------------------ */

function Contact() {
  return (
    <section id="contact" className={styles.cta}>
      <div className={styles.pretitle}>Get in touch · {cv.location}</div>
      <h2>
        Let&apos;s build <i>something</i>
        <br />
        that ships.
      </h2>
      <a
        className={styles["email-btn"]}
        href={`mailto:${cv.email}`}
        data-cursor="hover"
        data-magnetic-el="0.25"
      >
        <span>✉</span> {cv.email}
      </a>
      <div className={styles["cta-links"]}>
        <a
          href={`https://${cv.links.linkedin}`}
          target="_blank"
          rel="noreferrer"
          data-cursor="hover"
        >
          LinkedIn
        </a>
        <a
          href={`https://${cv.links.github}`}
          target="_blank"
          rel="noreferrer"
          data-cursor="hover"
        >
          GitHub
        </a>
        <a
          href={`https://${cv.links.site}`}
          target="_blank"
          rel="noreferrer"
          data-cursor="hover"
        >
          Portfolio
        </a>
        <a
          href="/assets/Mahady_Hasan_CV.pdf"
          download
          data-cursor="hover"
        >
          ↓ Resume.pdf
        </a>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function Footer() {
  return (
    <div className={styles.footer}>
      <span>© 2026 MD MAHADY HASAN · {cv.location.toUpperCase()}</span>
      <span>↑↑↓↓←→←→BA</span>
      <span>v1.0 · BUILT WITH FLUTTER ENERGY</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Toast                                                               */
/* ------------------------------------------------------------------ */

function Toast({ msg, show }: { msg: string; show: boolean }) {
  return (
    <div className={`${styles.toast} ${show ? styles.show : ""}`}>{msg}</div>
  );
}

/* ------------------------------------------------------------------ */
/* App                                                                 */
/* ------------------------------------------------------------------ */

export default function StudioPage() {
  const mouse = useMouse();
  const scroll = useScroll();
  const [toast, setToast] = useState<{ msg: string; show: boolean }>({
    msg: "",
    show: false,
  });

  const onKonami = useMemo(
    () => () => {
      document.body.style.transition = "transform .5s";
      document.body.style.transform = "rotate(-1.5deg)";
      mintRain("#ffb84a");
      setToast({ msg: "🌼 you found it", show: true });
      window.setTimeout(() => {
        document.body.style.transform = "rotate(0)";
      }, 1500);
      window.setTimeout(() => setToast({ msg: "", show: false }), 3000);
    },
    []
  );

  return (
    <div className={styles.root}>
      <div className={styles.grain} />
      <Nav />
      <Hero mouse={mouse} scroll={scroll} />
      <About />
      <Career />
      <Work />
      <Skills />
      <Awards />
      <EducationSection />
      <Contact />
      <Footer />
      <Toast {...toast} />
      <FxProvider accent="#ffb84a" cursorMode="quill" onKonami={onKonami} />
    </div>
  );
}
