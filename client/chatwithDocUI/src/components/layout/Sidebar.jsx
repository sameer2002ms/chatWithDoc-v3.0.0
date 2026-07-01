import { NavLink } from "react-router-dom";
import { UploadCloud, MessagesSquare, LogOut, X } from "lucide-react";
import Logo from "../ui/Logo";
import { cn } from "../../utils/cn";

const NAV_ITEMS = [
  { to: "/upload", label: "Upload Documents", icon: UploadCloud },
  { to: "/chat", label: "Ask Questions", icon: MessagesSquare },
];

export default function Sidebar({ onLogout, mobileOpen, onCloseMobile }) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-[var(--color-border)] bg-white transition-transform duration-200 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--color-border)] px-5">
          <Logo size="sm" />
          <button
            onClick={onCloseMobile}
            className="rounded-md p-1 text-[var(--color-ink-400)] hover:bg-[var(--color-surface-alt)] lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "bg-[var(--color-accent-50)] text-[var(--color-accent-700)]"
                    : "text-[var(--color-ink-700)] hover:bg-[var(--color-surface-alt)]"
                )
              }
            >
              <Icon className="h-[18px] w-[18px]" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-[var(--color-border)] p-3">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-ink-700)] transition-colors duration-150 hover:bg-[var(--color-rose-50)] hover:text-[var(--color-rose-600)]"
          >
            <LogOut className="h-[18px] w-[18px]" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
