"use client";

import { PROFILE } from "@/lib/data";
import { FadeUp } from "@/components/Reveal";
import { TypewriterRole } from "@/components/TypewriterRole";

export function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-20 z-10"
      aria-labelledby="hero-name"
    >
      <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
        <FadeUp delay={0.05}>
          <div className="mb-3">
            <TypewriterRole roles={PROFILE.roles} />
          </div>
        </FadeUp>

        <FadeUp delay={0.15}>
          <h1
            id="hero-name"
            className="font-display text-4xl sm:text-6xl lg:text-7xl text-ivory tracking-[0.04em] leading-[1.08] mb-4 drop-shadow-[0_2px_24px_rgba(139,0,0,0.35)]"
          >
            {PROFILE.name}
          </h1>
        </FadeUp>

        <FadeUp delay={0.25}>
          <div
            className="flex flex-wrap items-center justify-center gap-2 text-[0.8rem] tracking-[0.12em] uppercase text-soft font-normal mb-6"
            aria-label="Specialisations"
          >
            {PROFILE.tagline.map((tag, idx) => (
              <span key={tag} className="flex items-center gap-2">
                <span>{tag}</span>
                {idx < PROFILE.tagline.length - 1 && (
                  <span className="text-crimson-lt text-[0.45rem]" aria-hidden="true">
                    ●
                  </span>
                )}
              </span>
            ))}
          </div>
        </FadeUp>

        <FadeUp delay={0.35}>
          <p className="text-soft text-[0.95rem] leading-relaxed max-w-lg mb-8">
            {PROFILE.summary}
          </p>
        </FadeUp>

        <FadeUp delay={0.45}>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => scrollTo("about")}
              className="px-6 py-2.5 rounded bg-crimson hover:bg-crimson-lt text-ivory text-xs font-medium tracking-[0.12em] uppercase transition-all duration-200 shadow-md hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt"
            >
              About Me
            </button>
            <button
              onClick={() => scrollTo("my-work")}
              className="px-6 py-2.5 rounded border border-ivory/30 hover:border-ivory text-ivory text-xs font-medium tracking-[0.12em] uppercase transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt"
            >
              View My Work
            </button>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
