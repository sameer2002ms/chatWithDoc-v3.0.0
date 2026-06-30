import { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

export default function Modal({ open, onClose, title, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const sizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/30 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full rounded-xl border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-lg)] animate-fade-in",
          sizes[size]
        )}
      >
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-base font-semibold text-[var(--color-ink-900)]">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-[var(--color-ink-400)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-ink-700)]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="text-sm text-[var(--color-ink-700)]">{children}</div>
        {footer && <div className="mt-6 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}
