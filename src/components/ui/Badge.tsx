import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning";
  className?: string;
}

const variantClasses = {
  primary: "bg-ember/20 text-ember border border-ember/30",
  secondary: "bg-bone/10 text-bone border border-bone/20",
  success: "bg-moss/30 text-bone border border-moss/50",
  warning: "bg-gum/20 text-gum border border-gum/30"
};

export default function Badge({
  children,
  variant = "primary",
  className = ""
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 text-xs uppercase tracking-[0.1em]
        rounded-full font-medium
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
