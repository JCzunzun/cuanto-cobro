import { REVIEWED_ON } from "../config";
import { GUIDES, type Guide } from "../content/guides";
import { CalculatorCta, StaticLayout } from "./StaticLayout";

export function GuidePage({ guide }: { guide: Guide }) {
  const related = GUIDES.filter((g) => g.slug !== guide.slug);

  return (
    <StaticLayout
      crumbs={[{ href: "/", label: "Calculadora" }, { href: "/guias", label: "Guías" }, { label: guide.title }]}
    >
      <h1>{guide.title}</h1>
      <p className="page-intro">{guide.intro}</p>
      <p className="stamp">Revisado el {REVIEWED_ON}</p>

      {guide.sections.map((s) => (
        <section key={s.heading}>
          <h2>{s.heading}</h2>
          {s.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {s.list && (
            <ul>
              {s.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {s.table && (
            <div className="table-scroll">
              <table>
                <caption>{s.table.caption}</caption>
                <thead>
                  <tr>
                    {s.table.head.map((h) => (
                      <th key={h} scope="col">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.table.rows.map((row) => (
                    <tr key={row[0]}>
                      {row.map((cell, i) =>
                        i === 0 ? (
                          <th key={i} scope="row">
                            {cell}
                          </th>
                        ) : (
                          <td key={i}>{cell}</td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}

      <CalculatorCta
        href="/#calculadora"
        text="Pon tus números y la calculadora te dice cuánto cobrar por hora, con tu cuota, tu IRPF y los festivos de tu provincia."
      />

      <section>
        <h2>Preguntas rápidas</h2>
        {guide.faqs.map((f) => (
          <div key={f.q} className="qa">
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
      </section>

      <section className="related">
        <h2>Otras guías</h2>
        <ul className="link-list">
          {related.map((g) => (
            <li key={g.slug}>
              <a href={`/${g.slug}`}>{g.title}</a>
              <span>{g.description}</span>
            </li>
          ))}
        </ul>
      </section>
    </StaticLayout>
  );
}
