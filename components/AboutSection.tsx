import { PROFILE, EDUCATION_LIST, SKILLS } from "@/lib/data";
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/Reveal";

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative z-10 py-20 px-4"
      aria-labelledby="about-heading"
    >
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="text-[0.65rem] tracking-[0.3em] text-crimson-lt uppercase font-semibold mb-1">01</div>
          <h2
            id="about-heading"
            className="font-display text-3xl sm:text-4xl text-ivory mb-10 relative inline-block after:block after:h-[2px] after:w-10 after:bg-crimson after:mt-2"
          >
            About Me
          </h2>
        </FadeUp>

        {/* Bio + Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <FadeUp delay={0.1}>
            <div className="space-y-4 text-soft text-[0.95rem] leading-relaxed">
              <p>
                I&apos;m a Computer Science Engineering student specialising in Cyber Security
                (batch of 2027) at MVGR College of Engineering, Vizianagaram. I work across the
                full software development lifecycle — building, testing, debugging, and maintaining
                full-stack web applications, ServiceNow scoped apps, and API security testing tools.
              </p>
              <p>
                My experience spans an SDE internship, freelance web development and testing, and
                several personal and academic projects. I hold CCNA and ServiceNow (CSA + CSD)
                certifications and was shortlisted in the top 50 teams at the KPMG Hackathon across India.
              </p>
            </div>
          </FadeUp>

          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 gap-3" stagger={0.07}>
            {SKILLS.map(s => (
              <StaggerItem key={s.group}>
                <div className="bg-surface border border-crimson/15 rounded-lg p-4">
                  <h3 className="text-[0.68rem] tracking-[0.15em] uppercase text-crimson-lt font-semibold mb-2">
                    {s.group}
                  </h3>
                  <ul className="list-none space-y-0.5">
                    {s.items.map(item => (
                      <li key={item} className="text-[0.82rem] text-soft">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>

        {/* Education & Schooling Timeline */}
        <FadeUp delay={0.15}>
          <div className="space-y-3.5">
            <h3 className="text-[0.68rem] tracking-[0.2em] uppercase text-crimson-lt font-semibold mb-2">
              Education & Academic Background
            </h3>
            <div className="grid grid-cols-1 gap-3.5">
              {EDUCATION_LIST.map((edu, idx) => (
                <div
                  key={edu.degree}
                  className="flex items-start gap-4 bg-surface border border-l-[3px] border-crimson/15 border-l-crimson rounded-lg px-5 py-4 transition-all duration-200 hover:border-crimson/30 hover:bg-surface-2"
                >
                  <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">
                    {edu.icon || "🎓"}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="text-ivory font-semibold text-[0.98rem] tracking-wide">
                        {edu.degree}
                      </h4>
                      <span className="text-[0.72rem] font-mono text-muted tracking-wider px-2 py-0.5 rounded bg-white/5 border border-white/5">
                        {edu.period}
                      </span>
                    </div>
                    <p className="text-crimson-lt font-medium text-[0.85rem] mt-0.5">
                      {edu.institute}
                    </p>
                    {edu.score && (
                      <p className="text-muted text-[0.78rem] mt-1 font-mono">
                        {edu.score}
                      </p>
                    )}
                    {edu.description && (
                      <p className="text-soft text-[0.82rem] mt-1.5 leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

