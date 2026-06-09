// Shown above a page whose requested locale had no translation and fell back to the default
// locale (ADR-0002 — explicit, never a silent 404). Server component; rendered only when
// ContentEntry.isFallback is true.
export function FallbackNotice({ message }: { message: string }) {
  return (
    <div
      role="note"
      className="mb-6 rounded-md border border-border bg-muted px-4 py-2 text-sm text-muted-foreground"
    >
      {message}
    </div>
  );
}
