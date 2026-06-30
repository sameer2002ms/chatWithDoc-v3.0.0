import { FileText, FileType, Globe, Link2 } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";
import EmptyState from "../ui/EmptyState";
import { formatRelativeTime } from "../../utils/format";

const ICONS = { pdf: FileText, docx: FileType, doc: FileType, html: Globe, url: Link2 };

export default function DocumentHistoryList({ documents = [] }) {
  if (!documents.length) {
    return (
      <EmptyState
        icon={FileText}
        title="No documents yet"
        description="Documents you upload or index from a URL will show up here."
      />
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] bg-white">
      {documents.map((doc) => {
        const Icon = ICONS[doc.type] || FileText;
        return (
          <li key={doc.id} className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-alt)]">
              <Icon className="h-[18px] w-[18px] text-[var(--color-ink-700)]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--color-ink-900)]">{doc.name}</p>
              <p className="text-xs text-[var(--color-ink-500)]">
                {formatRelativeTime(doc.uploadedAt)}
                {doc.size ? ` · ${doc.size}` : ""}
              </p>
            </div>
            <StatusBadge tone={doc.status === "indexed" ? "success" : doc.status === "failed" ? "error" : "warning"}>
              {doc.status === "indexed" ? "Indexed" : doc.status === "failed" ? "Failed" : "Processing"}
            </StatusBadge>
          </li>
        );
      })}
    </ul>
  );
}
