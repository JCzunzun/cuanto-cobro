import { useEffect, useMemo, useRef, useState } from "react";
import { FaqList } from "./components/FaqList";
import { Figures } from "./components/Figures";
import { Hero } from "./components/Hero";
import { Ledger } from "./components/Ledger";
import { PlanForm } from "./components/PlanForm";
import { PriceBar } from "./components/PriceBar";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { Explore } from "./components/Explore";
import { DEFAULT_PLAN } from "./lib/defaults";
import { quote } from "./lib/tax";
import { planFromSearch, searchFromPlan } from "./lib/urlState";

export default function App() {
  const [plan, setPlan] = useState(() =>
    typeof window === "undefined" ? DEFAULT_PLAN : planFromSearch(window.location.search, DEFAULT_PLAN),
  );
  const result = useMemo(() => quote(plan), [plan]);
  const ledger = useRef<HTMLDivElement>(null);
  const [ledgerVisible, setLedgerVisible] = useState(true);

  useEffect(() => {
    const url = `${window.location.pathname}${searchFromPlan(plan, DEFAULT_PLAN)}${window.location.hash}`;
    window.history.replaceState(null, "", url);
  }, [plan]);

  useEffect(() => {
    const el = ledger.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setLedgerVisible(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <SiteHeader />
      <Hero />
      <main>
        <section className="calc" id="calculadora" aria-label="Calculadora">
          <div className="wrap calc-grid">
            <PlanForm plan={plan} onChange={setPlan} />
            <div ref={ledger} className="calc-result">
              <Ledger plan={plan} quote={result} />
            </div>
          </div>
        </section>
        <Figures />
        <FaqList />
        <Explore />
      </main>
      <SiteFooter />
      <PriceBar hourly={result.hourly} hidden={ledgerVisible} />
    </>
  );
}
