export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-10 h-px bg-void-border mb-7" />
      <p className="font-display text-xl italic font-semibold text-ink-dim">
        No links yet
      </p>
      <p className="mt-2 text-xs text-ink-faint font-sans">
        Shorten a URL above and it&apos;ll appear here.
      </p>
    </div>
  );
}
