// Consistent page header (title + optional lede) used across the index and conversion pages so
// every section opens the same way.
export function PageIntro({ title, lede }: { title: string; lede?: string }) {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
      {lede ? <p className="mt-4 text-lg text-muted-foreground">{lede}</p> : null}
    </div>
  );
}
