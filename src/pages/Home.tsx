import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import { HOME_DATA } from "../data/translations";

const INSTALL_CMD = "npm install tron-core";

export function Home() {
  const { lang } = useLanguage();
  const content = HOME_DATA[lang];
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <main
      style={{
        paddingTop: 56,
        minHeight: "calc(100vh - 56px)",
        display: "flex", flexDirection: "column",
        position: "relative", overflow: "hidden",
      }}
    >
      {/* Hero */}
      <section
        style={{
          flex: 1,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "0 24px", textAlign: "center",
          position: "relative", zIndex: 2,
        }}
      >
        {/* Tagline */}
        <p style={{
          fontSize: 11, fontWeight: 500,
          letterSpacing: "0.4em", textTransform: "uppercase",
          color: "var(--faint)", marginBottom: 32,
        }}>
          {content.tagline}
        </p>

        {/* Title */}
        <h1
          className="vt-tron-title"
          style={{
            fontSize: "clamp(80px, 14vw, 130px)",
            fontWeight: 400, letterSpacing: "0.1em", lineHeight: 1,
            color: "var(--fg)", marginBottom: 20,
          }}
        >
          {content.title}
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 18, fontWeight: 400,
          color: "var(--muted)", marginBottom: 52,
        }}>
          {content.subtitle}
        </p>

        {/* npm install */}
        <div style={{
          marginBottom: 44,
          border: "1px solid var(--border, rgba(127,127,127,0.3))",
          borderRadius: 8,
          padding: "10px 14px",
          display: "inline-flex", alignItems: "center", gap: 12,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono','Fira Code','Cascadia Code',Menlo,monospace",
            fontSize: 14, color: "var(--fg)", letterSpacing: "0.02em",
          }}>
            {INSTALL_CMD}
          </span>
          <button
            onClick={onCopy}
            aria-label="Copy command"
            style={{
              background: "transparent",
              border: "1px solid var(--border, rgba(127,127,127,0.3))",
              borderRadius: 6,
              padding: "4px 10px",
              fontSize: 12,
              color: "var(--muted)",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        {/* CTA */}
        <div style={{
          display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
        }}>
          <Link to="/docs" className="btn-primary" style={{ display: "inline-block" }}>
            {content.ctaPrimary}
          </Link>
          <Link to="/playground" className="btn-ghost" style={{ display: "inline-block" }}>
            {content.ctaSecondary}
          </Link>
        </div>
      </section>
    </main>
  );
}
