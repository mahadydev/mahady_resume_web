"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSound } from "@/providers/SoundProvider";

const sections = [
  { id: "hero", label: "~" },
  { id: "experience", label: "experience" },
  { id: "skills", label: "skills" },
  { id: "projects", label: "projects" },
  { id: "awards", label: "awards" },
  { id: "contact", label: "contact" },
];

export default function Header() {
  const [activeSection, setActiveSection] = useState("hero");
  const { isSoundEnabled, toggleSound } = useSound();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="fixed top-0 left-0 right-0 z-[9996] bg-terminal-bg/80 backdrop-blur-md border-b border-terminal-green/10"
    >
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Left: Path indicator */}
        <div className="text-xs text-terminal-muted hidden sm:flex items-center gap-1">
          <span className="text-terminal-green">mahady</span>
          <span>:</span>
          <span className="text-terminal-cyan">lib/{activeSection}</span>
          <span className="text-terminal-green animate-blink">_</span>
        </div>

        {/* Center: Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
          {sections.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`px-2 py-1 text-[10px] sm:text-xs rounded transition-colors whitespace-nowrap ${
                activeSection === id
                  ? "text-terminal-green bg-terminal-green/10 border border-terminal-green/30"
                  : "text-terminal-muted hover:text-terminal-text hover:bg-terminal-dim/30"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Right: Sound toggle */}
        <button
          onClick={toggleSound}
          className="text-xs text-terminal-muted hover:text-terminal-green transition-colors p-1"
          aria-label={isSoundEnabled ? "Disable sound" : "Enable sound"}
          aria-pressed={isSoundEnabled}
        >
          {isSoundEnabled ? "🔊" : "🔇"}
        </button>
      </div>
    </motion.header>
  );
}
