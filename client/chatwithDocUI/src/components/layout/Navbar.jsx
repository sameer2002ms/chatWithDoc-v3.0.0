import { useEffect, useRef, useState } from "react";
import { Menu, ChevronDown, User, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar({ onOpenMobileMenu, onLogout, pageTitle }) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = (user?.username || "U").slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-white/90 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-md p-1.5 text-[var(--color-ink-500)] hover:bg-[var(--color-surface-alt)] lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-sm font-medium text-[var(--color-ink-900)]">{pageTitle}</span>
      </div>

      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[var(--color-surface-alt)]"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-accent-600)] text-xs font-semibold text-white">
            {initials}
          </span>
          <span className="hidden text-sm font-medium text-[var(--color-ink-900)] sm:block">
            {user?.username || "User"}
          </span>
          <ChevronDown className="hidden h-4 w-4 text-[var(--color-ink-400)] sm:block" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-[var(--color-border)] bg-white p-1.5 shadow-[var(--shadow-md)] animate-fade-in">
            <div className="flex items-center gap-2 rounded-md px-2.5 py-2 text-sm text-[var(--color-ink-700)]">
              <User className="h-4 w-4" />
              {user?.username || "User"}
            </div>
            <div className="my-1 h-px bg-[var(--color-border)]" />
            <button
              onClick={onLogout}
              className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm text-[var(--color-rose-600)] hover:bg-[var(--color-rose-50)]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
