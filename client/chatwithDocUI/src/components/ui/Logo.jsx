import { cn } from "../../utils/cn";

export default function Logo({ size = "md", withWordmark = true, className }) {
  const dims = { sm: "h-6 w-6", md: "h-8 w-8", lg: "h-10 w-10" };
  const text = { sm: "text-sm", md: "text-[15px]", lg: "text-lg" };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-lg bg-[var(--color-ink-900)]",
          dims[size]
        )}
      >
        <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" fill="none">
          <path
            d="M6 3.5h8.5L19 8v12.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z"
            stroke="white"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M14.5 3.5V8H19" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
          <path
            d="M9 13.2c1.1-1 2.9-1 4 0M8.3 15.8c1.9-1.6 5.5-1.6 7.4 0"
            stroke="var(--color-accent-500)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      {withWordmark && (
        <span className={cn("font-semibold tracking-tight text-[var(--color-ink-900)]", text[size])}>
          ChatWithDoc
        </span>
      )}
    </div>
  );
}
