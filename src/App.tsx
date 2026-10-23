import { useEffect, useMemo, useRef, useState } from "react";
import { FaqList } from "./components/FaqList";
import { Figures } from "./components/Figures";
import { Hero } from "./components/Hero";
import { Ledger } from "./components/Ledger";
import { PlanForm } from "./components/PlanForm";
import { PriceBar } from "./components/PriceBar";
import { DEFAULT_PLAN } from "./lib/defaults";
import { quote } from "./lib/tax";

export default function App() {
  const [plan, setPlan] = useState(DEFAULT_PLAN);
  const result = useMemo(() => quote(plan), [plan]);
  const ledger = useRef<HTMLDivElement>(null);
  const [ledgerVisible, setLedgerVisible] = useState(true);

  useEffect(() => {
    const el = ledger.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setLedgerVisible(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <a href="https://camilab.es" className="brand">
            camilab
          </a>
          <a href="https://verifactu.camilab.es">¿Me toca Verifactu?</a>
        </div>
      </div>
      <Hero />
      <main>
        <section className="calc" aria-label="Calculadora">
          <div className="wrap calc-grid">
            <PlanForm plan={plan} onChange={setPlan} />
            <div ref={ledger} className="calc-result">
              <Ledger plan={plan} quote={result} />
            </div>
          </div>
        </section>
        <Figures />
        <FaqList />
      </main>
      <footer className="footer">
        <div className="wrap">
          <p>
            Calculadora orientativa. No sustituye el consejo de tu asesor fiscal. Lo que escribes no sale de tu
            navegador.
          </p>
          <p>
            Hecho por Juan Camilo Zúñiga · <a href="https://camilab.es">camilab.es</a>
          </p>
        </div>
      </footer>
      <PriceBar hourly={result.hourly} hidden={ledgerVisible} />
    </>
  );
}
