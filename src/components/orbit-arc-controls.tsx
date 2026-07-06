import { useAtmosphere, type Atmosphere } from "@/hooks/use-atmosphere";

const groups: Array<{ key: keyof Atmosphere; label: string; options: string[] }> = [
  { key: "motion", label: "Motion", options: ["reduced", "standard", "cinematic"] },
  { key: "intensity", label: "Field", options: ["subtle", "balanced", "strong"] },
  { key: "contrast", label: "Contrast", options: ["low", "medium", "high"] },
];

/**
 * Radial atmosphere controls — arranged as an arc to the LEFT of the Solena orbit.
 * On narrow viewports the arc collapses into a stacked column beneath the orbit.
 */
export function OrbitArcControls() {
  const [settings, update] = useAtmosphere();

  return (
    <aside className="orbit-arc" aria-label="Atmosphere controls">
      <p className="orbit-arc-eyebrow">Atmosphere</p>
      <ol className="orbit-arc-groups">
        {groups.map((g, gi) => (
          <li key={g.key} className="orbit-arc-group" style={{ ["--gi" as never]: gi }}>
            <span className="orbit-arc-label">{g.label}</span>
            <div className="orbit-arc-options" role="radiogroup" aria-label={g.label}>
              {g.options.map((opt, oi) => {
                const active = settings[g.key] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    className={active ? "is-active" : ""}
                    style={{ ["--oi" as never]: oi }}
                    onClick={() => update({ [g.key]: opt } as Partial<Atmosphere>)}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
