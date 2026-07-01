import { useState } from "react";
import { FileText } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import StatusBadge from "../components/ui/StatusBadge";
import UploadPanel from "../components/upload/UploadPanel";
import DocumentHistoryList from "../components/upload/DocumentHistoryList";
import { formatRelativeTime } from "../utils/format";

// Mock document history — replace with documentApi.listDocuments() once the
// backend endpoint is available in this environment.
const MOCK_DOCUMENTS = [
  { id: 1, name: "research-notes.pdf", type: "pdf", status: "indexed", uploadedAt: new Date(Date.now() - 2 * 3600 * 1000), size: "1.2 MB" },
  { id: 2, name: "product-spec.pdf", type: "pdf", status: "indexed", uploadedAt: new Date(Date.now() - 26 * 3600 * 1000), size: "480 KB" },
  { id: 3, name: "release-notes.pdf", type: "pdf", status: "indexed", uploadedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000), size: "64 KB" },
];

export default function Upload() {
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const currentDocument = documents[0];

  const handleUploaded = (data) => {
    setDocuments((prev) => [
      {
        id: Date.now(),
        name: data?.name || data?.filename || "Untitled document",
        type: data?.type || "pdf",
        status: "indexed",
        uploadedAt: new Date(),
        size: data?.size || "—",
      },
      ...prev,
    ]);
  };

  return (
    <div>
      <PageHeader
        title="Upload Documents"
        description="Add PDF documents to build your knowledge base."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <UploadPanel onUploaded={handleUploaded} />

        <div className="flex flex-col gap-6">
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-[var(--color-ink-900)]">Currently indexed</h2>
              <StatusBadge tone="success">Active</StatusBadge>
            </div>
            {currentDocument ? (
              <div className="flex items-center gap-3 rounded-lg bg-[var(--color-surface)] p-3.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-[var(--shadow-xs)]">
                  <FileText className="h-5 w-5 text-[var(--color-accent-600)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--color-ink-900)]">
                    {currentDocument.name}
                  </p>
                  <p className="text-xs text-[var(--color-ink-500)]">
                    Indexed {formatRelativeTime(currentDocument.uploadedAt)}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--color-ink-500)]">No document indexed yet.</p>
            )}
          </Card>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-[var(--color-ink-900)]">Document history</h2>
            <DocumentHistoryList documents={documents} />
          </div>
        </div>
      </div>
    </div>
  );
}
