import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { BootProvider } from "@/providers/BootProvider";
import { SoundProvider } from "@/providers/SoundProvider";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MD Mahady Hasan | Senior Flutter Engineer | 8+ Years",
  description:
    "Senior Mobile Engineer (Flutter) with 8+ years building cross-platform applications for 1M+ users. Expert in Clean Architecture, BLoC, CI/CD, and AWS.",
  keywords: [
    "Flutter Developer",
    "Senior Mobile Engineer",
    "Mobile Architect",
    "Dart",
    "Clean Architecture",
    "BLoC",
    "Cross-Platform",
    "Dhaka",
    "Bangladesh",
  ],
  authors: [{ name: "MD Mahady Hasan" }],
  openGraph: {
    title: "MD Mahady Hasan | Senior Flutter Engineer",
    description:
      "Senior Mobile Engineer with 8+ years building cross-platform applications for 1M+ users.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "MD Mahady Hasan | Senior Flutter Engineer",
    description:
      "Senior Mobile Engineer with 8+ years building cross-platform applications for 1M+ users.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={jetbrainsMono.variable}>
      <body className="font-mono antialiased">
        <BootProvider>
          <SoundProvider>
            {children}
            <div className="crt-overlay" aria-hidden="true" />
          </SoundProvider>
        </BootProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
