"use client";

import { useTypingAnimation } from "@/hooks/useTypingAnimation";

interface TypingIntroProps {
  enabled?: boolean;
}

export default function TypingIntro({ enabled = true }: TypingIntroProps) {
  const title = useTypingAnimation({
    text: "Senior Mobile Engineer | Flutter Specialist | Mobile Architect",
    speed: 30,
    startDelay: 800,
    enabled,
  });

  const location = useTypingAnimation({
    text: "📍 Dhaka, Bangladesh  •  8+ Years Experience  •  1M+ Users Served",
    speed: 25,
    startDelay: 0,
    enabled: title.isComplete,
  });

  const tagline = useTypingAnimation({
    text: "Building cross-platform applications that scale.",
    speed: 35,
    startDelay: 0,
    enabled: location.isComplete,
  });

  return (
    <div className="space-y-3 sm:space-y-4 text-center">
      {/* Title */}
      <div className="text-sm sm:text-base md:text-lg text-terminal-cyan">
        <span className="text-terminal-muted">$ </span>
        <span className="text-terminal-amber">echo</span>{" "}
        <span>&quot;{title.displayedText}&quot;</span>
        {!title.isComplete && (
          <span className="inline-block w-2 h-4 ml-0.5 bg-terminal-cyan animate-blink align-middle" />
        )}
      </div>

      {/* Location/Stats */}
      <div className="text-xs sm:text-sm text-terminal-text/80">
        <span className="text-terminal-muted">{">"} </span>
        {location.displayedText}
        {title.isComplete && !location.isComplete && (
          <span className="inline-block w-2 h-3 ml-0.5 bg-terminal-green animate-blink align-middle" />
        )}
      </div>

      {/* Tagline */}
      <div className="text-xs sm:text-sm text-terminal-green font-bold">
        <span className="text-terminal-muted">{">"} </span>
        {tagline.displayedText}
        {location.isComplete && !tagline.isComplete && (
          <span className="inline-block w-2 h-3 ml-0.5 bg-terminal-green animate-blink align-middle" />
        )}
        {tagline.isComplete && (
          <span className="inline-block w-2 h-3 ml-0.5 bg-terminal-green animate-blink align-middle" />
        )}
      </div>
    </div>
  );
}
