"use client";

import { useRef, useEffect, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { useTerminal } from "@/hooks/useTerminal";
import { useSound } from "@/providers/SoundProvider";
import { TerminalLine } from "@/types/terminal";

const colorMap: Record<string, string> = {
  green: "text-terminal-green",
  cyan: "text-terminal-cyan",
  amber: "text-terminal-amber",
  red: "text-terminal-red",
  purple: "text-terminal-purple",
  muted: "text-terminal-muted",
  white: "text-terminal-text",
};

function TerminalOutputLine({ line }: { line: TerminalLine }) {
  const colorClass = line.color ? colorMap[line.color] : "text-terminal-text";

  if (line.type === "input") {
    return (
      <div className="flex gap-2">
        <span className="text-terminal-green shrink-0">
          visitor@mahady.dev:~$
        </span>
        <span className="text-terminal-text">{line.content}</span>
      </div>
    );
  }

  if (line.href) {
    return (
      <a
        href={line.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${colorClass} whitespace-pre-wrap break-words hover:underline decoration-1 underline-offset-4 cursor-pointer`}
      >
        {line.content}
      </a>
    );
  }

  return (
    <div className={`${colorClass} whitespace-pre-wrap break-words`}>
      {line.content}
    </div>
  );
}

interface InteractiveTerminalProps {
  embedded?: boolean;
}

export default function InteractiveTerminal({
  embedded = false,
}: InteractiveTerminalProps) {
  const {
    history,
    currentInput,
    setCurrentInput,
    processCommand,
    navigateHistory,
    containerRef,
  } = useTerminal();

  const inputRef = useRef<HTMLInputElement>(null);
  const { playKeypress } = useSound();

  const focusInput = () => inputRef.current?.focus();

  // Scroll terminal container (not the page) on new output
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history, containerRef]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processCommand(currentInput);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      navigateHistory("up");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      navigateHistory("down");
    } else if (e.key === "Tab") {
      e.preventDefault();
      const commands = [
        "help",
        "about",
        "skills",
        "experience",
        "projects",
        "awards",
        "education",
        "contact",
        "whoami",
        "clear",
        "sudo",
        "matrix",
        "cv",
        "resume",
      ];
      const match = commands.find((c) =>
        c.startsWith(currentInput.toLowerCase()),
      );
      if (match) setCurrentInput(match);
    } else {
      playKeypress();
    }
  };

  const terminalContent = (
    <>
      {/* Terminal Window Chrome */}
      <div className="neon-border rounded-lg overflow-hidden bg-terminal-bg/90 backdrop-blur-sm">
        {/* Title Bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-terminal-dim/50 border-b border-terminal-green/20">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-terminal-red/80" />
            <div className="w-3 h-3 rounded-full bg-terminal-amber/80" />
            <div className="w-3 h-3 rounded-full bg-terminal-green/80" />
          </div>
          <span className="text-xs text-terminal-muted ml-2">
            visitor@mahady.dev — bash — 80×24
          </span>
        </div>

        {/* Terminal Content */}
        <div
          ref={containerRef}
          onClick={focusInput}
          className="p-4 h-[250px] sm:h-[300px] overflow-y-auto cursor-text text-xs sm:text-sm leading-relaxed"
          role="log"
          aria-live="polite"
        >
          {history.map((line) => (
            <TerminalOutputLine key={line.id} line={line} />
          ))}

          {/* Input Line */}
          <div className="flex gap-2 items-center mt-1">
            <span className="text-terminal-green shrink-0">
              visitor@mahady.dev:~$
            </span>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-terminal-text outline-none caret-terminal-green font-mono text-xs sm:text-sm"
                autoFocus
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal input"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hint */}
      <p className="text-center text-terminal-muted text-xs mt-3">
        Try typing{" "}
        <code className="text-terminal-green px-1 py-0.5 bg-terminal-dim/50 rounded">
          help
        </code>{" "}
        to get started, or{" "}
        <code className="text-terminal-green px-1 py-0.5 bg-terminal-dim/50 rounded">
          about
        </code>{" "}
        to learn more
      </p>
    </>
  );

  // When embedded (inside hero), render without section wrapper
  if (embedded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {terminalContent}
      </motion.div>
    );
  }

  // Standalone section (fallback)
  return (
    <section
      id="terminal"
      className="py-16 sm:py-24 px-4"
      aria-label="Interactive Terminal"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        {terminalContent}
      </motion.div>
    </section>
  );
}
