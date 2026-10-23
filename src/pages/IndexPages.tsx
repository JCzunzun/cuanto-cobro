import { GUIDES } from "../content/guides";
import { COMMUNITIES, PROVINCES, type CommunityId } from "../lib/holidays";
import { StaticLayout } from "./StaticLayout";

export const GROUPED_PROVINCES = (Object.keys(COMMUNITIES) as CommunityId[])
  .map((id) => ({ id, name: COMMUNITIES[id].name, provinces: PROVINCES.filter((p) => p.community === id) }))
  .sort((a, b) => a.name.localeCompare(b.name, "es"));

export function ProvincesIndex() {
  return (
    <StaticLayout crumbs={[{ href: "/", label: "Calculadora" }, { label: "Por provincia" }]}>
      <h1>
        Cuánto cobrar como autónomo, <span>por provincia</span>
      </h1>
      <p className="page-intro">
        Cada provincia tiene sus festivos, y eso cambia las horas que puedes facturar. Elige la tuya para ver tu tarifa
        mínima por hora y el calendario de días sin facturar.
      </p>
      <div className="province-groups">
        {GROUPED_PROVINCES.map((g) => (
          <section key={g.id}>
            <h2>{g.name}</h2>
            <ul>
              {g.provinces.map((p) => (
                <li key={p.id}>
                  <a href={`/provincia/${p.id}`}>{p.name}</a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </StaticLayout>
  );
}

export function GuidesIndex() {
  return (
    <StaticLayout crumbs={[{ href: "/", label: "Calculadora" }, { label: "Guías" }]}>
      <h1>
        Guías para <span>autónomos</span>
      </h1>
      <p className="page-intro">Lo que conviene saber antes de poner precio a tu trabajo, explicado sin rodeos.</p>
      <ul className="link-list big">
        {GUIDES.map((g) => (
          <li key={g.slug}>
            <a href={`/${g.slug}`}>{g.title}</a>
            <span>{g.description}</span>
          </li>
        ))}
      </ul>
    </StaticLayout>
  );
}
