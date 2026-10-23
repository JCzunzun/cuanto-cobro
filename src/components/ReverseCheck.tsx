import { useId, useState } from "react";
import { eur } from "../lib/format";
import { netFromHourly, type Plan } from "../lib/tax";

// Para quien ya tiene un precio en la cabeza y quiere saber si le sale a cuenta.
export function ReverseCheck({ plan, suggested }: { plan: Plan; suggested: number }) {
  const id = useId();
  const [hourly, setHourly] = useState(25);
  const year = netFromHourly(hourly, plan);
  const monthly = year.net / 12;
  const diff = monthly - plan.netMonthly;

  return (
    <div className="reverse">
      <label htmlFor={id}>¿Y si cobro</label>
      <span className="field-input">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={0}
          step={1}
          value={hourly}
          onChange={(e) => setHourly(Math.max(0, e.target.valueAsNumber || 0))}
        />
        <span className="unit">€/h?</span>
      </span>
      <p>
        Te quedarían <strong>{eur(monthly)} al mes</strong>
        {Math.abs(diff) >= 1 && (
          <span className={diff < 0 ? "short" : "over"}>
            {diff < 0 ? `, ${eur(-diff)} menos de lo que buscas` : `, ${eur(diff)} más de lo que buscas`}
          </span>
        )}
        .
      </p>
      {diff < 0 && (
        <button type="button" className="link-btn" onClick={() => setHourly(Math.ceil(suggested))}>
          Probar con {eur(Math.ceil(suggested))}/h
        </button>
      )}
    </div>
  );
}
