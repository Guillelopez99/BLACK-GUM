"use client";

import { useRef, useEffect, useState } from "react";

interface ProcessStep {
  title: string;
  description: string;
  imageBase: string;
}

const imageWidths = [480, 768, 1024, 1280, 1600] as const;
const imageSizes =
  "(min-width: 1280px) 411px, (min-width: 1024px) calc((100vw - 96px) / 3), (min-width: 768px) calc((100vw - 72px) / 2), calc(100vw - 48px)";
const buildSrcSet = (base: string, ext: "jpg" | "webp" | "avif") =>
  imageWidths
    .map((width) => `/images/productions/${base}-w${width}.${ext} ${width}w`)
    .join(", ");

const processSteps: ProcessStep[] = [
  {
    title: "Preproducción estratégica",
    description:
      "Desarrollo de conceptos, guiones gráficos y diseño de producción liderado por perfiles senior.",
    imageBase: "preproduccion-estrategica"
  },
  {
    title: "Producción cinematográfica",
    description:
      "Equipos expertos, paquetes flexibles y disciplina en set para capturar momentos que importan.",
    imageBase: "produccion-cinematografica"
  },
  {
    title: "Pulido de postproducción",
    description:
      "Edición, corrección de color, diseño de sonido y entrega final con atención obsesiva al detalle.",
    imageBase: "pulido-de-postproduccion"
  },
  {
    title: "Asociaciones de retención",
    description:
      "Sistemas de producción mensual para marcas que necesitan ritmo de contenido siempre activo.",
    imageBase: "asociaciones-de-retencion"
  }
];

export default function ProcessScroll() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="relative">
      <div
        ref={scrollContainerRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollBehavior: "smooth" }}
      >
        {processSteps.map((step, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start"
          >
            <div className="space-y-6 h-full">
              <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10">
                <picture className="absolute inset-0 h-full w-full">
                  <source
                    type="image/avif"
                    srcSet={buildSrcSet(step.imageBase, "avif")}
                    sizes={imageSizes}
                  />
                  <source
                    type="image/webp"
                    srcSet={buildSrcSet(step.imageBase, "webp")}
                    sizes={imageSizes}
                  />
                  <img
                    src={`/images/productions/${step.imageBase}-w1024.jpg`}
                    srcSet={buildSrcSet(step.imageBase, "jpg")}
                    sizes={imageSizes}
                    alt={step.title}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              </div>
              <div className="space-y-3 px-1">
                <h3 className="font-display text-2xl font-bold text-bone">
                  {step.title}
                </h3>
                <p className="text-fog text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 z-10 w-10 h-10 rounded-full bg-ember/80 hover:bg-ember flex items-center justify-center transition-all"
          aria-label="Desplazar a la izquierda"
        >
          ←
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 z-10 w-10 h-10 rounded-full bg-ember/80 hover:bg-ember flex items-center justify-center transition-all"
          aria-label="Desplazar a la derecha"
        >
          →
        </button>
      )}
    </div>
  );
}
