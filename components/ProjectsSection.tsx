"use client";

import { motion } from "motion/react";
import { PROJECTS } from "@/lib/data";
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/Reveal";

export function ProjectsSection() {
  return (
    <section
      id="my-work"
      className="relative z-10 py-20 px-4"
      aria-labelledby="work-heading"
    >
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="text-[0.65rem] tracking-[0.3em] text-crimson-lt uppercase font-semibold mb-1">03</div>
          <h2
            id="work-heading"
            className="font-display text-3xl sm:text-4xl text-ivory mb-10 relative inline-block after:block after:h-[2px] after:w-10 after:bg-crimson after:mt-2"
          >
            My Work
          </h2>
        </FadeUp>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.08}>
          {PROJECTS.map((proj) => (
            <StaggerItem key={proj.number}>
              <motion.article
                whileHover={{ y: -3, boxShadow: "0 12px 36px rgba(0,0,0,0.6)" }}
                transition={{ duration: 0.22 }}
                className="bg-surface border border-crimson/15 hover:border-crimson/50 rounded-lg p-5 flex flex-col gap-2.5 relative overflow-hidden group transition-colors duration-200 h-full"
                aria-labelledby={`proj-${proj.number}-title`}
              >
                {/* Hover gradient */}
                <div
                  className="absolute inset-0 bg-gradient-to-br from-crimson/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  aria-hidden="true"
                />

                <div className="text-[0.65rem] tracking-[0.2em] text-crimson-lt font-semibold">
                  {proj.number}
                </div>

                <h3
                  id={`proj-${proj.number}-title`}
                  className="font-display text-[1.15rem] text-ivory tracking-[0.03em]"
                >
                  {proj.title}
                </h3>

                <p className="text-[0.75rem] text-muted">{proj.year}</p>

                <p className="text-[0.86rem] text-soft leading-relaxed flex-1">
                  {proj.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.65rem] tracking-[0.06em] uppercase px-2 py-0.5 border border-crimson/20 rounded text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3 mt-1">
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.78rem] text-crimson-lt hover:text-ivory transition-colors duration-150 tracking-[0.05em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt rounded"
                    aria-label={`${proj.title} on GitHub (opens in new tab)`}
                  >
                    GitHub →
                  </a>
                  {proj.live && (
                    <a
                      href={proj.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[0.78rem] text-muted hover:text-ivory transition-colors duration-150 tracking-[0.05em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt rounded"
                      aria-label={`${proj.title} live demo (opens in new tab)`}
                    >
                      Live ↗
                    </a>
                  )}
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

