import { FileText, MessagesSquare, Clock, Activity, ArrowUpRight, UploadCloud, MessageSquarePlus } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import PageHeader from "../components/ui/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

// Mock summary values — wire these up to /documents/ and /chat/history/ once available.
const STATS = [
  { label: "Uploaded Documents", value: "12", icon: FileText, hint: "+2 this week" },
  { label: "Questions Asked", value: "48", icon: MessagesSquare, hint: "+9 this week" },
  { label: "Last Upload", value: "2h ago", icon: Clock, hint: "research-notes.pdf" },
  { label: "System Status", value: "Operational", icon: Activity, tone: "success" },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user?.username || "there"}`}
        description="Here's what's happening with your documents and conversations."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map(({ label, value, icon: Icon, hint, tone }) => (
          <Card key={label} hoverable>
            <div className="flex items-start justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent-50)]">
                <Icon className="h-[18px] w-[18px] text-[var(--color-accent-600)]" />
              </div>
              {tone === "success" && <StatusBadge tone="success">Live</StatusBadge>}
            </div>
            <p className="mt-4 text-2xl font-semibold tracking-tight text-[var(--color-ink-900)]">
              {value}
            </p>
            <p className="mt-1 text-sm text-[var(--color-ink-500)]">{label}</p>
            {hint && <p className="mt-2 text-xs text-[var(--color-ink-400)]">{hint}</p>}
          </Card>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--color-ink-900)]">Get started</h2>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              to="/upload"
              className="flex items-center justify-between rounded-lg border border-[var(--color-border)] p-3.5 transition-colors hover:bg-[var(--color-surface-alt)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-surface-alt)]">
                  <UploadCloud className="h-[18px] w-[18px] text-[var(--color-ink-700)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink-900)]">Upload a document</p>
                  <p className="text-xs text-[var(--color-ink-500)]">PDF only</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[var(--color-ink-400)]" />
            </Link>
            <Link
              to="/chat"
              className="flex items-center justify-between rounded-lg border border-[var(--color-border)] p-3.5 transition-colors hover:bg-[var(--color-surface-alt)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-surface-alt)]">
                  <MessageSquarePlus className="h-[18px] w-[18px] text-[var(--color-ink-700)]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-ink-900)]">Ask a question</p>
                  <p className="text-xs text-[var(--color-ink-500)]">Get answers from your indexed document</p>
                </div>
              </div>
              <ArrowUpRight className="h-4 w-4 text-[var(--color-ink-400)]" />
            </Link>
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--color-ink-900)]">Currently indexed</h2>
            <StatusBadge tone="success">Active</StatusBadge>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-[var(--color-surface)] p-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-[var(--shadow-xs)]">
              <FileText className="h-5 w-5 text-[var(--color-accent-600)]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--color-ink-900)]">
                research-notes.pdf
              </p>
              <p className="text-xs text-[var(--color-ink-500)]">Indexed 2 hours ago · 18 pages</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="mt-4 w-full" disabled>
            View document details
          </Button>
        </Card>
      </div>
    </div>
  );
}
