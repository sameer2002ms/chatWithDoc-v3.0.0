import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

const VARIANTS = {
  primary:
    "bg-[var(--color-ink-900)] text-white hover:bg-black disabled:bg-[var(--color-ink-400)]",
  accent:
    "bg-[var(--color-accent-600)] text-white hover:bg-[var(--color-accent-700)] disabled:bg-[var(--color-accent-100)] disabled:text-[var(--color-accent-500)]",
  secondary:
    "bg-white text-[var(--color-ink-900)] border border-[var(--color-border-strong)] hover:bg-[var(--color-surface)]",
  ghost:
    "bg-transparent text-[var(--color-ink-700)] hover:bg-[var(--color-surface-alt)]",
  danger:
    "bg-white text-[var(--color-rose-600)] border border-[var(--color-rose-500)]/30 hover:bg-[var(--color-rose-50)]",
};

const SIZES = {
  sm: "h-8 px-3 text-sm gap-1.5",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-11 px-5 text-[15px] gap-2",
};

const Button = forwardRef(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    isLoading = false,
    disabled = false,
    icon: Icon,
    iconRight: IconRight,
    className,
    type = "button",
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150",
        "disabled:cursor-not-allowed disabled:opacity-70",
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        Icon && <Icon className="h-4 w-4 shrink-0" />
      )}
      {children}
      {!isLoading && IconRight && <IconRight className="h-4 w-4 shrink-0" />}
    </button>
  );
});

export default Button;
