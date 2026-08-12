import { useRef } from "react";
import { ArrowUp } from "lucide-react";

export default function AskPanel({ value, onChange, onSubmit, isLoading, disabled }) {
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleChange = (e) => {
    onChange(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  };

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-white p-2 shadow-[var(--shadow-sm)]">
      <div className="flex items-end gap-2">
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? "Upload a document to start asking questions" : "Ask anything about your document…"}
          className="max-h-40 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm text-[var(--color-ink-900)] placeholder:text-[var(--color-ink-400)] focus:outline-none disabled:cursor-not-allowed"
        />
        <button
          onClick={onSubmit}
          disabled={disabled || isLoading || !value.trim()}
          className="mb-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-600)] text-white transition-colors hover:bg-[var(--color-accent-700)] disabled:cursor-not-allowed disabled:bg-[var(--color-accent-100)] disabled:text-[var(--color-accent-500)]"
          aria-label="Send question"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
