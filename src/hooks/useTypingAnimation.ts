"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseTypingAnimationOptions {
  text: string;
  speed?: number;
  startDelay?: number;
  enabled?: boolean;
  onComplete?: () => void;
}

export function useTypingAnimation({
  text,
  speed = 40,
  startDelay = 0,
  enabled = true,
  onComplete,
}: UseTypingAnimationOptions) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const indexRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);

  const reset = useCallback(() => {
    setDisplayedText("");
    setIsComplete(false);
    setIsStarted(false);
    indexRef.current = 0;
    lastTimeRef.current = 0;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const delayTimer = setTimeout(() => {
      setIsStarted(true);
    }, startDelay);

    return () => clearTimeout(delayTimer);
  }, [enabled, startDelay]);

  useEffect(() => {
    if (!isStarted || !enabled) return;

    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;

      const elapsed = timestamp - lastTimeRef.current;

      if (elapsed >= speed) {
        lastTimeRef.current = timestamp;
        indexRef.current += 1;

        if (indexRef.current <= text.length) {
          setDisplayedText(text.slice(0, indexRef.current));
          rafRef.current = requestAnimationFrame(animate);
        } else {
          setIsComplete(true);
          onComplete?.();
        }
      } else {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isStarted, enabled, text, speed, onComplete]);

  return { displayedText, isComplete, isStarted, reset };
}
