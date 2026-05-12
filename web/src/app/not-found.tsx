import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 48,
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 520 }}>
        <div
          style={{
            fontFamily: "var(--font-jb-mono), ui-monospace, monospace",
            color: "var(--mint)",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          404 · Not here
        </div>
        <h1
          style={{
            fontFamily: "var(--font-newsreader), serif",
            fontSize: "clamp(48px, 7vw, 96px)",
            lineHeight: 0.95,
            letterSpacing: "-0.03em",
            marginBottom: 18,
          }}
        >
          Wrong <i style={{ color: "var(--mint)" }}>turn.</i>
        </h1>
        <p
          style={{
            color: "var(--dim)",
            fontSize: 16,
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          The page you&apos;re after isn&apos;t built yet. Head back to the index.
        </p>
        <Link
          href="/"
          data-cursor="hover"
          style={{
            display: "inline-block",
            padding: "12px 22px",
            background: "var(--mint)",
            color: "#001a13",
            fontFamily: "var(--font-jb-mono), ui-monospace, monospace",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.06em",
            borderRadius: 10,
          }}
        >
          ← BACK TO INDEX
        </Link>
      </div>
    </main>
  );
}
