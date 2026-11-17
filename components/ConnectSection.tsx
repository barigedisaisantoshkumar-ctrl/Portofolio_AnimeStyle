import { PROFILE } from "@/lib/data";
import { FadeUp } from "@/components/Reveal";

export function ConnectSection() {
  return (
    <section
      id="connect"
      className="relative z-10 py-24 px-4 pb-32"
      aria-labelledby="connect-heading"
    >
      <div className="max-w-3xl mx-auto text-center">
        <FadeUp>
          <div className="text-[0.65rem] tracking-[0.3em] text-crimson-lt uppercase font-semibold mb-1">
            05
          </div>
          <h2
            id="connect-heading"
            className="font-display text-3xl sm:text-4xl text-ivory mb-6 relative inline-block after:block after:h-[2px] after:w-10 after:bg-crimson after:mt-2 after:mx-auto"
          >
            Connect
          </h2>
          <p className="text-soft text-base leading-relaxed max-w-md mx-auto mb-10">
            Open to internships, junior software engineering roles, and project collaborations.
            Let&apos;s build something exceptional.
          </p>
        </FadeUp>

        <FadeUp delay={0.15}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${PROFILE.email}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded bg-crimson hover:bg-crimson-lt text-ivory text-xs font-medium tracking-[0.1em] uppercase transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt"
              aria-label="Send email to Santosh Barigedi"
            >
              <span aria-hidden="true">✉</span>
              Email Me
            </a>

            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded bg-surface border border-crimson/30 hover:border-crimson hover:bg-surface-2 text-ivory text-xs font-medium tracking-[0.1em] uppercase transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt"
              aria-label="LinkedIn Profile (opens in a new tab)"
            >
              <span aria-hidden="true" className="font-bold text-crimson-lt">in</span>
              LinkedIn
            </a>

            <a
              href={PROFILE.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded bg-surface border border-crimson/30 hover:border-crimson hover:bg-surface-2 text-ivory text-xs font-medium tracking-[0.1em] uppercase transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt"
              aria-label="GitHub Profile (opens in a new tab)"
            >
              <span aria-hidden="true">⌥</span>
              GitHub
            </a>

            <a
              href={PROFILE.liveSite}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded border border-ivory/20 hover:border-ivory text-soft hover:text-ivory text-xs font-medium tracking-[0.1em] uppercase transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt"
              aria-label="Current Live Portfolio (opens in a new tab)"
            >
              <span aria-hidden="true">🌐</span>
              Live Portfolio
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
