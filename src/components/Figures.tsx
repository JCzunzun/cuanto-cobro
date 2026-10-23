import { eur } from "../lib/format";
import { FLAT_RATE_MONTHLY, monthlySocialSecurity, SS_RATE } from "../lib/tax";

const percent = (n: number) => `${(n * 100).toLocaleString("es-ES", { maximumFractionDigits: 1 })} %`;

const FIGURES = [
  {
    term: "Cuota de autónomos",
    text: `Base mínima del tramo que te toca según tus rendimientos, por el ${percent(SS_RATE)}. Va de ${eur(monthlySocialSecurity(0))} a ${eur(monthlySocialSecurity(Infinity))} al mes. Con tarifa plana, ${FLAT_RATE_MONTHLY} €.`,
    source: "Orden PJC/297/2026",
  },
  {
    term: "IRPF",
    text: "Escala estatal más la autonómica, sobre lo que ganas después de gastos y cuota. Aplica el mínimo personal de 5.550 € y un 5 % de gastos de difícil justificación, hasta 2.000 € al año.",
    source: "Ley del IRPF, arts. 30 y 63",
  },
  {
    term: "Comunidad",
    text: "Para Madrid uso su escala autonómica. Para el resto, la estatal como aproximación: cada comunidad tiene la suya, pero en rentas medias la diferencia es pequeña.",
    source: "Escala de la Comunidad de Madrid",
  },
  {
    term: "Lo que no cuento",
    text: "Hijos, otras rentas, deducciones autonómicas ni pagos fraccionados. Si tu caso tiene algo de eso, tómalo como punto de partida y habla con tu asesor.",
    source: "",
  },
];

export function Figures() {
  return (
    <section className="section" aria-labelledby="figures-title">
      <div className="wrap two-col">
        <div>
          <h2 id="figures-title" className="section-title">
            Las cifras que uso
          </h2>
          <p className="section-lede">
            La cuota depende de lo que ganas y lo que ganas depende de la cuota, así que la calculadora da vueltas hasta
            que las dos cuadran.
          </p>
        </div>
        <dl className="figures">
          {FIGURES.map((f) => (
            <div key={f.term}>
              <dt>{f.term}</dt>
              <dd>
                {f.text}
                {f.source && <cite>{f.source}</cite>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
