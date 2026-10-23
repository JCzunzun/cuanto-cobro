import { GUIDES } from "../content/guides";
import { PROVINCES } from "../lib/holidays";

// Enlaces de la portada a las guías y a las páginas de provincia.
export function Explore() {
  return (
    <section className="section" aria-labelledby="explore-title">
      <div className="wrap two-col">
        <div>
          <h2 id="explore-title" className="section-title">
            Para seguir leyendo
          </h2>
          <ul className="link-list">
            {GUIDES.map((g) => (
              <li key={g.slug}>
                <a href={`/${g.slug}`}>{g.title}</a>
                <span>{g.description}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="explore-sub">Tu tarifa por provincia</h3>
          <ul className="chips">
            {PROVINCES.map((p) => (
              <li key={p.id}>
                <a href={`/provincia/${p.id}`}>{p.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
