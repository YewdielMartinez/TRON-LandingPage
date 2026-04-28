import { useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { HOME_DATA } from "../data/translations";
import { gsap } from "../lib/gsap";
import { useGSAP } from "@gsap/react";

// ── Canvas constants ──────────────────────────────────────
const GRID = 55;

type RGB = readonly [number, number, number];

const PALETTE_DARK: RGB[] = [
  [30,  160, 255],  // blue
  [255, 90,  0  ],  // orange
  [255, 35,  65 ],  // red
  [0,   215, 255],  // cyan
];

const PALETTE_LIGHT: RGB[] = [
  [0,   100, 195],  // blue
  [185, 65,  0  ],  // orange
  [190, 20,  50 ],  // red
  [0,   140, 195],  // cyan
];

const STREAK_COLORS: RGB[] = [
  [30,  160, 255],  // blue
  [255, 100, 0  ],  // orange
  [255, 40,  70 ],  // red
  [0,   220, 255],  // cyan
  [160, 50,  255],  // purple
];

interface Streak { x: number; y: number; vx: number; vy: number; rgb: RGB; len: number; }

const rc = (rgb: RGB, a: number) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a})`;

function nodeColorIdx(i: number, j: number): number {
  const v = Math.sin(i * 0.8 + 0.3) * Math.cos(j * 0.6 + 0.7)
          + Math.sin((i - j) * 0.35 + 1.2);
  return ((Math.round(v * 2) % 4) + 4) % 4;
}

// ─────────────────────────────────────────────────────────
export function Home() {
  const { lang } = useLanguage();
  const content = HOME_DATA[lang];

  const sectionRef = useRef<HTMLElement>(null);
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const mouse      = useRef({ x: -9999, y: -9999 });
  const rafId      = useRef(0);

  // ── Canvas: grid + racing streaks ─────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Streak helpers
    const offScreen = (s: Streak) => {
      const m = s.len + 40;
      return s.x < -m || s.x > canvas.width  + m
          || s.y < -m || s.y > canvas.height + m;
    };

    const respawn = (s: Streak) => {
      s.rgb  = STREAK_COLORS[Math.floor(Math.random() * STREAK_COLORS.length)];
      s.len  = 90 + Math.random() * 170;
      const spd  = 3 + Math.random() * 5;
      const horiz = Math.random() > 0.28;
      const angle = (Math.random() - 0.5) * 0.35;

      if (horiz) {
        const right = Math.random() > 0.5;
        s.y  = 50 + Math.random() * (canvas.height - 100);
        s.x  = right ? -(s.len + 20) : canvas.width + s.len + 20;
        s.vx = (right ? 1 : -1) * Math.cos(angle) * spd;
        s.vy = Math.sin(angle) * spd * 0.4;
      } else {
        const down = Math.random() > 0.5;
        s.x  = 50 + Math.random() * (canvas.width - 100);
        s.y  = down ? -(s.len + 20) : canvas.height + s.len + 20;
        s.vx = Math.sin(angle) * spd * 0.4;
        s.vy = (down ? 1 : -1) * Math.cos(angle) * spd;
      }
    };

    // Init 6 streaks staggered along their paths
    const streaks: Streak[] = Array.from({ length: 6 }, (_, k) => {
      const s: Streak = { x: 0, y: 0, vx: 0, vy: 0,
        rgb: STREAK_COLORS[k % STREAK_COLORS.length], len: 130 };
      respawn(s);
      const t = Math.random() * 0.6;
      s.x += s.vx * t * 400;
      s.y += s.vy * t * 400;
      return s;
    });

    const draw = () => {
      const dark    = document.documentElement.classList.contains("dark");
      const palette = dark ? PALETTE_DARK : PALETTE_LIGHT;
      const baseDot = dark ? 0.042 : 0.05;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cols = Math.ceil(canvas.width  / GRID) + 1;
      const rows = Math.ceil(canvas.height / GRID) + 1;
      const mx   = mouse.current.x;
      const my   = mouse.current.y;

      // ── Move streaks ──
      for (const s of streaks) {
        s.x += s.vx;
        s.y += s.vy;
        if (offScreen(s)) respawn(s);
      }

      // ── Faint grid lines ──
      ctx.shadowBlur  = 0;
      ctx.lineWidth   = 0.5;
      ctx.strokeStyle = dark ? "rgba(255,255,255,0.022)" : "rgba(0,0,0,0.03)";
      for (let i = 0; i <= cols; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID, 0);
        ctx.lineTo(i * GRID, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j <= rows; j++) {
        ctx.beginPath();
        ctx.moveTo(0, j * GRID);
        ctx.lineTo(canvas.width, j * GRID);
        ctx.stroke();
      }

      // ── Streak tails ──
      for (const s of streaks) {
        const spd = Math.hypot(s.vx, s.vy);
        if (spd === 0) continue;
        const nx = -s.vx / spd;
        const ny = -s.vy / spd;
        const tx = s.x + nx * s.len;
        const ty = s.y + ny * s.len;

        ctx.save();
        const g = ctx.createLinearGradient(tx, ty, s.x, s.y);
        g.addColorStop(0,    rc(s.rgb, 0));
        g.addColorStop(0.55, rc(s.rgb, 0.18));
        g.addColorStop(1,    rc(s.rgb, 0.95));

        ctx.shadowColor = rc(s.rgb, 1);
        ctx.shadowBlur  = 12;
        ctx.strokeStyle = g;
        ctx.lineWidth   = 1.8;
        ctx.lineCap     = "round";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();

        // Head bright dot
        ctx.shadowBlur  = 22;
        ctx.fillStyle   = rc(s.rgb, 1);
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ── Nodes ──
      for (let i = 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          const x = i * GRID;
          const y = j * GRID;

          // Mouse glow
          const mG2 = Math.max(0, 1 - Math.hypot(x - mx, y - my) / 260) ** 2;

          // Streak glow (nearest streak wins)
          let sG2 = 0, sRgb: RGB = palette[nodeColorIdx(i, j)];
          for (const s of streaks) {
            const g2 = Math.max(0, 1 - Math.hypot(x - s.x, y - s.y) / 175) ** 2;
            if (g2 > sG2) { sG2 = g2; sRgb = s.rgb; }
          }

          const baseRgb  = palette[nodeColorIdx(i, j)];
          const totalG2  = Math.max(mG2, sG2);
          const rgb      = sG2 > mG2 ? sRgb : baseRgb;
          const alpha    = baseDot + totalG2 * 0.78;
          const r        = 0.85 + totalG2 * 2.8;

          if (totalG2 > 0.018) {
            ctx.shadowBlur  = totalG2 * 22;
            ctx.shadowColor = rc(rgb, 1);
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.fillStyle = rc(rgb, alpha);
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      rafId.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId.current);
    };
  }, []);

  // ── Mouse ─────────────────────────────────────────────
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    mouse.current = { x: e.clientX, y: e.clientY };
    if (!titleRef.current) return;
    const x = (e.clientX / window.innerWidth)  * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    gsap.to(titleRef.current, {
      x: x * 20, y: y * 10, rotation: x * 0.5,
      ease: "power2.out", duration: 1,
    });
  }, []);

  const onMouseLeave = useCallback(() => {
    mouse.current = { x: -9999, y: -9999 };
    if (!titleRef.current) return;
    gsap.to(titleRef.current, {
      x: 0, y: 0, rotation: 0,
      ease: "elastic.out(1, 0.3)", duration: 1.5,
    });
  }, []);

  const onBtnEnter = useCallback((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3, ease: "back.out(1.7)" });
  }, []);
  const onBtnLeave = useCallback((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "power2.out" });
  }, []);

  // ── GSAP animations ───────────────────────────────────
  useGSAP(() => {
    gsap.fromTo(".hero-anim",
      { y: 30, opacity: 0, filter: "blur(10px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.1, ease: "power3.out" }
    );

    // npm install typing — steps = char count of "npm install tron-core" (20)
    gsap.fromTo(".install-inner",
      { clipPath: "inset(0 100% 0 0)" },
      { clipPath: "inset(0 0% 0 0)", duration: 1.4, ease: "steps(20)", delay: 1.1 }
    );

    // Cursor blink after typing
    gsap.to(".cursor-blink",
      { opacity: 0, duration: 0.5, repeat: -1, yoyo: true, ease: "steps(1)", delay: 2.6 }
    );

    // Title glow pulse (dark mode only — on light the shadow is invisible)
    gsap.to(titleRef.current, {
      textShadow: "0 0 80px rgba(30,160,255,0.13), 0 0 160px rgba(30,160,255,0.05)",
      duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.5,
    });

  }, { scope: sectionRef });

  return (
    <main
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        paddingTop: 56,
        minHeight: "calc(100vh - 56px)",
        display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* TRON canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed", inset: 0,
          width: "100%", height: "100%",
          pointerEvents: "none", zIndex: 0,
        }}
      />

      {/* Hero */}
      <section
        ref={sectionRef}
        style={{
          flex: 1,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "0 24px", textAlign: "center",
          perspective: 1000, position: "relative", zIndex: 2,
        }}
      >
        {/* Tagline */}
        <p className="hero-anim" style={{
          fontSize: 11, fontWeight: 500,
          letterSpacing: "0.4em", textTransform: "uppercase",
          color: "var(--faint)", marginBottom: 32,
        }}>
          {content.tagline}
        </p>

        {/* Title */}
        <h1
          ref={titleRef}
          className="hero-anim vt-tron-title"
          style={{
            fontSize: "clamp(80px, 14vw, 130px)",
            fontWeight: 400, letterSpacing: "0.1em", lineHeight: 1,
            color: "var(--fg)", marginBottom: 20,
            textShadow: "0 0 0px rgba(30,160,255,0)",
          }}
        >
          {content.title}
        </h1>

        {/* Subtitle */}
        <p className="hero-anim" style={{
          fontSize: 18, fontWeight: 400,
          color: "var(--muted)", marginBottom: 52,
        }}>
          {content.subtitle}
        </p>

        {/* npm install */}
        <div className="hero-anim" style={{
          marginBottom: 44,
          border: "1px solid var(--tron-border)",
          borderRadius: 10,
          padding: "13px 22px",
          background: "var(--tron-bg)",
          display: "inline-flex", alignItems: "center", gap: 10,
          boxShadow: "0 0 32px var(--tron-glow)",
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',Menlo,monospace",
            fontSize: 14, color: "var(--tron-prompt)", userSelect: "none",
          }}>$</span>
          <span
            className="install-inner"
            style={{
              fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',Menlo,monospace",
              fontSize: 14, color: "var(--fg)", letterSpacing: "0.02em",
              display: "inline-block",
            }}
          >
            npm install tron-core
          </span>
          <span className="cursor-blink" style={{
            fontFamily: "monospace", fontSize: 15,
            color: "var(--tron-cyan)", lineHeight: 1, marginLeft: 2,
          }}>|</span>
        </div>

        {/* CTA */}
        <div className="hero-anim" style={{
          display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
        }}>
          <Link to="/docs" className="btn-primary"
            onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}
            style={{ display: "inline-block" }}>
            {content.ctaPrimary}
          </Link>
          <Link to="/playground" className="btn-ghost"
            onMouseEnter={onBtnEnter} onMouseLeave={onBtnLeave}
            style={{ display: "inline-block" }}>
            {content.ctaSecondary}
          </Link>
        </div>
      </section>
    </main>
  );
}
