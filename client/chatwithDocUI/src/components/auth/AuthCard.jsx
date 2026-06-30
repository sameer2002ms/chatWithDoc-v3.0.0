import Logo from "../ui/Logo";

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface)] px-4 py-10">
      <div className="w-full max-w-[400px]">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="lg" withWordmark={false} className="mb-4" />
          <h1 className="text-xl font-semibold tracking-tight text-[var(--color-ink-900)]">
            {title}
          </h1>
          {subtitle && <p className="mt-1.5 text-sm text-[var(--color-ink-500)]">{subtitle}</p>}
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-white p-7 shadow-[var(--shadow-sm)]">
          {children}
        </div>

        {footer && <div className="mt-6 text-center text-sm text-[var(--color-ink-500)]">{footer}</div>}
      </div>
    </div>
  );
}
