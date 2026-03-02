"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface PacksNavButtonsProps {
  sections: { key: string; title: string }[];
  activeSection: string;
}

export default function PacksNavButtons({ sections, activeSection }: PacksNavButtonsProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const index = sections.findIndex((s) => s.key === activeSection);
    if (index !== -1) {
      setCurrentIndex(index);
    }
  }, [activeSection, sections]);

  const handleClick = (sectionKey: string) => {
    router.push(`/packs?section=${sectionKey}`, { scroll: false });

    const scrollToElement = () => {
      const element =
        (sectionKey === "monthly"
          ? document.getElementById("monthly-social-packages")
          : null) ??
        document.getElementById("packs-content") ??
        document.getElementById("packs-results");
      if (element) {
        const yOffset = -64;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
        return true;
      }
      return false;
    };

    let attempts = 0;
    const interval = setInterval(() => {
      if (scrollToElement() || attempts > 20) {
        clearInterval(interval);
      }
      attempts++;
    }, 50);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
    handleClick(sections[newIndex].key);
  };

  const goToNext = () => {
    const newIndex = currentIndex === sections.length - 1 ? 0 : currentIndex + 1;
    handleClick(sections[newIndex].key);
  };

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between gap-6">
        <button
          onClick={goToPrevious}
          className="flex-shrink-0 p-3 rounded-full bg-ember/20 hover:bg-ember/40 text-ember transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          aria-label="Sección anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex-grow">
          <div className="text-center space-y-2">
            <div className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight">
              {(() => {
                const title = sections[currentIndex]?.title ?? "";
                const words = title.split(" ").filter(Boolean);
                const accent = words.pop() ?? "";
                const base = words.join(" ");
                return (
                  <>
                    {base ? <span className="text-bone">{base} </span> : null}
                    <span className="text-ember">{accent}</span>
                  </>
                );
              })()}
            </div>
            <div className="flex justify-center gap-2">
              {sections.map((section, idx) => (
                <button
                  key={section.key}
                  onClick={() => handleClick(section.key)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "bg-ember w-6"
                      : "bg-fog/40 w-1.5 hover:bg-fog/60"
                  }`}
                  aria-label={`Ir a ${section.title}`}
                />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={goToNext}
          className="flex-shrink-0 p-3 rounded-full bg-ember/20 hover:bg-ember/40 text-ember transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ember"
          aria-label="Siguiente sección"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
