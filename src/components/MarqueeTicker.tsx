"use client";

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";

type MarqueeTickerProps = {
  ariaLabel?: string;
  items: string[];
  speedSeconds?: number;
};

function Sequence({ items }: { items: string[] }) {
  return (
    <div className="marquee__content">
      {items.map((item) => (
        <span key={item} className="marquee__item">
          <span>{item}</span>
          <span className="marquee__sep" aria-hidden="true">
            //
          </span>
          <span className="marquee__dot" aria-hidden="true">
            •
          </span>
        </span>
      ))}
    </div>
  );
}

export default function MarqueeTicker({
  ariaLabel = "Tecnologías y servicios Black Gum",
  items,
  speedSeconds = 46
}: MarqueeTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [repeatCount, setRepeatCount] = useState(2);

  const safeItems = useMemo(
    () => (items.length > 0 ? items : ["MOTION DESIGN", "VIDEO EDITING", "COLOR GRADING"]),
    [items]
  );

  useEffect(() => {
    const updateRepeatCount = () => {
      const container = containerRef.current;
      const measure = measureRef.current;
      if (!container || !measure) return;

      const containerWidth = container.getBoundingClientRect().width;
      const baseWidth = measure.getBoundingClientRect().width;
      if (!containerWidth || !baseWidth) return;

      const nextRepeatCount = Math.max(1, Math.ceil((containerWidth * 2.5) / baseWidth));
      setRepeatCount(nextRepeatCount);
    };

    updateRepeatCount();

    const resizeObserver = new ResizeObserver(updateRepeatCount);
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    if (measureRef.current) resizeObserver.observe(measureRef.current);

    window.addEventListener("resize", updateRepeatCount);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateRepeatCount);
    };
  }, [safeItems]);

  const repeatedContent = Array.from({ length: repeatCount }, (_, index) => (
    <Sequence key={index} items={safeItems} />
  ));

  const style = { "--marquee-duration": `${speedSeconds}s` } as CSSProperties;

  return (
    <section className="marquee" aria-label={ariaLabel}>
      <div ref={containerRef} className="marquee__viewport">
        <div ref={measureRef} className="marquee__measure" aria-hidden="true">
          <Sequence items={safeItems} />
        </div>

        <div className="marquee__track" style={style}>
          <div className="marquee__strip">{repeatedContent}</div>
          <div className="marquee__strip" aria-hidden="true">
            {repeatedContent}
          </div>
        </div>
      </div>
    </section>
  );
}
