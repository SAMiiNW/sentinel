'use client';

import { useEffect, useRef } from 'react';

interface Blob {
  hue: [number, number, number]; // rgb
  x: number;
  y: number;
  r: number;
  dx: number;
  dy: number;
  phase: number;
}

// Animated teal-to-violet gradient mesh drifting behind frosted glass.
export function MeshCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let t = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    const palette: [number, number, number][] = [
      [94, 234, 212], // teal
      [167, 139, 250], // violet
      [56, 189, 248], // sky
      [45, 212, 191], // emerald-teal
    ];

    let blobs: Blob[] = [];

    const seed = () => {
      blobs = palette.map((hue, i) => ({
        hue,
        x: Math.random(),
        y: Math.random(),
        r: 0.42 + Math.random() * 0.22,
        dx: (Math.random() - 0.5) * 0.00006,
        dy: (Math.random() - 0.5) * 0.00006,
        phase: i * 1.7,
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#070b18';
      ctx.fillRect(0, 0, w, h);

      const minDim = Math.max(w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const b of blobs) {
        const driftX = b.x + Math.sin(t * 0.00022 + b.phase) * 0.12 + b.dx * t;
        const driftY = b.y + Math.cos(t * 0.00018 + b.phase) * 0.12 + b.dy * t;
        const cx = ((driftX % 1) + 1) % 1;
        const cy = ((driftY % 1) + 1) % 1;
        const px = cx * w;
        const py = cy * h;
        const radius = b.r * minDim;
        const grad = ctx.createRadialGradient(px, py, 0, px, py, radius);
        const [r, g, bl] = b.hue;
        grad.addColorStop(0, `rgba(${r},${g},${bl},0.34)`);
        grad.addColorStop(0.5, `rgba(${r},${g},${bl},0.12)`);
        grad.addColorStop(1, 'rgba(7,11,24,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';

      // subtle grain veil to keep it from banding
      ctx.fillStyle = 'rgba(7,11,24,0.12)';
      ctx.fillRect(0, 0, w, h);

      t += 16;
      raf = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduce) raf = requestAnimationFrame(draw);
    };

    seed();
    resize();
    if (!reduce) raf = requestAnimationFrame(draw);
    else draw();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return <canvas ref={ref} className="h-full w-full" aria-hidden="true" />;
}
