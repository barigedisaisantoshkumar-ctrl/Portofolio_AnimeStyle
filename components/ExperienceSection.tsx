import { EXPERIENCE, ACHIEVEMENTS } from "@/lib/data";
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/Reveal";

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative z-10 py-20 px-4 bg-bg-alt/50 border-t border-b border-crimson/10"
      aria-labelledby="exp-heading"
    >
      <div className="max-w-4xl mx-auto">
        <FadeUp>
          <div className="text-[0.65rem] tracking-[0.3em] text-crimson-lt uppercase font-semibold mb-1">02</div>
          <h2
            id="exp-heading"
            className="font-display text-3xl sm:text-4xl text-ivory mb-10 relative inline-block after:block after:h-[2px] after:w-10 after:bg-crimson after:mt-2"
          >
            Experience
          </h2>
        </FadeUp>

        {/* Timeline */}
        <div className="relative pl-8 mb-12">
          {/* Timeline spine */}
          <div className="absolute left-[10px] top-2 bottom-0 w-px bg-crimson/20" aria-hidden="true" />

          {EXPERIENCE.map((exp, i) => (
            <FadeUp key={exp.company} delay={i * 0.12}>
              <article
                className="relative mb-8 last:mb-0"
                aria-label={`${exp.role} at ${exp.company}`}
              >
                {/* Dot */}
                <div className="absolute -left-8 top-[22px] w-5 h-5 rounded-full border-2 border-crimson bg-bg z-10" aria-hidden="true" />

                <div className="bg-surface border border-crimson/15 rounded-lg p-5">
                  <div className="flex flex-wrap items-baseline gap-2 mb-1">
                    <h3 className="text-ivory font-semibold text-[1rem]">{exp.role}</h3>
                    <span className="text-muted text-[0.84rem] flex items-center gap-1.5">
                      {exp.company}
                      {exp.remote && (
                        <span className="text-[0.62rem] tracking-[0.08em] uppercase bg-crimson/20 text-crimson-lt border border-crimson px-1.5 py-0.5 rounded">
                          Remote
                        </span>
                      )}
                    </span>
                  </div>
                  <p className="text-crimson-lt text-[0.78rem] tracking-[0.05em] mb-3">{exp.period}</p>
                  <ul className="space-y-1.5 mb-3">
                    {exp.bullets.map(b => (
                      <li key={b} className="text-soft text-[0.88rem] leading-relaxed pl-4 relative before:absolute before:left-0 before:content-['—'] before:text-crimson before:text-[0.72rem]">
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tags.map(t => (
                      <span key={t} className="text-[0.65rem] tracking-[0.06em] uppercase px-2 py-0.5 border border-crimson/20 rounded text-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </FadeUp>
          ))}
        </div>

        {/* Achievements */}
        <FadeUp delay={0.1}>
          <h3 className="text-[0.65rem] tracking-[0.2em] uppercase text-muted font-semibold mb-4">Achievements</h3>
        </FadeUp>
        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 gap-3" stagger={0.08}>
          {ACHIEVEMENTS.map(a => (
            <StaggerItem key={a.text}>
              <div className="flex items-start gap-3 bg-surface border border-crimson/15 rounded-lg p-4">
                <span className="text-xl flex-shrink-0" aria-hidden="true">{a.icon}</span>
                <p className="text-soft text-[0.84rem] leading-relaxed">{a.text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  );
}

