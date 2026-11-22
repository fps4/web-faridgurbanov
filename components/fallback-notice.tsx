// Shown above a page whose requested locale had no translation and fell back to the default
// locale (ADR-0002 — explicit, never a silent 404). Server component; rendered only when
// ContentEntry.isFallback is true, or by LocaleNotice on a page with no Dutch version at all.
// The notice speaks the requested locale's language, so it is marked with it (`lang`): the text
// around it is the default locale's. Only Dutch falls back today, hence the default.
export function FallbackNotice({ message, lang = 'nl' }: { message: string; lang?: string }) {
  return (
    <div
      role="note"
      lang={lang}
      className="mb-6 rounded-md border border-border bg-muted px-4 py-2 text-sm text-muted-foreground"
    >
      {message}
    </div>
  );
}
