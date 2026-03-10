"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-config";
import { resumeData } from "@/data/resume";
import { cn } from "@/lib/utils";

function SkillLevel({ level }: { level: number }) {
  const color =
    level >= 90
      ? "text-terminal-green"
      : level >= 75
        ? "text-terminal-cyan"
        : level >= 60
          ? "text-terminal-amber"
          : "text-terminal-red";

  const bgColor =
    level >= 90
      ? "bg-terminal-green"
      : level >= 75
        ? "bg-terminal-cyan"
        : level >= 60
          ? "bg-terminal-amber"
          : "bg-terminal-red";

  const blocks = Math.round(level / 5);
  const empty = 20 - blocks;

  return (
    <span className="inline-flex items-center gap-2 font-mono">
      <span className="text-terminal-muted">[</span>
      <span className="inline-flex">
        {Array.from({ length: blocks }).map((_, i) => (
          <span
            key={`f-${i}`}
            className={cn(
              "inline-block w-[6px] h-[12px] mr-[1px] rounded-[1px] skill-block opacity-0",
              bgColor,
            )}
            style={{ transitionDelay: `${i * 20}ms` }}
          />
        ))}
        {Array.from({ length: empty }).map((_, i) => (
          <span
            key={`e-${i}`}
            className="inline-block w-[6px] h-[12px] mr-[1px] rounded-[1px] bg-terminal-dim/50"
          />
        ))}
      </span>
      <span className="text-terminal-muted">]</span>
      <span className={cn("text-xs w-8 text-right tabular-nums", color)}>
        {level}%
      </span>
    </span>
  );
}

const fileIcons: Record<string, string> = {
  "Languages & Frameworks": "📦",
  "Architecture & Patterns": "🏗️",
  "Backend & APIs": "🔌",
  "Cloud & DevOps": "☁️",
  "Testing & Quality": "🧪",
};

const fileNames: Record<string, string> = {
  "Languages & Frameworks": "languages.dart",
  "Architecture & Patterns": "architecture.dart",
  "Backend & APIs": "backend.dart",
  "Cloud & DevOps": "cloud.dart",
  "Testing & Quality": "testing.dart",
};

export default function SkillsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState(0);
  const hasScrolled = useRef(false);

  // Initial scroll-triggered animation (first time section comes into view)
  useGSAP(
    () => {
      if (hasScrolled.current) return;

      const blocks = sectionRef.current?.querySelectorAll(".skill-block");
      if (!blocks || blocks.length === 0) return;

      gsap.to(Array.from(blocks), {
        opacity: 1,
        duration: 0.02,
        stagger: 0.015,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
          onEnter: () => {
            hasScrolled.current = true;
          },
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: sectionRef },
  );

  // Re-animate skill blocks when switching tabs (after initial scroll)
  useEffect(() => {
    if (!hasScrolled.current) return;

    // Wait for AnimatePresence exit/enter to finish (~250ms)
    const timer = setTimeout(() => {
      const blocks = sectionRef.current?.querySelectorAll(".skill-block");
      if (!blocks || blocks.length === 0) return;

      gsap.to(Array.from(blocks), {
        opacity: 1,
        duration: 0.02,
        stagger: 0.015,
        ease: "none",
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [activeTab]);

  const activeCategory = resumeData.skills[activeTab];

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="py-16 sm:py-24"
      aria-label="Technical Skills"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-terminal-muted text-xs mb-2 font-mono">
            <span className="text-terminal-green">$</span> flutter doctor
            --verbose
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-terminal-green text-glow-green">
            Technical Skills
          </h2>
          <div className="w-20 h-[1px] bg-terminal-green/50 mx-auto mt-3" />
        </div>

        {/* IDE Window */}
        <div className="neon-border rounded-lg overflow-hidden bg-terminal-bg/90 backdrop-blur-sm">
          {/* IDE Title Bar */}
          <div className="flex items-center gap-2 px-4 py-2 bg-terminal-dim/50 border-b border-terminal-green/20">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-terminal-red/80" />
              <div className="w-3 h-3 rounded-full bg-terminal-amber/80" />
              <div className="w-3 h-3 rounded-full bg-terminal-green/80" />
            </div>
            <span className="text-xs text-terminal-muted ml-2">
              skills — Android Studio
            </span>
          </div>

          {/* Tab Bar */}
          <div className="flex border-b border-terminal-green/10 overflow-x-auto">
            {resumeData.skills.map((category, i) => (
              <button
                key={category.name}
                onClick={() => setActiveTab(i)}
                className={cn(
                  "flex items-center gap-1.5 px-3 sm:px-4 py-2 text-[10px] sm:text-xs whitespace-nowrap border-r border-terminal-green/10 transition-colors relative",
                  activeTab === i
                    ? "bg-terminal-bg text-terminal-text"
                    : "bg-terminal-dim/30 text-terminal-muted hover:text-terminal-text hover:bg-terminal-dim/50",
                )}
              >
                <span>{fileIcons[category.name]}</span>
                <span>{fileNames[category.name]}</span>
                {activeTab === i && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-terminal-green" />
                )}
              </button>
            ))}
          </div>

          {/* Editor Content */}
          <div className="flex">
            {/* Line Numbers */}
            <div className="hidden sm:flex flex-col py-4 px-3 bg-terminal-dim/20 border-r border-terminal-green/10 select-none">
              {Array.from({ length: activeCategory.skills.length + 9 }).map(
                (_, i) => (
                  <div
                    key={i}
                    className="text-[11px] text-terminal-muted/40 leading-6 text-right w-6"
                  >
                    {i + 1}
                  </div>
                ),
              )}
            </div>

            {/* Code Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 py-4 px-4 sm:px-6 font-mono text-xs sm:text-sm leading-6 overflow-x-auto"
              >
                {/* File header comment */}
                <div className="text-terminal-muted/60">
                  {"// "}
                  {fileNames[activeCategory.name]}
                </div>
                <div className="text-terminal-muted/60">
                  {"// "}Proficiency levels for{" "}
                  {activeCategory.name.toLowerCase()}
                </div>
                <div className="h-6" />

                {/* Import statement */}
                <div>
                  <span className="text-terminal-purple">import</span>
                  <span className="text-terminal-green">
                    {" "}
                    &apos;package:resume/models/skill.dart&apos;
                  </span>
                  <span className="text-terminal-text">;</span>
                </div>
                <div className="h-6" />

                {/* Skills as code */}
                <div>
                  <span className="text-terminal-purple">final</span>
                  <span className="text-terminal-text"> </span>
                  <span className="text-terminal-amber">List</span>
                  <span className="text-terminal-text">{"<"}</span>
                  <span className="text-terminal-amber">Skill</span>
                  <span className="text-terminal-text">{">"}</span>
                  <span className="text-terminal-cyan"> skills</span>
                  <span className="text-terminal-text"> = [</span>
                </div>

                {activeCategory.skills.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15, delay: i * 0.05 }}
                    className="pl-4 sm:pl-6 group"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-1 px-2 -mx-2 rounded hover:bg-terminal-green/5 transition-colors">
                      {/* Skill as Dart constructor syntax */}
                      <div className="shrink-0">
                        <span className="text-terminal-amber">Skill</span>
                        <span className="text-terminal-text">(</span>
                        <span className="text-terminal-cyan">name</span>
                        <span className="text-terminal-text">: </span>
                        <span className="text-terminal-green">
                          &apos;{skill.name}&apos;
                        </span>
                        <span className="text-terminal-text">, </span>
                        <span className="text-terminal-cyan">level</span>
                        <span className="text-terminal-text">: </span>
                        <span
                          className={cn(
                            "font-bold",
                            skill.level >= 90
                              ? "text-terminal-green"
                              : skill.level >= 75
                                ? "text-terminal-cyan"
                                : skill.level >= 60
                                  ? "text-terminal-amber"
                                  : "text-terminal-red",
                          )}
                        >
                          {skill.level}
                        </span>
                        <span className="text-terminal-text">),</span>
                      </div>

                      {/* Visual bar */}
                      <div className="hidden md:block">
                        <SkillLevel level={skill.level} />
                      </div>
                    </div>
                  </motion.div>
                ))}

                <div>
                  <span className="text-terminal-text">];</span>
                </div>
                <div className="h-6" />

                {/* Summary comment */}
                <div className="text-terminal-muted/60">
                  {"// "}Total: {activeCategory.skills.length} skills | Avg
                  proficiency:{" "}
                  {Math.round(
                    activeCategory.skills.reduce((sum, s) => sum + s.level, 0) /
                      activeCategory.skills.length,
                  )}
                  %
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between px-4 py-1.5 bg-terminal-dim/30 border-t border-terminal-green/10 text-[10px] text-terminal-muted">
            <div className="flex items-center gap-3">
              <span className="text-terminal-green">●</span>
              <span>Dart</span>
              <span>UTF-8</span>
            </div>
            <div className="flex items-center gap-3">
              <span>Ln {activeCategory.skills.length + 9}, Col 1</span>
              <span>Spaces: 2</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
