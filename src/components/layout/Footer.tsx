"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full py-8 border-t border-terminal-green/10">
      <div className="w-full text-center space-y-2">
        <div className="text-xs text-terminal-muted font-mono">
          <span className="text-terminal-green">visitor@mahady.dev</span>
          <span className="text-terminal-muted">:</span>
          <span className="text-terminal-cyan">~/lib</span>
          <span className="text-terminal-muted">$ </span>
          <span className="text-terminal-text">
            print(&apos;Thanks for visiting!&apos;)
          </span>
        </div>
        <div className="text-xs text-terminal-muted">
          &copy; {year} MD Mahady Hasan
        </div>
        <div className="text-[10px] text-terminal-muted/50">
          Process exited with code 0.
        </div>
      </div>
    </footer>
  );
}
