import { useEffect, useRef, useState } from "react";
import { MessagesSquare } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import AskPanel from "../components/chat/AskPanel";
import ConversationCard from "../components/chat/ConversationCard";
import { chatApi } from "../api/chatApi";
import { useDocument } from "../contexts/DocumentContext";

export default function Chat() {
  const { currentDocument, conversations, addConversation, updateConversation } = useDocument();
  const [question, setQuestion] = useState("");
  const [isAsking, setIsAsking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  const handleSubmit = async () => {
    const trimmed = question.trim();
    if (!trimmed || isAsking) return;

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
      toast.error(err?.response?.data?.detail || "Failed to get an answer.");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-7.5rem)] flex-col gap-6">
      <PageHeader title="Ask Questions" description="Chat with your currently indexed document." />

      <div className="space-y-6">
        <div className="rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--color-ink-900)]">Ready to answer</p>
              <p className="mt-1 text-xs text-[var(--color-ink-500)]">
                Ask a question about the latest indexed PDF and get a clear response.
              </p>
            </div>
            <div className="rounded-full bg-[var(--color-accent-50)] px-3 py-1 text-xs font-medium text-[var(--color-accent-700)]">
              Type your question below
            </div>
          </div>
        </div>

        <div className="flex min-h-[360px] flex-1 flex-col overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-xs)] sm:p-6">
          {conversations.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState
                icon={MessagesSquare}
                title="Start a conversation"
                description="Ask a question about your indexed document and the answer will appear here."
              />
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-5 overflow-y-auto pr-1">
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
      </div>

      <div className="sticky bottom-0 z-10 rounded-[28px] border border-[var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)] sm:p-5">
        <AskPanel
          value={question}
          onChange={setQuestion}
          onSubmit={handleSubmit}
          isLoading={isAsking}
        />
        <p className="mt-3 text-center text-xs text-[var(--color-ink-400)]">
          ChatWithDoc can make mistakes. Verify important information against the source document.
        </p>
      </div>
    </div>
  );
}
