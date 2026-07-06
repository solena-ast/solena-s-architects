import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

import { TopNav, navLinks } from "@/components/top-nav";

type BackdropMedia =
  | { kind: "image"; landscape: string; portrait: string; focal?: string }
  | { kind: "video"; landscape: string; portrait?: string; poster?: string };

export function PageShell({
  eyebrow,
  title,
  lede,
  backdrop,
  children,
  nextRoute,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  backdrop: BackdropMedia;
  children: ReactNode;
  nextRoute?: { to: string; label: string; params?: Record<string, string> };
}) {
  return (
    <main className="solena-page solena-subpage">
      <PageBackdrop backdrop={backdrop} />
      <TopNav />

      <section className="subpage-hero">
        <div className="section-shell">
          <p className="eyebrow reveal">{eyebrow}</p>
          <h1 className="subpage-title reveal-delayed">{title}</h1>
          {lede ? <p className="subpage-lede reveal-slower">{lede}</p> : null}
        </div>
      </section>

      <div className="subpage-body">{children}</div>

      <footer className="subpage-footer">
        <div className="section-shell subpage-footer-inner">
          {nextRoute ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <Link to={nextRoute.to as any} params={nextRoute.params as any} className="solena-button">
              <span>{nextRoute.label}</span>
              <small>Continue</small>
            </Link>
          ) : (
            <Link to="/" className="solena-button">
              <span>Return to entrance</span>
              <small>Re-enter the field</small>
            </Link>
          )}
          <nav className="subpage-footer-nav" aria-label="Footer">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to}>
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="micro-copy">SOLENA — engineered legacy.</p>
        </div>
      </footer>
    </main>
  );
}

function PageBackdrop({ backdrop }: { backdrop: BackdropMedia }) {
  return (
    <div className="page-backdrop morphing-backdrop" aria-hidden="true">
      <div className="backdrop-layer is-active backdrop-default">
        {backdrop.kind === "image" ? (
          <picture>
            <source media="(max-width: 768px)" srcSet={backdrop.portrait} />
            <source media="(min-width: 1024px)" srcSet={backdrop.landscape} />
            <img
              src={backdrop.portrait}
              alt=""
              loading="eager"
              decoding="async"
              className="backdrop-image"
              style={{ objectPosition: backdrop.focal ?? "center" }}
              // @ts-expect-error: React types miss fetchpriority
              fetchpriority="high"
            />
          </picture>
        ) : (
          <video
            className="backdrop-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={backdrop.poster}
          >
            {backdrop.portrait ? (
              <source src={backdrop.portrait} type="video/mp4" media="(max-width: 768px)" />
            ) : null}
            <source src={backdrop.landscape} type="video/mp4" />
          </video>
        )}
        <div className="backdrop-overlay" />
      </div>
      <div className="backdrop-vignette" />
    </div>
  );
}
