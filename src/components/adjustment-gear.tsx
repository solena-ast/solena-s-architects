import { useEffect, useRef, useState } from "react";

type Settings = {
  motion: "reduced" | "standard" | "cinematic";
  intensity: "subtle" | "balanced" | "strong";
  contrast: "low" | "medium" | "high";
};

const DEFAULTS: Settings = {
  motion: "cinematic",
  intensity: "balanced",
  contrast: "medium",
};

const KEY = "solena.settings.v1";

function applySettings(s: Settings) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.motion = s.motion;
  root.dataset.intensity = s.intensity;
  root.dataset.contrast = s.contrast;
}

function readSettings(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return DEFAULTS;
  }
}

const groups: Array<{ key: keyof Settings; label: string; options: string[] }> = [
  { key: "motion", label: "Motion", options: ["reduced", "standard", "cinematic"] },
  { key: "intensity", label: "Image presence", options: ["subtle", "balanced", "strong"] },
  { key: "contrast", label: "Contrast", options: ["low", "medium", "high"] },
];

export function AdjustmentGear() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Hydrate once on client
  useEffect(() => {
    const s = readSettings();
    setSettings(s);
    applySettings(s);
  }, []);

  // Persist + apply on change
  useEffect(() => {
    applySettings(settings);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      /* noop */
    }
  }, [settings]);

  // Close on outside click / escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="adjustment-gear" ref={panelRef}>
      <button
        type="button"
        className={`gear-trigger ${open ? "is-open" : ""}`}
        aria-label="Open atmosphere controls"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.4">
          <circle cx="12" cy="12" r="3.1" />
          <path d="M19.4 12a7.4 7.4 0 0 0-.1-1.2l2-1.55-2-3.46-2.4.96a7.5 7.5 0 0 0-2.1-1.22l-.4-2.53h-4l-.4 2.53a7.5 7.5 0 0 0-2.1 1.22l-2.4-.96-2 3.46 2 1.55a7.4 7.4 0 0 0 0 2.4l-2 1.55 2 3.46 2.4-.96a7.5 7.5 0 0 0 2.1 1.22l.4 2.53h4l.4-2.53a7.5 7.5 0 0 0 2.1-1.22l2.4.96 2-3.46-2-1.55c.07-.4.1-.8.1-1.2Z" />
        </svg>
      </button>

      {open && (
        <div className="gear-panel" role="dialog" aria-label="Atmosphere controls">
          <header>
            <p className="eyebrow">Atmosphere</p>
            <h4>Adjust the field</h4>
          </header>
          {groups.map((g) => (
            <div className="gear-row" key={g.key}>
              <span className="gear-row-label">{g.label}</span>
              <div className="gear-options" role="radiogroup" aria-label={g.label}>
                {g.options.map((opt) => {
                  const isActive = settings[g.key] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      className={isActive ? "is-active" : ""}
                      onClick={() =>
                        setSettings((s) => ({ ...s, [g.key]: opt } as Settings))
                      }
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <button
            type="button"
            className="gear-reset"
            onClick={() => setSettings(DEFAULTS)}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
