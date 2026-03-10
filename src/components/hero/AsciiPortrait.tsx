"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { asciiName } from "@/data/ascii-art";

export default function AsciiPortrait() {
  const [revealed, setRevealed] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`01";
    const target = asciiName;
    let iteration = 0;
    const maxIterations = 15;

    intervalRef.current = setInterval(() => {
      if (iteration >= maxIterations) {
        setDisplayText(target);
        setRevealed(true);
        if (intervalRef.current) clearInterval(intervalRef.current);
        return;
      }

      const progress = iteration / maxIterations;
      const revealedCount = Math.floor(target.length * progress);

      let result = "";
      for (let i = 0; i < target.length; i++) {
        if (target[i] === " " || target[i] === "\n") {
          result += target[i];
        } else if (i < revealedCount) {
          result += target[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }

      setDisplayText(result);
      iteration++;
    }, 60);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <pre
        className={`text-[0.35rem] sm:text-[0.5rem] md:text-xs lg:text-sm leading-tight font-mono select-none transition-colors duration-500 ${
          revealed
            ? "text-terminal-green text-glow-green"
            : "text-terminal-green/70"
        }`}
        aria-hidden="true"
      >
        {displayText}
      </pre>
      <span className="sr-only">MD Mahady Hasan</span>
    </motion.div>
  );
}
