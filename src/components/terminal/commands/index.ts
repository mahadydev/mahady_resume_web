import { TerminalCommand, TerminalLine } from "@/types/terminal";
import { resumeData } from "@/data/resume";
import { generateId } from "@/lib/utils";

function line(
  content: string,
  color?: TerminalLine["color"],
  type: TerminalLine["type"] = "output",
): TerminalLine {
  return { id: generateId(), type, content, color };
}

const helpCommand: TerminalCommand = {
  name: "help",
  description: "List available commands",
  execute: () => [
    line("Available commands:", "cyan"),
    line(""),
    line("  help          Show this help message", "green"),
    line("  about         About me — professional summary", "green"),
    line("  skills        Technical skills & proficiency", "green"),
    line("  experience    Work experience timeline", "green"),
    line("  projects      Featured project case studies", "green"),
    line("  awards        Awards & recognition", "green"),
    line("  education     Education background", "green"),
    line("  contact       How to reach me", "green"),
    line("  whoami        Who are you?", "green"),
    line("  clear         Clear terminal", "green"),
    line("  flutter       Run flutter doctor", "green"),
    line("  matrix        ???", "muted"),
    line(""),
    line("Tip: Use ↑/↓ arrows to navigate command history", "muted"),
  ],
};

const aboutCommand: TerminalCommand = {
  name: "about",
  description: "Professional summary",
  execute: () => [
    line("╔══════════════════════════════════════════════════╗", "cyan"),
    line("║             ABOUT — MD MAHADY HASAN              ║", "cyan"),
    line("╚══════════════════════════════════════════════════╝", "cyan"),
    line(""),
    line(resumeData.summary),
    line(""),
    line(
      `Core: Flutter, Dart, Clean Architecture, BLoC, CI/CD, AWS, GraphQL, Firebase`,
      "green",
    ),
  ],
};

const skillsCommand: TerminalCommand = {
  name: "skills",
  description: "Technical skills",
  execute: () => {
    const lines: TerminalLine[] = [
      line("╔══════════════════════════════════════════════════╗", "cyan"),
      line("║               TECHNICAL SKILLS                   ║", "cyan"),
      line("╚══════════════════════════════════════════════════╝", "cyan"),
      line(""),
    ];

    resumeData.skills.forEach((category) => {
      lines.push(line(`  [ ${category.name} ]`, "amber"));
      category.skills.forEach((skill) => {
        const filled = Math.round(skill.level / 5);
        const empty = 20 - filled;
        const bar = "█".repeat(filled) + "░".repeat(empty);
        lines.push(
          line(
            `    ${skill.name.padEnd(35)} [${bar}] ${skill.level}%`,
            "green",
          ),
        );
      });
      lines.push(line(""));
    });

    return lines;
  },
};

const experienceCommand: TerminalCommand = {
  name: "experience",
  description: "Work experience",
  execute: () => {
    const lines: TerminalLine[] = [
      line("╔══════════════════════════════════════════════════╗", "cyan"),
      line("║            PROFESSIONAL EXPERIENCE               ║", "cyan"),
      line("╚══════════════════════════════════════════════════╝", "cyan"),
      line(""),
    ];

    resumeData.experience.forEach((exp, i) => {
      lines.push(line(`  ┌─ ${exp.role}`, "green"));
      lines.push(line(`  │  ${exp.company} | ${exp.location}`, "amber"));
      lines.push(line(`  │  ${exp.startDate} – ${exp.endDate}`, "muted"));
      lines.push(line(`  │  ${exp.scope}`, "muted"));
      exp.achievements.forEach((a) => {
        lines.push(line(`  │  • ${a}`));
      });
      lines.push(line(`  │  Tech: ${exp.techStack.join(", ")}`, "cyan"));
      if (i < resumeData.experience.length - 1) {
        lines.push(line("  │"));
      } else {
        lines.push(line("  └──────────────────────────────────────"));
      }
      lines.push(line(""));
    });

    return lines;
  },
};

const projectsCommand: TerminalCommand = {
  name: "projects",
  description: "Featured projects",
  execute: () => {
    const lines: TerminalLine[] = [
      line("╔══════════════════════════════════════════════════╗", "cyan"),
      line("║              SELECTED PROJECTS                   ║", "cyan"),
      line("╚══════════════════════════════════════════════════╝", "cyan"),
      line(""),
    ];

    resumeData.projects.forEach((project) => {
      lines.push(line(`  ▸ ${project.name}`, "green"));
      lines.push(line(`    ${project.description}`));
      lines.push(
        line(
          `    Metrics: ${project.metrics.map((m) => `${m.label}: ${m.value}`).join(" | ")}`,
          "amber",
        ),
      );
      lines.push(line(`    Stack: ${project.techStack.join(", ")}`, "cyan"));
      lines.push(line(""));
    });

    return lines;
  },
};

const awardsCommand: TerminalCommand = {
  name: "awards",
  description: "Awards & recognition",
  execute: () => {
    const lines: TerminalLine[] = [
      line("╔══════════════════════════════════════════════════╗", "cyan"),
      line("║           AWARDS & RECOGNITION                   ║", "cyan"),
      line("╚══════════════════════════════════════════════════╝", "cyan"),
      line(""),
    ];

    resumeData.awards.forEach((award) => {
      lines.push(line(`  🏆 ${award.title}`, "amber"));
      lines.push(line(`     ${award.description}`));
      lines.push(line(""));
    });

    return lines;
  },
};

const educationCommand: TerminalCommand = {
  name: "education",
  description: "Education background",
  execute: () => [
    line("╔══════════════════════════════════════════════════╗", "cyan"),
    line("║                 EDUCATION                        ║", "cyan"),
    line("╚══════════════════════════════════════════════════╝", "cyan"),
    line(""),
    line(`  🎓 ${resumeData.education.degree}`, "green"),
    line(`     ${resumeData.education.university}`, "amber"),
    line(
      `     ${resumeData.education.location} | ${resumeData.education.years}`,
      "muted",
    ),
    line(""),
    line(`  Languages: ${resumeData.languages.join(", ")}`),
  ],
};

const contactCommand: TerminalCommand = {
  name: "contact",
  description: "Contact information",
  execute: () => [
    line("╔══════════════════════════════════════════════════╗", "cyan"),
    line("║               CONTACT INFO                       ║", "cyan"),
    line("╚══════════════════════════════════════════════════╝", "cyan"),
    line(""),
    line(`  ✉  Email:    ${resumeData.contact.email}`, "green"),
    line(`  📱 Phone:    ${resumeData.contact.phone}`, "green"),
    line(`  📍 Location: ${resumeData.contact.location}`),
    line(`  🔗 LinkedIn: ${resumeData.contact.linkedin}`, "cyan"),
    line(`  🐙 GitHub:   ${resumeData.contact.github}`, "cyan"),
    line(""),
    line("  Feel free to reach out!", "amber"),
  ],
};

const whoamiCommand: TerminalCommand = {
  name: "whoami",
  description: "Who are you?",
  execute: () => [
    line("visitor@mahady.dev", "green"),
    line(""),
    line(
      "You're browsing the portfolio of a Senior Flutter Engineer.",
      "muted",
    ),
    line("Type 'help' to explore. Type 'flutter' for a surprise.", "muted"),
  ],
};

const sudoCommand: TerminalCommand = {
  name: "sudo",
  description: "Try to get root access",
  execute: () => [
    line("Nice try! 🔒", "red"),
    line(""),
    line("Permission denied: This portfolio is read-only.", "amber"),
    line("But you can type 'contact' to reach the real admin.", "muted"),
  ],
};

const matrixCommand: TerminalCommand = {
  name: "matrix",
  description: "Easter egg",
  execute: () => [
    line("🟢 Wake up, Neo...", "green"),
    line(""),
    line("The Matrix has you...", "green"),
    line("Follow the white rabbit. 🐇", "green"),
    line(""),
    line("(Look at the background — the rain just got heavier)", "muted"),
  ],
};

const flutterCommand: TerminalCommand = {
  name: "flutter",
  description: "Flutter developer mode",
  execute: () => [
    line("  ╔══════════════════════════════════════════╗", "cyan"),
    line("  ║  🐦 Flutter Doctor Summary               ║", "cyan"),
    line("  ╚══════════════════════════════════════════╝", "cyan"),
    line(""),
    line("  [✓] Flutter (Channel stable, 3.x)       ", "green"),
    line("  [✓] Dart SDK (3.x)                       ", "green"),
    line("  [✓] Android Studio (Hedgehog)             ", "green"),
    line("  [✓] Xcode (15.x)                          ", "green"),
    line("  [✓] Clean Architecture                    ", "green"),
    line("  [✓] BLoC / Riverpod / GetX               ", "green"),
    line("  [✓] CI/CD (Fastlane, Codemagic)           ", "green"),
    line("  [✓] 8+ years of crafting pixel-perfect UIs", "green"),
    line(""),
    line("  • No issues found! All checks passed. ✨", "amber"),
  ],
};

export const commandRegistry: Record<string, TerminalCommand> = {
  help: helpCommand,
  about: aboutCommand,
  skills: skillsCommand,
  experience: experienceCommand,
  projects: projectsCommand,
  awards: awardsCommand,
  education: educationCommand,
  contact: contactCommand,
  whoami: whoamiCommand,
  sudo: sudoCommand,
  matrix: matrixCommand,
  flutter: flutterCommand,
};

export function executeCommand(input: string): TerminalLine[] {
  const trimmed = input.trim().toLowerCase();

  if (trimmed === "") return [];
  if (trimmed === "clear") return [];

  const [cmd, ...args] = trimmed.split(" ");
  const command = commandRegistry[cmd];

  if (command) {
    return command.execute(args);
  }

  return [
    line(`Command not found: ${cmd}`, "red"),
    line("Type 'help' to see available commands.", "muted"),
  ];
}
