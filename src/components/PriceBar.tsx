import { eurCents } from "../lib/format";

// Solo en móvil: mientras rellenas el formulario, el precio queda a la vista abajo.
export function PriceBar({ hourly, hidden }: { hourly: number; hidden: boolean }) {
  return (
    <a
      className={`pricebar${hidden ? " is-hidden" : ""}`}
      href="#ledger-title"
      aria-hidden={hidden}
      tabIndex={hidden ? -1 : 0}
    >
      <span>Tu precio</span>
      <strong>{eurCents(hourly)}/h</strong>
      <span className="pricebar-go">Ver la cuenta</span>
    </a>
  );
}
