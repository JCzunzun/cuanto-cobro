import type { Plan, Region } from "../lib/tax";
import { Field } from "./Field";

interface Props {
  plan: Plan;
  onChange: (plan: Plan) => void;
}

const REGIONS: { value: Region; label: string }[] = [
  { value: "madrid", label: "Madrid" },
  { value: "other", label: "Otra comunidad" },
];

export function PlanForm({ plan, onChange }: Props) {
  const set = <K extends keyof Plan>(key: K, value: Plan[K]) => onChange({ ...plan, [key]: value });

  return (
    <form className="plan" onSubmit={(e) => e.preventDefault()}>
      <Field
        label="Quiero que me queden al mes"
        hint="Limpio, después de impuestos y cuota. Como un sueldo neto en 12 pagas."
        value={plan.netMonthly}
        onChange={(v) => set("netMonthly", v)}
        min={800}
        max={6000}
        step={50}
        unit="€"
      />
      <Field
        label="Gastos del negocio al mes"
        hint="Software, coworking, gestoría, móvil, equipo…"
        value={plan.expensesMonthly}
        onChange={(v) => set("expensesMonthly", v)}
        min={0}
        max={1500}
        step={10}
        unit="€"
      />
      <Field
        label="Horas que facturas a la semana"
        hint="Solo las que cobras. Lo habitual son 25-32 de cada 40."
        value={plan.billableHoursWeek}
        onChange={(v) => set("billableHoursWeek", Math.max(1, v))}
        min={5}
        max={45}
        step={1}
        unit="h"
      />
      <Field
        label="Semanas al año sin facturar"
        hint="Vacaciones, festivos y algún día de baja."
        value={plan.weeksOff}
        onChange={(v) => set("weeksOff", Math.min(51, v))}
        min={0}
        max={12}
        step={1}
        unit="sem"
      />

      <fieldset className="choice">
        <legend>¿Dónde tienes tu domicilio fiscal?</legend>
        <div className="segmented">
          {REGIONS.map((r) => (
            <label key={r.value}>
              <input
                type="radio"
                name="region"
                value={r.value}
                checked={plan.region === r.value}
                onChange={() => set("region", r.value)}
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="toggle">
        <input type="checkbox" checked={plan.flatRate} onChange={(e) => set("flatRate", e.target.checked)} />
        <span className="toggle-track" aria-hidden="true" />
        <span>
          Estoy en mi primer año con tarifa plana <small>(80 € al mes de cuota)</small>
        </span>
      </label>
    </form>
  );
}
