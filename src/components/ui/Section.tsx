import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  variant?: "default" | "dark" | "light" | "gradient" | "gradient_warm";
  spacing?: "sm" | "md" | "lg";
}

const spacingClasses = {
  sm: "py-12",
  md: "py-16 md:py-20",
  lg: "py-20 md:py-32"
};

const variantClasses = {
  default: "section-theme section-theme-default",
  dark: "section-theme section-theme-dark",
  light: "section-theme section-theme-light",
  gradient: "section-theme section-theme-gradient",
  gradient_warm: "section-theme section-theme-gradient-warm"
};

export default function Section({
  children,
  id,
  className = "",
  variant = "default",
  spacing = "md"
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${spacingClasses[spacing]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </section>
  );
}
