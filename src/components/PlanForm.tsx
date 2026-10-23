import { useId } from "react";
import { COMMUNITIES, HOLIDAY_YEAR, PROVINCES, holidaysFor, type CommunityId } from "../lib/holidays";
import type { Plan } from "../lib/tax";
import { Field } from "./Field";

interface Props {
  plan: Plan;
  onChange: (plan: Plan) => void;
}

// Provincias agrupadas por comunidad para que el desplegable se lea de un vistazo.
const GROUPS = (Object.keys(COMMUNITIES) as CommunityId[])
  .map((id) => ({ id, name: COMMUNITIES[id].name, provinces: PROVINCES.filter((p) => p.community === id) }))
  .sort((a, b) => a.name.localeCompare(b.name, "es"));

const dateFormat = new Intl.DateTimeFormat("es-ES", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const formatDate = (mmdd: string) => {
  const [m, d] = mmdd.split("-").map(Number);
  return dateFormat.format(new Date(Date.UTC(HOLIDAY_YEAR, m - 1, d)));
};

export function PlanForm({ plan, onChange }: Props) {
  const provinceId = useId();
  const set = <K extends keyof Plan>(key: K, value: Plan[K]) => onChange({ ...plan, [key]: value });
  const holidays = holidaysFor(plan.province);

  return (
    <form className="plan" aria-labelledby="plan-title" onSubmit={(e) => e.preventDefault()}>
      <h2 id="plan-title" className="col-title">
        Tus números
      </h2>
      <Field
        label="Quiero que me queden al mes"
        hint="Limpio, como un sueldo neto en 12 pagas."
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
        label="Semanas de vacaciones"
        hint="Cuenta también algún día de baja o imprevisto."
        value={plan.vacationWeeks}
        onChange={(v) => set("vacationWeeks", Math.min(40, v))}
        min={0}
        max={10}
        step={1}
        unit="sem."
      />

      <div className="field province">
        <div className="field-text">
          <label htmlFor={provinceId}>Provincia</label>
          <p className="field-hint">Para los festivos y la escala del IRPF.</p>
        </div>
        <span className="select">
          <select id={provinceId} value={plan.province} onChange={(e) => set("province", e.target.value)}>
            {GROUPS.map((g) => (
              <optgroup key={g.id} label={g.name}>
                {g.provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </span>
        <details className="holidays">
          <summary>
            <strong>{holidays.total} festivos</strong> entre semana en {HOLIDAY_YEAR}
          </summary>
          <ul>
            {holidays.weekdayHolidays.map((h) => (
              <li key={h.date}>
                <span>{formatDate(h.date)}</span>
                {h.name}
              </li>
            ))}
            {holidays.extra > 0 && (
              <li>
                <span>+{holidays.extra}</span>
                {holidays.community.extra?.note}
              </li>
            )}
            <li>
              <span>+{holidays.local}</span>
              festivos locales de tu ayuntamiento
            </li>
          </ul>
          <p>Los que caen en sábado o domingo no se cuentan: ese día no ibas a facturar igualmente.</p>
        </details>
      </div>

      <label className="field toggle">
        <span className="field-text">
          <span className="toggle-label">Tarifa plana</span>
          <span className="field-hint">Primer año como autónomo: 80 € al mes de cuota.</span>
        </span>
        <input type="checkbox" checked={plan.flatRate} onChange={(e) => set("flatRate", e.target.checked)} />
        <span className="toggle-track" aria-hidden="true" />
      </label>
    </form>
  );
}
