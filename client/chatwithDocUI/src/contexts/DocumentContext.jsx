import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "chatwithdoc-doc-state";
const DocumentContext = createContext(null);

function parseStoredState(value) {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value);
    return {
      currentDocument: parsed.currentDocument
        ? {
            ...parsed.currentDocument,
            uploadedAt: parsed.currentDocument.uploadedAt
              ? new Date(parsed.currentDocument.uploadedAt)
              : null,
          }
        : null,
      conversations: Array.isArray(parsed.conversations)
        ? parsed.conversations.map((item) => ({
            ...item,
            timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
          }))
        : [],
    };
  } catch {
    return null;
  }
}

function loadInitialState() {
  if (typeof window === "undefined") return { currentDocument: null, conversations: [] };
  const stored = window.localStorage.getItem(STORAGE_KEY);
  const parsed = parseStoredState(stored);
  return parsed ?? { currentDocument: null, conversations: [] };
}

export function DocumentProvider({ children }) {
  const initialState = loadInitialState();
  const [currentDocument, setCurrentDocument] = useState(initialState.currentDocument);
  const [conversations, setConversations] = useState(initialState.conversations);

  useEffect(() => {
    const payload = {
      currentDocument: currentDocument
        ? { ...currentDocument, uploadedAt: currentDocument.uploadedAt?.toISOString() }
        : null,
      conversations: conversations.map((item) => ({
        ...item,
        timestamp: item.timestamp?.toISOString(),
      })),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [currentDocument, conversations]);

  const addConversation = (conversation) => {
    setConversations((prev) => [...prev, conversation]);
  };

  const updateConversation = (id, updater) => {
    setConversations((prev) => prev.map((item) => (item.id === id ? updater(item) : item)));
  };

  const clearConversations = () => setConversations([]);

  const value = useMemo(
    () => ({
      currentDocument,
      setCurrentDocument,
      conversations,
      setConversations,
      addConversation,
      updateConversation,
      clearConversations,
    }),
    [currentDocument, conversations]
  );

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
}

export function useDocument() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocument must be used within a DocumentProvider");
  }
  return context;
}
