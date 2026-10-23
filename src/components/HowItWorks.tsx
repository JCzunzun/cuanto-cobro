const STEPS = [
  {
    title: "Empiezo por lo que quieres ganar",
    text: "Tu neto mensual por 12 meses. Es lo único que te importa de verdad al final del año.",
  },
  {
    title: "Le sumo el IRPF y la cuota",
    text: "La cuota de autónomos depende de tus rendimientos y el IRPF de la cuota, así que los calculo juntos hasta que cuadran.",
  },
  {
    title: "Le sumo tus gastos",
    text: "Lo que pagas para poder trabajar. También reduce lo que tributas, y eso también lo tengo en cuenta.",
  },
  {
    title: "Lo divido entre las horas que cobras",
    text: "No entre las 40 que trabajas, sino entre las que facturas, quitando las semanas sin trabajar.",
  },
];

export function HowItWorks() {
  return (
    <section className="section" aria-labelledby="how-title">
      <div className="wrap">
        <h2 id="how-title" className="section-title">
          Cómo lo calculo
        </h2>
        <p className="section-lede">Al revés de como suele hacerse: desde tu bolsillo hasta la factura.</p>
        <ol className="how">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="how-n" aria-hidden="true">
                {i + 1}
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
