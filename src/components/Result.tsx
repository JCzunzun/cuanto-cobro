import { useTween } from "../hooks/useTween";
import { eur, eurCents, num } from "../lib/format";
import type { Quote } from "../lib/tax";

const PARTS = [
  { key: "net", label: "Para ti", className: "seg-net" },
  { key: "incomeTax", label: "IRPF", className: "seg-tax" },
  { key: "socialSecurity", label: "Cuota de autónomos", className: "seg-ss" },
  { key: "expenses", label: "Gastos", className: "seg-exp" },
] as const;

export function Result({ quote }: { quote: Quote }) {
  const hourly = useTween(quote.hourly);

  return (
    <div className="result" aria-live="polite">
      <p className="result-label">Necesitas cobrar como mínimo</p>
      <p className="result-rate">
        <span className="result-amount">{eurCents(hourly)}</span>
        <span className="result-per">/ hora</span>
      </p>
      <p className="result-vat">sin IVA</p>

      <dl className="result-grid">
        <div>
          <dt>Por jornada de 8 h</dt>
          <dd>{eur(quote.daily)}</dd>
        </div>
        <div>
          <dt>Facturación al mes</dt>
          <dd>{eur(quote.revenue / 12)}</dd>
        </div>
        <div>
          <dt>Facturación al año</dt>
          <dd>{eur(quote.revenue)}</dd>
        </div>
        <div>
          <dt>Horas facturables al año</dt>
          <dd>{num(quote.billableHours)}</dd>
        </div>
      </dl>

      <h3 className="split-title">A dónde va cada euro que facturas</h3>
      <div className="split-bar" role="img" aria-label="Reparto de la facturación anual">
        {PARTS.map((p) => (
          <span key={p.key} className={p.className} style={{ flexGrow: Math.max(0, quote[p.key]) }} />
        ))}
      </div>
      <ul className="split-legend">
        {PARTS.map((p) => (
          <li key={p.key}>
            <span className={`dot ${p.className}`} aria-hidden="true" />
            <span className="legend-name">{p.label}</span>
            <span className="legend-value">
              {eur(quote[p.key] / 12)}
              <small>/mes</small>
            </span>
            <span className="legend-pct">{Math.round((quote[p.key] / quote.revenue) * 100)} %</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
