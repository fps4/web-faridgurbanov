'use client';

import { useEffect, useRef } from 'react';

// Decorative hero backdrop (FS-0002/US-0010 visual): a drifting "constellation" of nodes that wire
// themselves together as they pass near each other — an abstract "integration backbone" that evokes
// govern → build → deliver as points connecting in space, without literal imagery. Canvas/JS only, so
// it adds no image weight on the static export (ADR-0001). Theme-aware (reads the --foreground token,
// re-reads on theme toggle) and aria-hidden (purely decorative). Motion is slow and is gated behind
// prefers-reduced-motion — when a user opts out we paint a single static frame instead of animating.
// A radial mask anchors the field to the upper-right and fades it out over the left-aligned hero text,
// so it never affects text contrast (WCAG).
export function HeroBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // Pull the theme foreground (an "r g b" / "h s% l%"-resolved colour) off the canvas, which inherits
    // text-foreground. Re-read it when the .dark class flips so the field tracks the active theme.
    let rgb = readColor(canvas);
    const themeObserver = new MutationObserver(() => {
      rgb = readColor(canvas);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const LINK_DIST = 130; // px at which two nodes start to wire together
    type Node = { x: number; y: number; vx: number; vy: number };
    let nodes: Node[] = [];
    let width = 0;
    let height = 0;
    let raf = 0;

    // Pointer gives the field a gentle "gravity" — nodes near the cursor brighten and link to it.
    const pointer = { x: -9999, y: -9999, active: false };

    const seed = () => {
      // Density scales with area but is capped so large viewports stay cheap and uncluttered.
      const count = Math.min(90, Math.round((width * height) / 13000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Edges first, so nodes sit on top. Opacity fades with distance for the "forming/dissolving" feel.
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist > LINK_DIST) continue;
          const alpha = (1 - dist / LINK_DIST) * 0.5;
          ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }

        // Link nodes to the cursor when it's in range — subtle interactivity, brighter than node-node.
        if (pointer.active) {
          const pd = Math.hypot(a.x - pointer.x, a.y - pointer.y);
          if (pd < LINK_DIST) {
            ctx.strokeStyle = `rgba(${rgb}, ${(1 - pd / LINK_DIST) * 0.6})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      ctx.fillStyle = `rgba(${rgb}, 0.7)`;
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const step = () => {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        // Bounce off the edges so the field stays put without popping (vs. wrap-around).
        if (n.x <= 0 || n.x >= width) n.vx *= -1;
        if (n.y <= 0 || n.y >= height) n.vy *= -1;
      }
      draw();
      raf = requestAnimationFrame(step);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    if (reduceMotion) {
      draw(); // single static frame — no animation loop
    } else {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerLeave);
      raf = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      themeObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Soft theme-aware gradient anchored top-right. */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_85%_8%,hsl(var(--foreground)/0.06),transparent_70%)]" />

      {/* Particle field. text-foreground feeds the canvas its colour; the mask fades the field out over
          the lower-left where the hero copy sits, keeping its emphasis in the upper-right corner. */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full text-foreground opacity-[0.55] [mask-image:radial-gradient(75%_75%_at_88%_12%,#000_30%,transparent_78%)] [-webkit-mask-image:radial-gradient(75%_75%_at_88%_12%,#000_30%,transparent_78%)]"
      />
    </div>
  );
}

// Resolve the inherited text colour to an "r, g, b" string usable in rgba(). getComputedStyle returns
// colours as rgb()/rgba(), so we strip to the numeric channels.
function readColor(el: HTMLElement): string {
  const color = getComputedStyle(el).color; // e.g. "rgb(10, 10, 12)"
  const match = color.match(/\d+(\.\d+)?/g);
  if (!match || match.length < 3) return '120, 120, 130';
  return `${match[0]}, ${match[1]}, ${match[2]}`;
}
