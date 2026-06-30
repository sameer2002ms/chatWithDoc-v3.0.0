import { useEffect, useRef, useState } from "react";
import { MessagesSquare } from "lucide-react";
import toast from "react-hot-toast";
import PageHeader from "../components/ui/PageHeader";
import EmptyState from "../components/ui/EmptyState";
import AskPanel from "../components/chat/AskPanel";
import ConversationCard from "../components/chat/ConversationCard";
import { chatApi } from "../api/chatApi";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [conversations, setConversations] = useState([]);
  const [isAsking, setIsAsking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations]);

  const handleSubmit = async () => {
    const trimmed = question.trim();
    if (!trimmed || isAsking) return;

    const id = Date.now();
    setConversations((prev) => [
      ...prev,
      { id, question: trimmed, answer: "", timestamp: new Date(), sources: [], isStreaming: true },
    ]);
    setQuestion("");
    setIsAsking(true);

    try {
      const data = await chatApi.ask(trimmed);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                answer: data?.answer || "No answer was returned.",
                sources: data?.sources || [],
                isStreaming: false,
              }
            : c
        )
      );
    } catch (err) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                answer: "I couldn't generate an answer for that question. Please try again.",
                isStreaming: false,
              }
            : c
        )
      );
      toast.error(err?.response?.data?.detail || "Failed to get an answer.");
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-7.5rem)] flex-col">
      <PageHeader title="Ask Questions" description="Chat with your currently indexed document." />

      <div className="flex flex-1 flex-col overflow-y-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6">
        {conversations.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <EmptyState
              icon={MessagesSquare}
              title="Start a conversation"
              description="Ask a question about your indexed document and the answer will appear here."
            />
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-6">
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

      <div className="mt-4">
        <AskPanel
          value={question}
          onChange={setQuestion}
          onSubmit={handleSubmit}
          isLoading={isAsking}
        />
        <p className="mt-2 text-center text-xs text-[var(--color-ink-400)]">
          ChatWithDoc can make mistakes. Verify important information against the source document.
        </p>
      </div>
    </div>
  );
}
