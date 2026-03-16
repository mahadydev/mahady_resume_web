export interface TerminalLine {
  id: string;
  type: "input" | "output" | "error" | "system" | "ascii";
  content: string;
  color?: "green" | "cyan" | "amber" | "red" | "purple" | "muted" | "white";
  delay?: number;
  href?: string;
}

export interface TerminalCommand {
  name: string;
  description: string;
  execute: (args?: string[]) => TerminalLine[];
}

export interface TerminalState {
  history: TerminalLine[];
  commandHistory: string[];
  historyIndex: number;
  isProcessing: boolean;
}
