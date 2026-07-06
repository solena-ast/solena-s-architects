import { useEffect, useState } from "react";

export type Atmosphere = {
  motion: "reduced" | "standard" | "cinematic";
  intensity: "subtle" | "balanced" | "strong";
  contrast: "low" | "medium" | "high";
};

export const ATMOSPHERE_DEFAULTS: Atmosphere = {
  motion: "cinematic",
  intensity: "balanced",
  contrast: "medium",
};

const KEY = "solena.settings.v1";
const EVENT = "solena:atmosphere";

export function applyAtmosphere(s: Atmosphere) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.motion = s.motion;
  root.dataset.intensity = s.intensity;
  root.dataset.contrast = s.contrast;
}

function read(): Atmosphere {
  if (typeof window === "undefined") return ATMOSPHERE_DEFAULTS;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return ATMOSPHERE_DEFAULTS;
    return { ...ATMOSPHERE_DEFAULTS, ...(JSON.parse(raw) as Partial<Atmosphere>) };
  } catch {
    return ATMOSPHERE_DEFAULTS;
  }
}

export function useAtmosphere(): [Atmosphere, (patch: Partial<Atmosphere>) => void, () => void] {
  const [settings, setSettings] = useState<Atmosphere>(ATMOSPHERE_DEFAULTS);

  useEffect(() => {
    const initial = read();
    setSettings(initial);
    applyAtmosphere(initial);
    const onSync = (e: Event) => {
      const detail = (e as CustomEvent<Atmosphere>).detail;
      if (detail) setSettings(detail);
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setSettings(read());
    };
    window.addEventListener(EVENT, onSync as EventListener);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(EVENT, onSync as EventListener);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const update = (patch: Partial<Atmosphere>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      applyAtmosphere(next);
      window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
      return next;
    });
  };

  const reset = () => update(ATMOSPHERE_DEFAULTS);

  return [settings, update, reset];
}
