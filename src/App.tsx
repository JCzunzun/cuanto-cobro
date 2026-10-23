import { useMemo, useState } from "react";
import { FaqList } from "./components/FaqList";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { PlanForm } from "./components/PlanForm";
import { Result } from "./components/Result";
import { ReverseCheck } from "./components/ReverseCheck";
import { DEFAULT_PLAN } from "./lib/defaults";
import { quote } from "./lib/tax";

export default function App() {
  const [plan, setPlan] = useState(DEFAULT_PLAN);
  const result = useMemo(() => quote(plan), [plan]);

  return (
    <>
      <Hero />
      <main>
        <section className="calc" aria-label="Calculadora">
          <div className="wrap calc-grid">
            <div className="card">
              <PlanForm plan={plan} onChange={setPlan} />
            </div>
            <div className="calc-side">
              <div className="card result-card">
                <Result quote={result} />
              </div>
              <div className="card">
                <ReverseCheck plan={plan} suggested={result.hourly} />
              </div>
            </div>
          </div>
        </section>
        <HowItWorks />
        <FaqList />
        <section className="section sibling">
          <div className="wrap">
            <p>
              ¿Facturas con un programa? Mira si te toca adaptarte a Verifactu y cuándo:{" "}
              <a href="https://verifactu.camilab.es">verifactu.camilab.es</a>
            </p>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="wrap">
          <p>
            Calculadora orientativa. No sustituye el consejo de tu asesor fiscal y no tiene en cuenta tu situación
            familiar, otras rentas ni deducciones.
          </p>
          <p>
            Cuota de autónomos según la Orden PJC/297/2026 (bases mínimas de cada tramo, tipo del 31,5 %). IRPF con la
            escala estatal y la de la Comunidad de Madrid, en estimación directa simplificada. Lo que escribes no sale
            de tu navegador.
          </p>
          <p>
            Hecho por Juan Camilo Zúñiga · <a href="https://camilab.es">camilab.es</a>
          </p>
        </div>
      </footer>
    </>
  );
}
