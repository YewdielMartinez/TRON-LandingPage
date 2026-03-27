import { useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { HOME_DATA } from "../data/translations";
import { gsap } from "../lib/gsap";
import { useGSAP } from "@gsap/react";

export function Home() {
  const { lang } = useLanguage();
  const content = HOME_DATA[lang];
  const containerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!titleRef.current) return;
    // Calculate distance from center (normalized from -1 to 1)
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;

    // Parallax effect on the title
    gsap.to(titleRef.current, {
      x: x * 20,
      y: y * 10,
      rotation: x * 0.5,
      ease: "power2.out",
      duration: 1,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!titleRef.current) return;
    gsap.to(titleRef.current, {
      x: 0,
      y: 0,
      rotation: 0,
      ease: "elastic.out(1, 0.3)",
      duration: 1.5,
    });
  }, []);

  const handleButtonEnter = useCallback((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, {
      scale: 1.05,
      duration: 0.3,
      ease: "back.out(1.7)",
    });
  }, []);

  const handleButtonLeave = useCallback((e: React.MouseEvent) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: "power2.out" });
  }, []);

  useGSAP(
    () => {
      // Animate the main content elements staggered
      gsap.fromTo(
        ".hero-anim",
        { y: 30, opacity: 0, filter: "blur(10px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <main
      style={{
        paddingTop: 56,
        minHeight: "calc(100vh - 56px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Minimalist Hero ── */}
      <section
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 24px",
          textAlign: "center",
          perspective: 1000,
        }}
      >
        <p
          className="hero-anim"
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            color: "var(--faint)",
            marginBottom: 36,
          }}
        >
          {content.tagline}
        </p>

        <h1
          ref={titleRef}
          className="hero-anim vt-tron-title"
          style={{
            fontSize: "clamp(80px, 14vw, 130px)",
            fontWeight: 400,
            letterSpacing: "0.1em",
            lineHeight: 1,
            color: "var(--fg)",
            marginBottom: 24,
          }}
        >
          {content.title}
        </h1>

        <p
          className="hero-anim"
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: "var(--muted)",
            marginBottom: 20,
          }}
        >
          {content.subtitle}
        </p>

        {/* CTA buttons */}
        <div
          className="hero-anim"
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            to="/docs"
            className="btn-primary"
            onMouseEnter={handleButtonEnter}
            onMouseLeave={handleButtonLeave}
            style={{ display: "inline-block" }}
          >
            {content.ctaPrimary}
          </Link>
          <Link
            to="/playground"
            className="btn-ghost"
            onMouseEnter={handleButtonEnter}
            onMouseLeave={handleButtonLeave}
            style={{ display: "inline-block" }}
          >
            {content.ctaSecondary}
          </Link>
        </div>
      </section>
    </main>
  );
}
