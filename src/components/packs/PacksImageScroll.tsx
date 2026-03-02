"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface PacksImageScrollProps {
  sections: { key: string; title: string; image: string }[];
  activeSection: string;
}

export default function PacksImageScroll({
  sections,
  activeSection
}: PacksImageScrollProps) {
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const buildStamp = useMemo(() => {
    if (process.env.NODE_ENV === "development") {
      return String(Date.now());
    }
    return process.env.NEXT_PUBLIC_BUILD_TIME ?? "prod";
  }, []);

  const withCacheBuster = (src: string) =>
    `${src}${src.includes("?") ? "&" : "?"}v=${buildStamp}`;

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  useEffect(() => {
    const activeEl = scrollContainerRef.current?.querySelector(
      `[data-section='${activeSection}']`
    ) as HTMLElement | null;
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeSection]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 420;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

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

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
        style={{ scrollBehavior: "smooth" }}
      >
        {sections.map((section, idx) => {
          const isActive = section.key === activeSection;
          return (
            <div
              key={section.key}
              className="flex-shrink-0 w-[85%] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start"
            >
              <button
                type="button"
                data-section={section.key}
                onClick={() => handleClick(section.key)}
                className={`group relative w-full text-left rounded-2xl border transition-all duration-300 ${
                  isActive ? "border-ember/80 ring-2 ring-ember/40" : "border-white/10"
                }`}
                aria-label={`Ir a ${section.title}`}
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-2xl">
                  <Image
                    src={withCacheBuster(section.image)}
                    alt={section.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    priority={idx === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 z-10 w-10 h-10 rounded-full bg-ember/80 hover:bg-ember text-ink flex items-center justify-center transition-all"
          aria-label="Desplazar a la izquierda"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 z-10 w-10 h-10 rounded-full bg-ember/80 hover:bg-ember text-ink flex items-center justify-center transition-all"
          aria-label="Desplazar a la derecha"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
