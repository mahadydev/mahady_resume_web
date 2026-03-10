"use client";

import { cn } from "@/lib/utils";

interface GlitchTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p" | "div";
  active?: boolean;
}

export default function GlitchText({
  text,
  className,
  as: Tag = "span",
  active = true,
}: GlitchTextProps) {
  if (!active) {
    return <Tag className={className}>{text}</Tag>;
  }

  return (
    <Tag className={cn("glitch", className)} data-text={text}>
      {text}
    </Tag>
  );
}
