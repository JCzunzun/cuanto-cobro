import { useId, useState } from "react";
import { useTween } from "../hooks/useTween";
import { eur, eurCents, num } from "../lib/format";
import { netFromHourly, type Plan, type Quote } from "../lib/tax";

// La tarifa se presenta como una cuenta escrita: se ve de dónde sale cada euro.
export function Ledger({ plan, quote }: { plan: Plan; quote: Quote }) {
  const hourly = useTween(quote.hourly);
  const monthlyHours = quote.billableHours / 12;
  const lines = [
    { sign: "", label: "Lo que quieres ganar", value: quote.net, tone: "net" },
    { sign: "+", label: "IRPF", value: quote.incomeTax, tone: "tax" },
    {
      sign: "+",
      label: plan.flatRate ? "Cuota de autónomos (tarifa plana)" : "Cuota de autónomos",
      value: quote.socialSecurity,
      tone: "ss",
    },
    { sign: "+", label: "Gastos del negocio", value: quote.expenses, tone: "exp" },
  ];

  return (
    <section className="ledger" aria-labelledby="ledger-title">
      <h2 id="ledger-title" className="col-title">
        La cuenta <span>al mes</span>
      </h2>

      <dl className="lines">
        {lines.map((l) => (
          <div key={l.label} className="line">
            <dt>
              <span className="sign" aria-hidden="true">
                {l.sign}
              </span>
              <span className={`swatch ${l.tone}`} aria-hidden="true" />
              {l.label}
            </dt>
            <dd>{eur(l.value / 12)}</dd>
          </div>
        ))}
        <div className="line total">
          <dt>
            <span className="sign" aria-hidden="true">
              =
            </span>
            Tienes que facturar
            <small>{eur(quote.revenue)} al año, sin IVA</small>
          </dt>
          <dd>{eur(quote.revenue / 12)}</dd>
        </div>
      </dl>

      <div className="split" role="img" aria-label="Reparto de lo que facturas">
        {lines.map((l) => (
          <span key={l.tone} className={l.tone} style={{ flexGrow: Math.max(0, l.value) }} />
        ))}
      </div>

      <dl className="lines">
        <div className="line">
          <dt>
            <span className="sign" aria-hidden="true">
              ÷
            </span>
            Horas que facturas
            <small>
              {num(quote.billableHours)} al año en {quote.workingDays} días de trabajo ({quote.holidays.total} festivos
              y {plan.vacationWeeks * 5} de vacaciones fuera)
            </small>
          </dt>
          <dd>{num(monthlyHours)} h</dd>
        </div>
      </dl>

      <div className="price" aria-live="polite">
        <p className="price-label">Tu precio por hora</p>
        <p className="price-value">
          {eurCents(hourly)}
          <span>sin IVA</span>
        </p>
        <p className="price-day">
          {eur(quote.daily)} por jornada de 8 horas · {eur(quote.daily * 5)} por semana completa
        </p>
      </div>

      <WhatIf plan={plan} suggested={quote.hourly} />
    </section>
  );
}

// Para quien ya tiene un precio en la cabeza y quiere saber si le sale a cuenta.
function WhatIf({ plan, suggested }: { plan: Plan; suggested: number }) {
  const id = useId();
  const [hourly, setHourly] = useState(25);
  const monthly = netFromHourly(hourly, plan).net / 12;
  const diff = monthly - plan.netMonthly;

  return (
    <div className="whatif">
      <p>
        <label htmlFor={id}>Si cobras</label>{" "}
        <span className="amount-input inline">
          <input
            id={id}
            type="number"
            inputMode="decimal"
            min={0}
            step={1}
            value={hourly}
            onChange={(e) => setHourly(Math.max(0, e.target.valueAsNumber || 0))}
          />
          <span className="unit">€/h</span>
        </span>{" "}
        te quedan <strong>{eur(monthly)} al mes</strong>
        {Math.abs(diff) >= 1 && (
          <span className={diff < 0 ? "short" : "over"}>
            {" "}
            ({diff < 0 ? "−" : "+"}
            {eur(Math.abs(diff))})
          </span>
        )}
        .
      </p>
      {diff < 0 && (
        <button type="button" className="text-btn" onClick={() => setHourly(Math.ceil(suggested))}>
          Probar con {eur(Math.ceil(suggested))}/h
        </button>
      )}
    </div>
  );
}
