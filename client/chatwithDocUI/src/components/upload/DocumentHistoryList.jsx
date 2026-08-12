import { FileText } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import EmptyState from "../ui/EmptyState";
import { formatRelativeTime } from "../../utils/format";

const ICONS = { pdf: FileText };

export default function DocumentHistoryList({ documents = [] }) {
  if (!documents.length) {
    return (
      <EmptyState
        icon={FileText}
        title="No documents yet"
        description="Uploaded PDF documents will show up here."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {documents.map((doc) => {
        const Icon = ICONS[doc.type] || FileText;
        const tone = doc.status === "indexed" ? "success" : doc.status === "failed" ? "error" : "warning";

        return (
          <li key={doc.id} className="overflow-hidden rounded-[26px] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-xs)] transition duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-3xl bg-[var(--color-surface-alt)]">
                <Icon className="h-5 w-5 text-[var(--color-accent-600)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--color-ink-900)]">{doc.name}</p>
                <p className="mt-1 text-xs text-[var(--color-ink-500)]">
                  {formatRelativeTime(doc.uploadedAt)}{doc.size ? ` · ${doc.size}` : ""}
                </p>
              </div>
              <StatusBadge tone={tone}>{doc.status === "indexed" ? "Indexed" : doc.status === "failed" ? "Failed" : "Processing"}</StatusBadge>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
