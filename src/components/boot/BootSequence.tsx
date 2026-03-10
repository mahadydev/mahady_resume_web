"use client";

import { useRef, useState, useEffect } from "react";
import { gsap, useGSAP } from "@/lib/gsap-config";
import { useBoot } from "@/providers/BootProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { bootLines } from "@/data/ascii-art";

export default function BootSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const { isBootComplete, setBootComplete, shouldSkipBoot } = useBoot();
  const prefersReduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useGSAP(
    () => {
      if (!mounted || shouldSkipBoot || prefersReduced) {
        setBootComplete();
        return;
      }

      const lines = linesRef.current?.children;
      const progress = progressRef.current;
      const flash = flashRef.current;
      const container = containerRef.current;

      if (!lines || !progress || !flash || !container) return;

      const tl = gsap.timeline({
        onComplete: () => {
          setBootComplete();
        },
      });

      // Hide all lines initially
      gsap.set(Array.from(lines), { opacity: 0, y: 5 });
      gsap.set(progress, { width: "0%" });
      gsap.set(flash, { opacity: 0 });

      // Type each line in sequence
      tl.to(Array.from(lines), {
        opacity: 1,
        y: 0,
        duration: 0.05,
        stagger: 0.08,
        ease: "none",
      });

      // Progress bar fills
      tl.to(
        progress,
        {
          width: "100%",
          duration: 1.2,
          ease: "power2.inOut",
        },
        "-=0.5",
      );

      // "SYSTEM READY" flash
      tl.to(flash, {
        opacity: 1,
        duration: 0.1,
      });

      tl.to(flash, {
        opacity: 0,
        duration: 0.1,
      });

      tl.to(flash, {
        opacity: 1,
        duration: 0.1,
      });

      // Hold for a moment
      tl.to({}, { duration: 0.4 });

      // Dissolve the boot screen
      tl.to(container, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      });
    },
    {
      scope: containerRef,
      dependencies: [mounted, shouldSkipBoot, prefersReduced],
    },
  );

  if (!mounted || isBootComplete) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex flex-col justify-center bg-terminal-bg p-6 sm:p-12 overflow-hidden"
    >
      {/* Scanline effect on boot screen */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full"
          style={{
            background:
              "repeating-linear-gradient(0deg, rgba(0,255,65,0.03) 0px, rgba(0,255,65,0.03) 1px, transparent 1px, transparent 3px)",
          }}
        />
      </div>

      <div
        ref={linesRef}
        className="relative max-w-3xl mx-auto w-full space-y-1 text-xs sm:text-sm"
      >
        {bootLines.map((line, i) => (
          <div
            key={i}
            className={`whitespace-pre font-mono ${
              line.includes("[OK]") || line.includes("[LOADED]")
                ? "text-terminal-green"
                : line === ""
                  ? "h-3"
                  : line.startsWith("  ")
                    ? "text-terminal-muted"
                    : "text-terminal-text"
            }`}
          >
            {line.includes("[OK]") ? (
              <>
                <span className="text-terminal-muted">
                  {line.replace("[OK]", "")}
                </span>
                <span className="text-terminal-green">[OK]</span>
              </>
            ) : line.includes("[LOADED]") ? (
              <>
                <span className="text-terminal-muted">
                  {line.replace("[LOADED]", "")}
                </span>
                <span className="text-terminal-cyan">[LOADED]</span>
              </>
            ) : (
              line
            )}
          </div>
        ))}

        {/* Progress bar */}
        <div className="mt-4 pt-2">
          <div className="flex items-center gap-3">
            <span className="text-terminal-amber text-xs sm:text-sm">
              Loading:
            </span>
            <div className="flex-1 h-2 border border-terminal-green/30 rounded-sm overflow-hidden">
              <div
                ref={progressRef}
                className="h-full bg-terminal-green"
                style={{ width: "0%", boxShadow: "0 0 10px #00FF41" }}
              />
            </div>
          </div>
        </div>

        {/* SYSTEM READY */}
        <div
          ref={flashRef}
          className="mt-6 text-center text-xl sm:text-3xl font-bold text-terminal-green text-glow-green tracking-widest"
        >
          {">"} SYSTEM READY _
        </div>
      </div>
    </div>
  );
}
