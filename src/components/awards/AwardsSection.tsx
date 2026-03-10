"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { resumeData } from "@/data/resume";

function CipherText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState(text);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

  const startDecrypt = useCallback(() => {
    if (hasStarted) return;
    setHasStarted(true);

    let iteration = 0;
    const maxIterations = 20;

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (iteration >= maxIterations) {
          setDisplayText(text);
          setIsRevealed(true);
          clearInterval(interval);
          return;
        }

        const progress = iteration / maxIterations;
        const revealedCount = Math.floor(text.length * progress);

        let result = "";
        for (let i = 0; i < text.length; i++) {
          if (text[i] === " ") {
            result += " ";
          } else if (i < revealedCount) {
            result += text[i];
          } else {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        setDisplayText(result);
        iteration++;
      }, 40);
    }, delay);

    return () => clearTimeout(timer);
  }, [text, delay, chars, hasStarted]);

  return (
    <motion.span
      onViewportEnter={startDecrypt}
      viewport={{ once: true, margin: "-50px" }}
      className={`transition-colors duration-300 ${
        isRevealed ? "text-terminal-amber" : "text-terminal-green/70"
      }`}
    >
      {displayText}
    </motion.span>
  );
}

export default function AwardsSection() {
  return (
    <section
      id="awards"
      className="py-16 sm:py-24"
      aria-label="Awards and Recognition"
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
            <span className="text-terminal-green">$</span> dart run awards.dart
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-terminal-green text-glow-green">
            Awards & Recognition
          </h2>
          <div className="w-20 h-[1px] bg-terminal-green/50 mx-auto mt-3" />
        </div>

        {/* Awards */}
        <div className="space-y-6">
          {resumeData.awards.map((award, i) => (
            <motion.div
              key={award.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.2 }}
              className="neon-border rounded-lg p-5 sm:p-6 bg-terminal-bg/80"
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl shrink-0">🏆</div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">
                    <CipherText text={award.title} delay={i * 300} />
                  </h3>
                  <p className="text-sm text-terminal-text/80 mt-2">
                    {award.description}
                  </p>
                  <div className="text-xs text-terminal-muted mt-2">
                    Year: {award.year}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
