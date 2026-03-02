"use client";

import { useState, useEffect, useRef } from "react";
import Container from "@/components/ui/Container";
import Section from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import PackCard from "@/components/packs/PackCard";
import PackSelector from "@/components/packs/PackSelector";
import PackConfigurator from "@/components/packs/PackConfigurator";
import MonthlySocialPackagesSection from "@/components/packs/MonthlySocialPackagesSection";

interface PacksClientWrapperProps {
  sections: Array<{
    key: string;
    title: string;
    subtitle: string;
    image: string;
    video?: string;
    tagline: string;
    empty: string;
  }>;
  packs: any[];
  activeSection: string;
  hasSelection: boolean;
}

export default function PacksClientWrapper({
  sections,
  packs,
  activeSection,
  hasSelection
}: PacksClientWrapperProps) {
  const [showContent, setShowContent] = useState(hasSelection);
  const [contentEntering, setContentEntering] = useState(hasSelection);
  const [displaySection, setDisplaySection] = useState(activeSection);
  const contentRef = useRef<HTMLDivElement>(null);

  const currentSection = sections.find((s) => s.key === displaySection) || sections[0];
  const packsForSection = packs.filter((pack) => pack.kind === displaySection);

  useEffect(() => {
    if (hasSelection) {
      const timer = setTimeout(() => {
        setContentEntering(false);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [hasSelection]);

  const handleSectionSelect = (sectionKey: string, scrollTo = true) => {
    if (!showContent) {
      setShowContent(true);
    }

    const getSectionTarget = () =>
      sectionKey === "monthly"
        ? document.getElementById("monthly-social-packages")
        : document.getElementById("packs-content") ?? document.getElementById("packs-results");

    if (sectionKey === displaySection) {
      if (scrollTo) {
        const target = getSectionTarget();
        if (target) {
          const yOffset = -64;
          const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
      return;
    }

    setDisplaySection(sectionKey);
    setContentEntering(true);

    setTimeout(() => {
      setContentEntering(false);
      if (scrollTo) {
        const target = getSectionTarget();
        if (target) {
          const yOffset = -64;
          const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    }, 400);
  };

  /* Auto-scroll useEffect for monthly removed — it was firing on every
     displaySection/showContent change and causing unexpected page jumps.
     The handleSectionSelect callback already scrolls to the correct target. */

  return (
    <div className="relative">
      <Section spacing="md" className="pt-10 md:pt-14 pb-14 md:pb-20">
        <Container maxWidth="xl">
          <PackSelector
            packs={sections.map((section) => ({
              id: section.key,
              key: section.key,
              title: section.title,
              imageSrc: section.image,
              videoSrc: section.video,
              alt: section.title,
              tagline: section.tagline
            }))}
            initialKey={displaySection}
            onSectionSelect={handleSectionSelect}
          />
        </Container>
      </Section>

      {showContent && (
        <div
          id="packs-content"
          ref={contentRef}
          className={`scroll-mt-20 transition-all duration-700 ease-out ${
            contentEntering
              ? "opacity-0 translate-y-[40px]"
              : "opacity-100 translate-y-0"
          }`}
        >
          {displaySection === "alacarte" ? (
            <section id="paquete-a-la-carta" className="py-16 md:py-24 scroll-mt-20">
              <Container maxWidth="xl">
                <PackConfigurator />
              </Container>
            </section>
          ) : displaySection === "monthly" ? (
            <MonthlySocialPackagesSection />
          ) : (
            <>
              <section id="packs-results" className="py-16 md:py-24 scroll-mt-20">
                <Container maxWidth="xl">
                  {packsForSection.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-fog">{currentSection.empty}</p>
                      <LinkButton href="/contact" variant="primary" className="mt-6">
                        Consulta sobre paquetes personalizados
                      </LinkButton>
                    </div>
                  ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {packsForSection.map((pack, index) => (
                        <div
                          key={pack.id}
                          className="animate-fade-in-up"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <PackCard pack={pack} priority={index < 3} />
                        </div>
                      ))}
                    </div>
                  )}
                </Container>
              </section>

              <section className="py-16 md:py-24">
                <Container maxWidth="lg">
                  <div className="text-center space-y-8">
                    <div className="space-y-4">
                      <h2 className="text-4xl md:text-5xl font-display font-bold text-bone">
                        ¿Necesitas un paquete personalizado?
                      </h2>
                      <p className="text-lg text-fog max-w-2xl mx-auto">
                        Creamos sistemas de producción a medida para tu flujo de trabajo específico.
                      </p>
                    </div>
                    <LinkButton href="/contact" variant="primary" size="lg">
                      Solicitar paquete personalizado
                    </LinkButton>
                  </div>
                </Container>
              </section>
            </>
          )}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          opacity: 0;
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
