import { PROFILE, EDUCATION, SKILLS } from "@/lib/data";
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

        {/* Education */}
        <FadeUp delay={0.15}>
          <div className="flex items-start gap-4 bg-surface border border-l-[3px] border-crimson/15 border-l-crimson rounded-lg px-5 py-4">
            <span className="text-2xl flex-shrink-0 mt-0.5" aria-hidden="true">🎓</span>
            <div>
              <h3 className="text-ivory font-semibold text-[1rem]">{EDUCATION.degree}</h3>
              <p className="text-soft text-[0.88rem] mt-0.5">{EDUCATION.institute}</p>
              <p className="text-muted text-[0.78rem] mt-1">
                {EDUCATION.period} &nbsp;·&nbsp; CGPA: {EDUCATION.cgpa}
              </p>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

