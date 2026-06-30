import { useState } from "react";
import { Copy, Check, RotateCcw, FileText, User } from "lucide-react";
import toast from "react-hot-toast";
import Logo from "../ui/Logo";
import { formatTimestamp } from "../../utils/format";

export default function ConversationCard({ question, answer, timestamp, sources = [], isStreaming = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer || "");
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Question */}
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-ink-900)] text-white">
          <User className="h-4 w-4" />
        </div>
        <div className="flex-1 rounded-xl rounded-tl-sm bg-[var(--color-surface-alt)] px-4 py-3">
          <p className="text-sm text-[var(--color-ink-900)]">{question}</p>
        </div>
      </div>

      {/* Answer */}
      <div className="flex items-start gap-3">
        <div className="shrink-0">
          <Logo size="sm" withWordmark={false} />
        </div>
        <div className="flex-1 rounded-xl rounded-tl-sm border border-[var(--color-border)] bg-white px-4 py-3">
          {isStreaming ? (
            <div className="dot-bounce flex items-center gap-1 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-ink-400)]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-ink-400)]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-ink-400)]" />
            </div>
          ) : (
            <>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-ink-900)]">
                {answer}
              </p>

              {sources.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {sources.map((source, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1 text-xs text-[var(--color-ink-500)]"
                    >
                      <FileText className="h-3 w-3" />
                      {source}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-2.5">
                <span className="text-xs text-[var(--color-ink-400)]">{formatTimestamp(timestamp)}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[var(--color-ink-500)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-ink-900)]"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    disabled
                    title="Coming soon"
                    className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-[var(--color-ink-400)] opacity-60"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Regenerate
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
