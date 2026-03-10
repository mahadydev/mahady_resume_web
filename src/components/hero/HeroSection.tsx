"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import AsciiPortrait from "./AsciiPortrait";
import TypingIntro from "./TypingIntro";
import InteractiveTerminal from "@/components/terminal/InteractiveTerminal";
import { useBoot } from "@/providers/BootProvider";

const MatrixRainCanvas = dynamic(() => import("./MatrixRainCanvas"), {
  ssr: false,
});

export default function HeroSection() {
  const { isBootComplete } = useBoot();

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-16"
      aria-label="Introduction"
    >
      {/* Matrix Rain Background */}
      <MatrixRainCanvas />

      {/* Dark gradient overlay for readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-terminal-bg/80 via-terminal-bg/60 to-terminal-bg" />

      {/* Content — vertically centered */}
      <motion.div
        className="relative z-[2] flex flex-col items-center w-full max-w-5xl mx-auto px-4 sm:px-8"
        initial={{ opacity: 0, y: 20 }}
        animate={isBootComplete ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        {/* ASCII Art Name */}
        <AsciiPortrait />

        {/* Typing Intro */}
        <div className="mt-5 sm:mt-6">
          <TypingIntro enabled={isBootComplete} />
        </div>

        {/* Terminal — directly below intro */}
        {isBootComplete && (
          <div className="w-full mt-6 sm:mt-8">
            <InteractiveTerminal embedded />
          </div>
        )}
      </motion.div>

      {/* Scroll Indicator — pinned to bottom */}
      {isBootComplete && (
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[2]"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center gap-1.5 text-terminal-muted text-xs">
            <span>scroll down</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              className="text-terminal-green"
            >
              <path
                d="M10 4L10 16M10 16L4 10M10 16L16 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </motion.div>
      )}
    </section>
  );
}
