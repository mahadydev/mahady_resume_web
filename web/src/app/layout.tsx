import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Newsreader, Manrope, JetBrains_Mono } from "next/font/google";
import { SkipLink } from "@/components/skip-link";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-manrope",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jb-mono",
  display: "swap",
});

const FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%2300e5a0'/%3E%3Ctext x='16' y='22' font-family='ui-monospace,monospace' font-size='17' font-weight='700' text-anchor='middle' fill='%23001a13'%3EMH%3C/text%3E%3C/svg%3E";

export const metadata: Metadata = {
  title: "MD Mahady Hasan — Resume · Three Directions",
  description:
    "Senior Flutter engineer · 8+ years · 1M+ users shipped. Three takes on the same résumé.",
  openGraph: {
    title: "MD Mahady Hasan — Resume",
    description:
      "Three interactive takes on a résumé: a phone, a terminal, an editorial.",
    type: "website",
  },
  icons: {
    icon: FAVICON,
  },
};

export const viewport: Viewport = {
  themeColor: "#06070a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${newsreader.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
