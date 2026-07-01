import { useEffect, useRef, useState } from "react";
import { FileText, MessagesSquare } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import StatusBadge from "../components/ui/StatusBadge";
import UploadPanel from "../components/upload/UploadPanel";
import EmptyState from "../components/ui/EmptyState";
import AskPanel from "../components/chat/AskPanel";
import ConversationCard from "../components/chat/ConversationCard";
import { chatApi } from "../api/chatApi";
import { useDocument } from "../contexts/DocumentContext";
import { formatRelativeTime } from "../utils/format";

export default function Upload() {
  const { currentDocument, setCurrentDocument, conversations, clearConversations, addConversation, updateConversation } = useDocument();
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  const handleUploaded = (data) => {
    setCurrentDocument({
      id: Date.now(),
      name: data?.name || data?.filename || "Untitled document",
      type: data?.type || "pdf",
      uploadedAt: new Date(),
      size: data?.size || "—",
    });
    clearConversations();
  };

  const handleSubmit = async () => {
    const trimmed = question.trim();
    if (!trimmed || isAsking || !currentDocument) return;

    const id = Date.now();
    addConversation({
      id,
      question: trimmed,
      answer: "",
      timestamp: new Date(),
      sources: [],
      isStreaming: true,
    });
    setQuestion("");
    setIsAsking(true);

    try {
      const data = await chatApi.ask(trimmed);
      updateConversation(id, (c) => ({
        ...c,
        answer: data?.answer || "No answer was returned.",
        sources: data?.sources || [],
        isStreaming: false,
      }));
    } catch (err) {
      updateConversation(id, (c) => ({
        ...c,
        answer: "I couldn't generate an answer for that question. Please try again.",
        isStreaming: false,
      }));
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Upload & Ask"
        description="Upload a PDF and ask questions without switching pages."
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_1.1fr]">
        <UploadPanel onUploaded={handleUploaded} />

        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-[var(--color-ink-900)]">Latest indexed file</h2>
                <p className="text-xs text-[var(--color-ink-500)]">
                  The most recent upload is shown here and will power the chat.
                </p>
              </div>
              <StatusBadge tone={currentDocument ? "success" : "neutral"}>
                {currentDocument ? "Ready" : "Waiting"}
              </StatusBadge>
            </div>

            {currentDocument ? (
              <div className="rounded-[26px] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-xs)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-white shadow-[var(--shadow-xs)]">
                    <FileText className="h-5 w-5 text-[var(--color-accent-600)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-[var(--color-ink-900)]">{currentDocument.name}</p>
                    <p className="mt-1 text-xs text-[var(--color-ink-500)]">
                      Indexed {formatRelativeTime(currentDocument.uploadedAt)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[26px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center text-sm text-[var(--color-ink-500)]">
                Upload a PDF to enable chat on this page.
              </div>
            )}
          </Card>

          <Card className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-[var(--color-ink-900)]">Ask questions</h2>
                <p className="text-xs text-[var(--color-ink-500)]">
                  Ask anything about your latest indexed PDF.
                </p>
              </div>
              <span className="rounded-full bg-[var(--color-accent-50)] px-3 py-1 text-xs font-medium text-[var(--color-accent-700)]">
                {currentDocument ? "Chat enabled" : "Upload first"}
              </span>
            </div>

            <div className="min-h-[280px] rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5">
              {conversations.length === 0 ? (
                <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-3 text-center text-sm text-[var(--color-ink-500)]">
                  <MessagesSquare className="h-8 w-8 text-[var(--color-accent-600)]" />
                  <p className="font-medium text-[var(--color-ink-900)]">Ask your first question</p>
                  <p className="max-w-xs text-sm text-[var(--color-ink-500)]">
                    Once a PDF is indexed, your questions will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-5 overflow-y-auto pr-1">
                  {conversations.map((c) => (
                    <ConversationCard
                      key={c.id}
                      question={c.question}
                      answer={c.answer}
                      timestamp={c.timestamp}
                      sources={c.sources}
                      isStreaming={c.isStreaming}
                    />
                  ))}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            <AskPanel
              value={question}
              onChange={setQuestion}
              onSubmit={handleSubmit}
              isLoading={isAsking}
              disabled={!currentDocument}
            />
            <p className="text-center text-xs text-[var(--color-ink-400)]">
              ChatWithDoc can make mistakes. Verify key details against the source PDF.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
