"use client";

import { motion } from "framer-motion";
import { resumeData } from "@/data/resume";
import { useTypingAnimation } from "@/hooks/useTypingAnimation";

function ContactLine({
  label,
  value,
  href,
  delay,
  enabled,
}: {
  label: string;
  value: string;
  href?: string;
  delay: number;
  enabled: boolean;
}) {
  const { displayedText, isComplete } = useTypingAnimation({
    text: `${label}: ${value}`,
    speed: 20,
    startDelay: delay,
    enabled,
  });

  const content = (
    <div className="flex items-center gap-2 text-xs sm:text-sm">
      <span className="text-terminal-green">$</span>
      <span className="text-terminal-amber">print</span>
      <span className="text-terminal-text">
        {displayedText}
        {!isComplete && (
          <span className="inline-block w-2 h-3 ml-0.5 bg-terminal-green animate-blink align-middle" />
        )}
      </span>
    </div>
  );

  if (href && isComplete) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="block hover:text-glow-green transition-all"
      >
        {content}
      </a>
    );
  }

  return content;
}

export default function ContactSection() {
  const { contact } = resumeData;

  const contactItems = [
    { label: "Email", value: contact.email, href: `mailto:${contact.email}` },
    {
      label: "Phone",
      value: contact.phone,
      href: `tel:${contact.phone.replace(/\s/g, "")}`,
    },
    { label: "Location", value: contact.location },
    { label: "LinkedIn", value: contact.linkedin, href: contact.linkedin },
    { label: "GitHub", value: contact.github, href: contact.github },
    { label: "Resume / CV", value: "View PDF", href: contact.cv },
  ];

  return (
    <section id="contact" className="py-16 sm:py-24" aria-label="Contact">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className=""
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-terminal-muted text-xs mb-2 font-mono">
            <span className="text-terminal-green">$</span> dart run contact.dart
            --list
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-terminal-green text-glow-green">
            Get In Touch
          </h2>
          <div className="w-20 h-[1px] bg-terminal-green/50 mx-auto mt-3" />
        </div>

        {/* Terminal-styled Contact */}
        <div className="neon-border rounded-lg p-5 sm:p-6 bg-terminal-bg/80">
          {/* Title Bar */}
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-terminal-green/20">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-terminal-red/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-terminal-amber/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-terminal-green/80" />
            </div>
            <span className="text-xs text-terminal-muted ml-2">
              contact.dart
            </span>
          </div>

          <div className="space-y-3">
            {contactItems.map((item, i) => (
              <ContactLine
                key={item.label}
                label={item.label}
                value={item.value}
                href={item.href}
                delay={i * 600}
                enabled={true}
              />
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-terminal-green/20 text-center">
            <p className="text-sm text-terminal-muted">
              Feel free to reach out — I&apos;m always open to discussing new
              projects and opportunities.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
