"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { CERTIFICATES, CERT_CATEGORIES, type CertCategory } from "@/lib/data";
import { FadeUp, StaggerGrid, StaggerItem } from "@/components/Reveal";
import { CertModal } from "@/components/CertModal";

export function CertificatesSection() {
  const [filter, setFilter] = useState<CertCategory | "all">("all");
  const [modal, setModal] = useState<{ file: string; name: string } | null>(null);

  const filtered =
    filter === "all"
      ? CERTIFICATES
      : CERTIFICATES.filter(c => c.category === filter);

  return (
    <section
      id="certificates"
      className="relative z-10 py-20 px-4 bg-bg-alt/50 border-t border-b border-crimson/10"
      aria-labelledby="cert-heading"
    >
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <div className="text-[0.65rem] tracking-[0.3em] text-crimson-lt uppercase font-semibold mb-1">04</div>
          <h2 id="cert-heading" className="font-display text-3xl sm:text-4xl text-ivory mb-8 relative inline-block after:block after:h-[2px] after:w-10 after:bg-crimson after:mt-2">
            Certificates
          </h2>
          <p className="text-soft text-sm mb-6">Click any card to preview it. Use the ↗ button to open in a new tab.</p>
        </FadeUp>

        {/* Filter buttons */}
        <FadeUp delay={0.05} className="flex flex-wrap gap-2 mb-8">
          {CERT_CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className={`text-[0.72rem] tracking-[0.1em] uppercase px-4 py-1.5 rounded border transition-colors duration-200 font-sans focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt ${
                filter === cat.key
                  ? "bg-crimson border-crimson text-ivory"
                  : "bg-transparent border-crimson/20 text-muted hover:border-crimson hover:text-ivory"
              }`}
              aria-pressed={filter === cat.key}
            >
              {cat.label}
            </button>
          ))}
        </FadeUp>

        {/* Grid */}
        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" stagger={0.06}>
          {filtered.map(cert => (
            <StaggerItem key={cert.file}>
              <motion.button
                whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={() => setModal({ file: cert.file, name: cert.name })}
                className="w-full text-left bg-surface border border-crimson/15 hover:border-crimson/50 rounded-lg p-4 cursor-pointer group transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-crimson-lt relative overflow-hidden"
                aria-label={`Preview certificate: ${cert.name} from ${cert.issuer}`}
              >
                {/* Arrow indicator */}
                <span className="absolute top-3 right-3 text-muted group-hover:text-crimson-lt text-xs transition-colors duration-200" aria-hidden="true">↗</span>

                <div className="text-[0.65rem] tracking-[0.12em] uppercase text-crimson-lt font-semibold mb-1 pr-6">
                  {cert.issuer}
                </div>
                <div className="text-[0.9rem] text-ivory font-medium leading-snug mb-2 pr-4">
                  {cert.name}
                </div>
                <div className="text-[0.65rem] tracking-[0.08em] uppercase text-muted">
                  {CERT_CATEGORIES.find(c => c.key === cert.category)?.label ?? cert.category}
                </div>
              </motion.button>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>

      {/* Modal */}
      <CertModal
        file={modal?.file ?? null}
        name={modal?.name ?? ""}
        onClose={() => setModal(null)}
      />
    </section>
  );
}

