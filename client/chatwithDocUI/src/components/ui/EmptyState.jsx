export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface)] px-6 py-14 text-center">
      {Icon && (
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[var(--shadow-xs)]">
          <Icon className="h-5 w-5 text-[var(--color-ink-400)]" />
        </div>
      )}
      <p className="text-sm font-medium text-[var(--color-ink-900)]">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-[var(--color-ink-500)]">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
