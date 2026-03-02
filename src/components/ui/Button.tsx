import Link from "next/link";
import { MouseEventHandler, ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

interface LinkButtonProps extends ButtonProps {
  href: string;
}

const buttonVariants = {
  primary:
    "bg-gradient-to-r from-ember to-gum text-ink hover:shadow-lg hover:shadow-ember/40 hover:from-ember hover:to-gum active:scale-95 font-bold",
  secondary:
    "border-2 border-bone/50 text-bone hover:border-bone hover:bg-bone/5 active:scale-95 font-semibold",
  ghost:
    "text-fog hover:text-bone hover:bg-white/5 border border-transparent hover:border-ember/30 transition-colors"
};

const buttonSizes = {
  sm: "px-4 py-2 text-xs uppercase tracking-[0.15em]",
  md: "px-6 py-3 text-sm uppercase tracking-[0.2em]",
  lg: "px-8 py-4 text-base uppercase tracking-[0.2em]"
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  type = "button",
  onClick
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        rounded-full font-body font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${buttonVariants[variant]}
        ${buttonSizes[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  size = "md",
  className = ""
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`
        inline-flex items-center justify-center rounded-full font-body font-medium transition-all duration-200
        ${buttonVariants[variant]}
        ${buttonSizes[size]}
        ${className}
      `}
    >
      {children}
    </Link>
  );
}
