"use client";

import { useState, useCallback, useRef } from "react";
import { TerminalLine } from "@/types/terminal";
import { executeCommand } from "@/components/terminal/commands";
import { generateId } from "@/lib/utils";

const WELCOME_LINES: TerminalLine[] = [
  {
    id: "welcome-1",
    type: "system",
    content: "Welcome to mahady.dev — Interactive Resume Terminal v1.0",
    color: "cyan",
  },
  {
    id: "welcome-2",
    type: "system",
    content: 'Type "help" to see available commands.',
    color: "muted",
  },
  { id: "welcome-3", type: "system", content: "", color: "muted" },
];

export function useTerminal() {
  const [history, setHistory] = useState<TerminalLine[]>(WELCOME_LINES);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentInput, setCurrentInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    }, 50);
  }, []);

  const processCommand = useCallback(
    (input: string) => {
      const trimmed = input.trim();

      // Add input line to history
      const inputLine: TerminalLine = {
        id: generateId(),
        type: "input",
        content: trimmed,
        color: "green",
      };

      if (trimmed.toLowerCase() === "clear") {
        setHistory(WELCOME_LINES);
        setCurrentInput("");
        setHistoryIndex(-1);
        if (trimmed) {
          setCommandHistory((prev) => [...prev, trimmed]);
        }
        return;
      }

      setIsProcessing(true);
      const output = executeCommand(trimmed);

      setHistory((prev) => [...prev, inputLine, ...output]);
      setCurrentInput("");
      setHistoryIndex(-1);

      if (trimmed) {
        setCommandHistory((prev) => [...prev, trimmed]);
      }

      setIsProcessing(false);
      scrollToBottom();
    },
    [scrollToBottom],
  );

  const navigateHistory = useCallback(
    (direction: "up" | "down") => {
      if (commandHistory.length === 0) return;

      if (direction === "up") {
        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      } else {
        if (historyIndex === -1) return;
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput("");
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    },
    [commandHistory, historyIndex],
  );

  return {
    history,
    currentInput,
    setCurrentInput,
    processCommand,
    navigateHistory,
    isProcessing,
    containerRef,
  };
}
