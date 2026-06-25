import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";

export const navLinks = [
  { to: "/", label: "Entrance" },
  { to: "/thesis", label: "Thesis" },
  { to: "/build", label: "Build" },
  { to: "/ecosystem", label: "Ecosystem" },
  { to: "/standard", label: "Standard" },
  { to: "/journal", label: "Journal" },
  { to: "/future", label: "2035" },
  { to: "/invitation", label: "Invitation" },
] as const;

export function TopNav() {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="solena-topnav" data-open={open ? "true" : "false"}>
      <div className="solena-topnav-inner">
        <Link to="/" className="solena-topnav-brand" onClick={() => setOpen(false)}>
          SOLENA
        </Link>

        <nav className="solena-topnav-links" aria-label="Primary">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={path === l.to ? "is-active" : ""}
              activeOptions={{ exact: true }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="solena-topnav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open ? (
        <div className="solena-topnav-sheet" role="dialog" aria-label="Menu">
          <nav>
            {navLinks.map((l, i) => (
              <Link
                key={l.to}
                to={l.to}
                className={path === l.to ? "is-active" : ""}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                <span>{l.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
