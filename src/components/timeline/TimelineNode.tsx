"use client";

import { motion } from "framer-motion";
import { Experience } from "@/types/resume";

interface TimelineNodeProps {
  experience: Experience;
  index: number;
}

export default function TimelineNode({ experience, index }: TimelineNodeProps) {
  const isLeft = index % 2 === 0;
  const isPresent = experience.endDate === "Present";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`relative flex items-start gap-6 sm:gap-0 ${
        isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
      }`}
    >
      {/* Timeline Dot */}
      <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center">
        <div
          className={`w-4 h-4 rounded-full border-2 border-terminal-bg ${
            isPresent
              ? "bg-terminal-green animate-neon-pulse"
              : "bg-terminal-cyan"
          }`}
          style={{
            boxShadow: isPresent
              ? "0 0 12px #00FF41, 0 0 24px rgba(0,255,65,0.3)"
              : "0 0 8px rgba(0,255,255,0.4)",
          }}
        />
      </div>

      {/* Card */}
      <div
        className={`ml-10 sm:ml-0 sm:w-[calc(50%-2rem)] ${
          isLeft ? "sm:pr-8" : "sm:pl-8"
        }`}
      >
        <div className="group rounded-lg overflow-hidden bg-terminal-bg-light/60 backdrop-blur-sm border border-terminal-green/15 hover:border-terminal-green/40 transition-all duration-300">
          {/* Card Title Bar — looks like a terminal window */}
          <div className="flex items-center justify-between px-4 py-2 bg-terminal-dim/40 border-b border-terminal-green/10">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-terminal-red/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-terminal-amber/70" />
                <div className="w-2.5 h-2.5 rounded-full bg-terminal-green/70" />
              </div>
              <span className="text-[10px] text-terminal-muted ml-1 hidden sm:inline">
                {experience.company.toLowerCase().replace(/\s+/g, "_")}.dart
              </span>
            </div>
            {/* Status badge */}
            <div
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] ${
                isPresent
                  ? "bg-terminal-green/15 text-terminal-green border border-terminal-green/30"
                  : "bg-terminal-dim/50 text-terminal-muted border border-terminal-muted/20"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isPresent
                    ? "bg-terminal-green animate-neon-pulse"
                    : "bg-terminal-muted"
                }`}
              />
              {isPresent ? "ACTIVE" : "EXITED"}
            </div>
          </div>

          {/* Card Body */}
          <div className="p-4 sm:p-5 space-y-3">
            {/* Role + Duration Row */}
            <div>
              <h3 className="text-sm sm:text-base font-bold text-terminal-cyan group-hover:text-glow-cyan transition-all">
                {experience.role}
              </h3>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                <span className="text-xs text-terminal-amber font-medium">
                  {experience.company}
                </span>
                <span className="text-terminal-muted text-[10px]">•</span>
                <span className="text-[10px] text-terminal-muted">
                  {experience.location}
                </span>
              </div>
            </div>

            {/* Date + Scope as terminal output */}
            <div className="text-[11px] font-mono space-y-0.5">
              <div className="text-terminal-muted">
                <span className="text-terminal-green">$</span> dart run
                duration.dart --from=&apos;{experience.startDate}&apos;
                --to=&apos;{experience.endDate}&apos;
              </div>
              <div className="text-terminal-muted pl-3">{experience.scope}</div>
            </div>

            {/* Separator */}
            <div className="border-t border-dashed border-terminal-green/10" />

            {/* Achievements */}
            <ul className="space-y-2 text-left">
              {experience.achievements.map((achievement, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex gap-2 text-xs sm:text-[13px] text-terminal-text/85 leading-relaxed"
                >
                  <span className="text-terminal-green shrink-0 mt-0.5">▹</span>
                  <span>{achievement}</span>
                </motion.li>
              ))}
            </ul>

            {/* Separator */}
            <div className="border-t border-dashed border-terminal-green/10" />

            {/* Tech Stack */}
            <div>
              <div className="text-[10px] text-terminal-muted mb-2 font-mono">
                <span className="text-terminal-green">$</span> flutter pub deps
                --list
              </div>
              <div className="flex flex-wrap gap-1.5">
                {experience.techStack.map((tech, i) => (
                  <motion.span
                    key={tech}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="px-2 py-0.5 text-[10px] rounded-sm bg-terminal-cyan/8 text-terminal-cyan border border-terminal-cyan/15 hover:border-terminal-cyan/40 hover:bg-terminal-cyan/15 transition-colors cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for the other side */}
      <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
    </motion.div>
  );
}
