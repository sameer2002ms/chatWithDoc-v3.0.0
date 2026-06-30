import { cn } from "../../utils/cn";

const TONES = {
  success: "bg-[var(--color-emerald-50)] text-[var(--color-emerald-600)]",
  error: "bg-[var(--color-rose-50)] text-[var(--color-rose-600)]",
  warning: "bg-[var(--color-amber-50)] text-amber-700",
  neutral: "bg-[var(--color-surface-alt)] text-[var(--color-ink-700)]",
  accent: "bg-[var(--color-accent-50)] text-[var(--color-accent-700)]",
};

export default function StatusBadge({ tone = "neutral", children, dot = true, className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        TONES[tone],
        className
      )}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            tone === "success" && "bg-[var(--color-emerald-500)]",
            tone === "error" && "bg-[var(--color-rose-500)]",
            tone === "warning" && "bg-[var(--color-amber-500)]",
            tone === "neutral" && "bg-[var(--color-ink-400)]",
            tone === "accent" && "bg-[var(--color-accent-500)]"
          )}
        />
      )}
      {children}
    </span>
  );
}
