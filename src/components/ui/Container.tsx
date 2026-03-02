import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "full";
}

const maxWidths = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "w-full"
};

export default function Container({
  children,
  className = "",
  maxWidth = "lg"
}: ContainerProps) {
  return (
    <div className={`mx-auto px-6 ${maxWidths[maxWidth]} ${className}`}>
      {children}
    </div>
  );
}
