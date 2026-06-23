// Decorative hero backdrop (FS-0002/US-0010 visual): an abstract node-edge "integration backbone"
// motif over a soft gradient — evoking govern → build → deliver without literal imagery. CSS/SVG
// only, so it adds no image weight on the static export (ADR-0001). Theme-aware via the --foreground
// token and aria-hidden (purely decorative). Motion is subtle — nodes twinkle and the whole topology
// drifts slowly — and is gated behind prefers-reduced-motion in globals.css (.hero-node / .hero-drift),
// so it falls back to fully static. Kept at very low opacity and offset to the upper-right, clear of
// the left-aligned hero text, so it never affects text contrast (WCAG).
export function HeroBackdrop() {
  // Three loose clusters (govern · build · deliver) wired left → right.
  const nodes = [
    [60, 120], [92, 202], [70, 286], // govern
    [200, 92], [212, 200], [192, 300], // build
    [330, 140], [342, 248], [322, 322], // deliver
  ] as const;
  const edges = [
    [0, 1], [1, 2], // govern internal
    [0, 3], [1, 4], [2, 5], [1, 3], // govern → build
    [3, 4], [4, 5], // build internal
    [3, 6], [4, 7], [5, 8], [4, 6], // build → deliver
    [6, 7], [7, 8], // deliver internal
  ] as const;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Soft theme-aware gradient anchored top-right. */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_85%_8%,hsl(var(--foreground)/0.06),transparent_70%)]" />

      {/* Node-edge topology, upper-right and oversized so it bleeds off the corner. */}
      <svg
        className="absolute -top-24 -right-20 h-[34rem] w-[34rem] text-[hsl(var(--foreground)/0.08)] sm:-right-10 lg:right-0"
        viewBox="0 0 400 400"
        fill="none"
      >
        <g className="hero-drift">
          <g stroke="currentColor" strokeWidth={1.25}>
            {edges.map(([a, b]) => (
              <line key={`${a}-${b}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />
            ))}
          </g>
          <g fill="currentColor">
            {nodes.map(([cx, cy], i) => (
              <circle
                key={i}
                className="hero-node"
                cx={cx}
                cy={cy}
                r={3.5}
                // Stagger each node's twinkle so the topology shimmers rather than blinking in unison.
                style={{ animationDelay: `${(i % 5) * 0.8}s` }}
              />
            ))}
          </g>
        </g>
      </svg>
    </div>
  );
}
