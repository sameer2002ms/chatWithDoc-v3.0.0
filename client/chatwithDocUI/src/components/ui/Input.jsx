import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils/cn";

const Input = forwardRef(function Input(
  { label, error, hint, type = "text", icon: Icon, className, id, ...props },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword && showPassword ? "text" : type;
  const inputId = id || props.name;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-ink-700)]">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-ink-400)]" />
        )}
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          className={cn(
            "h-10 w-full rounded-lg border bg-white text-sm text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-400)]",
            "transition-colors duration-150 focus:border-[var(--color-accent-500)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-100)]",
            Icon ? "pl-9 pr-3" : "px-3",
            isPassword && "pr-9",
            error ? "border-[var(--color-rose-500)]" : "border-[var(--color-border-strong)]",
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-ink-400)] hover:text-[var(--color-ink-700)]"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error ? (
        <p className="text-xs text-[var(--color-rose-600)]">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[var(--color-ink-500)]">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;
