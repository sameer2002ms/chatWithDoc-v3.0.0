import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[var(--color-surface)] px-4 text-center">
      <p className="text-5xl font-semibold tracking-tight text-[var(--color-ink-900)]">404</p>
      <p className="text-sm text-[var(--color-ink-500)]">This page doesn't exist.</p>
      <Link to="/dashboard">
        <Button variant="accent" size="sm" className="mt-2">
          Back to dashboard
        </Button>
      </Link>
    </div>
  );
}
