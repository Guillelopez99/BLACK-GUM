import { ReactNode } from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  center?: boolean;
}

export default function SectionTitle({
  title,
  subtitle,
  action,
  center = false
}: SectionTitleProps) {
  return (
    <div
      className={`${
        center ? "text-center" : "flex flex-wrap items-end justify-between gap-6"
      } mb-12`}
    >
      <div className={center ? "mx-auto" : ""}>
        <p className="text-xs uppercase tracking-[0.3em] text-ember font-semibold">
          Studio
        </p>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mt-3 leading-tight text-bone drop-shadow-lg">
          {title}
        </h2>
        {subtitle && (
          <p className={`text-fog mt-5 max-w-2xl text-base leading-relaxed font-light ${center ? 'mx-auto' : ''}`}>
            {subtitle}
          </p>
        )}
      </div>
      {action && !center && <div>{action}</div>}
    </div>
  );
}
