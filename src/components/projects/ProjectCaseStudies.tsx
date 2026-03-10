"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { resumeData } from "@/data/resume";
import { Project } from "@/types/resume";

function ProjectCard({
  project,
  onClick,
}: {
  project: Project;
  onClick: () => void;
}) {
  return (
    <motion.div
      layoutId={`project-${project.id}`}
      onClick={onClick}
      className="neon-border rounded-lg p-5 sm:p-6 bg-terminal-bg/80 cursor-pointer hover:bg-terminal-dim/30 transition-colors group"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Project Name */}
      <motion.h3
        layoutId={`title-${project.id}`}
        className="text-lg sm:text-xl font-bold text-terminal-cyan mb-2 group-hover:text-glow-cyan transition-all"
      >
        {project.name}
      </motion.h3>

      {/* Description */}
      <p className="text-xs sm:text-sm text-terminal-text/80 mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {project.metrics.map((metric) => (
          <div
            key={metric.label}
            className="text-center p-2 rounded bg-terminal-dim/30 border border-terminal-green/10"
          >
            <div className="text-lg font-bold text-terminal-green">
              {metric.value}
            </div>
            <div className="text-[10px] text-terminal-muted">
              {metric.label}
            </div>
          </div>
        ))}
      </div>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="px-1.5 py-0.5 text-[10px] rounded bg-terminal-cyan/10 text-terminal-cyan border border-terminal-cyan/20"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Role */}
      {project.role && (
        <div className="mt-3 text-xs text-terminal-amber">
          Role: {project.role}
        </div>
      )}

      <div className="mt-3 text-xs text-terminal-muted text-center">
        Click to expand
      </div>
    </motion.div>
  );
}

function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
    >
      <motion.div
        layoutId={`project-${project.id}`}
        onClick={(e) => e.stopPropagation()}
        className="neon-border rounded-lg p-6 sm:p-8 bg-terminal-bg max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-terminal-muted hover:text-terminal-red transition-colors text-xl"
          aria-label="Close"
        >
          [x]
        </button>

        <motion.h3
          layoutId={`title-${project.id}`}
          className="text-xl sm:text-2xl font-bold text-terminal-cyan text-glow-cyan mb-4"
        >
          {project.name}
        </motion.h3>

        <p className="text-sm text-terminal-text/90 mb-6">
          {project.description}
        </p>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {project.metrics.map((metric) => (
            <div
              key={metric.label}
              className="text-center p-3 rounded neon-border"
            >
              <div className="text-xl font-bold text-terminal-green animate-neon-pulse">
                {metric.value}
              </div>
              <div className="text-xs text-terminal-muted mt-1">
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div className="mb-4">
          <h4 className="text-sm font-bold text-terminal-amber mb-2">
            Tech Stack
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-1 text-xs rounded bg-terminal-cyan/10 text-terminal-cyan border border-terminal-cyan/20"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Role */}
        {project.role && (
          <div className="text-sm text-terminal-amber">
            Role: {project.role}
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full py-2 text-sm text-terminal-green border border-terminal-green/30 rounded hover:bg-terminal-green/10 transition-colors"
        >
          [ Close ]
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectCaseStudies() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-16 sm:py-24" aria-label="Projects">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="text-terminal-muted text-xs mb-2 font-mono">
            <span className="text-terminal-green">$</span> flutter pub deps
            --style=tree
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-terminal-green text-glow-green">
            Selected Projects
          </h2>
          <div className="w-20 h-[1px] bg-terminal-green/50 mx-auto mt-3" />
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resumeData.projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.15 }}
            >
              <ProjectCard
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
