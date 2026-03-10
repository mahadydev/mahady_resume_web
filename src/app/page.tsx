"use client";

import dynamic from "next/dynamic";
import { useBoot } from "@/providers/BootProvider";
import BootSequence from "@/components/boot/BootSequence";
import HeroSection from "@/components/hero/HeroSection";
import CareerTimeline from "@/components/timeline/CareerTimeline";
import SkillsSection from "@/components/skills/SkillsSection";
import ProjectCaseStudies from "@/components/projects/ProjectCaseStudies";
import AwardsSection from "@/components/awards/AwardsSection";
import ContactSection from "@/components/contact/ContactSection";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/ui/ScrollProgress";

const CursorTrail = dynamic(() => import("@/components/effects/CursorTrail"), {
  ssr: false,
});

export default function Home() {
  const { isBootComplete } = useBoot();

  return (
    <>
      {/* Boot Sequence Overlay */}
      <BootSequence />

      {/* Cursor Trail */}
      <CursorTrail />

      {/* Scroll Progress Bar */}
      {isBootComplete && <ScrollProgress />}

      {/* Header */}
      {isBootComplete && <Header />}

      {/* Main Content */}
      <main className="w-full flex flex-col items-center">
        <HeroSection />
        {isBootComplete && (
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <CareerTimeline />
            <SkillsSection />
            <ProjectCaseStudies />
            <AwardsSection />
            <ContactSection />
          </div>
        )}
      </main>

      {/* Footer */}
      {isBootComplete && <Footer />}
    </>
  );
}
