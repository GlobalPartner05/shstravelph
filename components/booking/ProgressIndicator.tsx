export default function ProgressIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-1 sm:gap-2">
      {steps.map((label, i) => (
        <li key={label} className="flex flex-1 items-center gap-1 sm:gap-2">
          <div
            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold sm:h-8 sm:w-8 ${
              i <= current ? "bg-[var(--color-coral)] text-white" : "bg-[var(--color-border-muted)] text-[var(--color-charcoal-soft)]"
            }`}
          >
            {i + 1}
          </div>
          <span className={`hidden text-xs font-medium sm:block ${i <= current ? "text-[var(--color-charcoal)]" : "text-[var(--color-charcoal-soft)]"}`}>
            {label}
          </span>
          {i < steps.length - 1 && <div className="h-px flex-1 bg-[var(--color-border-muted)]" />}
        </li>
      ))}
    </ol>
  );
}
