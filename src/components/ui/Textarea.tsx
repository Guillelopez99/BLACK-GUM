import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({
  label,
  error,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <label className="block">
      {label && (
        <span className="block text-sm text-fog mb-2 uppercase tracking-[0.05em]">
          {label}
        </span>
      )}
      <textarea
        className={`
          w-full px-4 py-3 rounded-xl
          border border-white/10 bg-white/5 text-bone
          placeholder:text-fog/60 placeholder:text-sm
          focus:outline-none focus:border-ember/60 focus:ring-1 focus:ring-ember/40 focus:bg-white/10
          transition-all duration-200 resize-none
          ${error ? "border-gum/60 focus:border-gum/80" : ""}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-gum text-xs mt-1">{error}</p>}
    </label>
  );
}
