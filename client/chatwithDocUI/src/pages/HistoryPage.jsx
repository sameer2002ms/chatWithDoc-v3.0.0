import { useState } from "react";
import { History as HistoryIcon, FileText, MessagesSquare } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import { formatRelativeTime } from "../utils/format";

const TABS = [
  { key: "questions", label: "Questions" },
  { key: "documents", label: "Documents" },
];

// Mock history data — replace with chatApi.listHistory() / documentApi.listDocuments().
const MOCK_QUESTIONS = [
  { id: 1, question: "What are the key findings in the report?", askedAt: new Date(Date.now() - 25 * 60 * 1000) },
  { id: 2, question: "Summarize section 3 in two sentences.", askedAt: new Date(Date.now() - 3 * 3600 * 1000) },
  { id: 3, question: "Who are the named authors of this document?", askedAt: new Date(Date.now() - 26 * 3600 * 1000) },
];

const MOCK_DOCUMENTS = [
  { id: 1, name: "research-notes.pdf", uploadedAt: new Date(Date.now() - 2 * 3600 * 1000) },
  { id: 2, name: "product-spec.docx", uploadedAt: new Date(Date.now() - 26 * 3600 * 1000) },
];

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState("questions");

  return (
    <div>
      <PageHeader title="History" description="Your past questions and document uploads." />

      <div className="mb-4 inline-flex rounded-lg border border-[var(--color-border)] bg-white p-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-[var(--color-ink-900)] text-white"
                : "text-[var(--color-ink-500)] hover:text-[var(--color-ink-900)]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card padded={false}>
        {activeTab === "questions" ? (
          MOCK_QUESTIONS.length ? (
            <ul className="divide-y divide-[var(--color-border)]">
              {MOCK_QUESTIONS.map((q) => (
                <li key={q.id} className="flex items-center gap-3 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-alt)]">
                    <MessagesSquare className="h-[18px] w-[18px] text-[var(--color-ink-700)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-[var(--color-ink-900)]">
                      {q.question}
                    </p>
                    <p className="text-xs text-[var(--color-ink-500)]">{formatRelativeTime(q.askedAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={HistoryIcon} title="No questions yet" />
          )
        ) : MOCK_DOCUMENTS.length ? (
          <ul className="divide-y divide-[var(--color-border)]">
            {MOCK_DOCUMENTS.map((doc) => (
              <li key={doc.id} className="flex items-center gap-3 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-alt)]">
                  <FileText className="h-[18px] w-[18px] text-[var(--color-ink-700)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-ink-900)]">{doc.name}</p>
                  <p className="text-xs text-[var(--color-ink-500)]">{formatRelativeTime(doc.uploadedAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={FileText} title="No documents yet" />
        )}
      </Card>
    </div>
  );
}
