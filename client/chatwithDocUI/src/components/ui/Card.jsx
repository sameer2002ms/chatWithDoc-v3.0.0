import { cn } from "../../utils/cn";

export default function Card({ children, className, padded = true, hoverable = false, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--color-border)] bg-white shadow-[var(--shadow-xs)]",
        padded && "p-5",
        hoverable && "transition-shadow duration-150 hover:shadow-[var(--shadow-sm)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
