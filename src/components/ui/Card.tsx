import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "glass" | "solid" | "minimal" | "gradient";
  padding?: "sm" | "md" | "lg";
}

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8"
};

const variantClasses = {
  glass: "border border-white/15 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md hover:border-ember/50 hover:from-white/15 hover:to-white/10 hover:shadow-xl hover:shadow-ember/10 transition-all duration-500",
  solid: "border border-white/10 rounded-2xl bg-gradient-to-br from-ink/80 to-ink/60 hover:border-ember/60 hover:shadow-2xl hover:shadow-ember/20 hover:from-ink/90 hover:to-ink/70 transition-all duration-500",
  minimal: "rounded-2xl hover:bg-white/8 hover:shadow-lg transition-all duration-500",
  gradient: "border border-white/10 rounded-2xl bg-gradient-to-br from-ember/10 to-gum/10 hover:from-ember/20 hover:to-gum/20 hover:border-ember/50 hover:shadow-xl hover:shadow-ember/15 transition-all duration-500"
};

export default function Card({
  children,
  className = "",
  variant = "solid",
  padding = "md"
}: CardProps) {
  return (
    <div className={`${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
}
