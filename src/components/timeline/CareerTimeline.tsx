"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap-config";
import { resumeData } from "@/data/resume";
import TimelineNode from "./TimelineNode";

export default function CareerTimeline() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!lineRef.current) return;

      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: 1,
          },
        },
      );

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-16 sm:py-24"
      aria-label="Professional Experience"
    >
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="text-terminal-muted text-xs mb-2 font-mono">
            <span className="text-terminal-green">$</span> flutter pub run
            career_log --verbose
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-terminal-green text-glow-green">
            Professional Experience
          </h2>
          <p className="text-xs text-terminal-muted mt-2">
            {resumeData.experience.length} positions &bull;{" "}
            {new Date().getFullYear() - 2017}+ years in software engineering
          </p>
          <div className="w-20 h-[1px] bg-terminal-green/50 mx-auto mt-3" />
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div
            ref={lineRef}
            className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-[2px] origin-top"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,255,65,0.6), rgba(0,255,255,0.3), rgba(0,255,65,0.1))",
              boxShadow: "0 0 8px rgba(0,255,65,0.2)",
            }}
          />

          {/* Timeline Nodes */}
          <div className="space-y-10 sm:space-y-14">
            {resumeData.experience.map((exp, index) => (
              <TimelineNode key={exp.id} experience={exp} index={index} />
            ))}
          </div>

          {/* End marker */}
          <div className="flex justify-start sm:justify-center mt-8">
            <div className="ml-[10px] sm:ml-0 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-terminal-dim border border-terminal-muted/30" />
              <span className="text-[10px] text-terminal-muted font-mono">
                EOF — career.dart
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
