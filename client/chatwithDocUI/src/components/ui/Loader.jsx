import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export function Spinner({ className }) {
  return <Loader2 className={cn("animate-spin text-[var(--color-accent-600)]", className)} />;
}

export default function Loader({ label = "Loading…", fullHeight = false }) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 text-[var(--color-ink-500)]",
        fullHeight ? "h-[60vh]" : "py-16"
      )}
    >
      <Spinner className="h-6 w-6" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function Skeleton({ className }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-[var(--color-surface-alt)]",
        className
      )}
    />
  );
}
