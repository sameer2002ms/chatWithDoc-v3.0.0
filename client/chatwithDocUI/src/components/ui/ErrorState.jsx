import { AlertTriangle } from "lucide-react";
import Button from "./Button";

export default function ErrorState({
  title = "Something went wrong",
  description = "We couldn't complete that request. Please try again.",
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--color-rose-500)]/20 bg-[var(--color-rose-50)] px-6 py-12 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[var(--shadow-xs)]">
        <AlertTriangle className="h-5 w-5 text-[var(--color-rose-600)]" />
      </div>
      <p className="text-sm font-medium text-[var(--color-ink-900)]">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-[var(--color-ink-500)]">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
