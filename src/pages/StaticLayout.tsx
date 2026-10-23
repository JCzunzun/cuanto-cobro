import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

interface Crumb {
  href?: string;
  label: string;
}

// Páginas estáticas: se generan al construir y se sirven sin JavaScript.
export function StaticLayout({ crumbs, children }: { crumbs: Crumb[]; children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="page">
        <article className="wrap page-article">
          <nav className="crumbs" aria-label="Ruta">
            {crumbs.map((c, i) => (
              <span key={c.label}>
                {i > 0 && <span aria-hidden="true"> / </span>}
                {c.href ? <a href={c.href}>{c.label}</a> : <span aria-current="page">{c.label}</span>}
              </span>
            ))}
          </nav>
          {children}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

export function CalculatorCta({ href, text }: { href: string; text: string }) {
  return (
    <aside className="cta">
      <p>{text}</p>
      <a className="button" href={href}>
        Abrir la calculadora
      </a>
    </aside>
  );
}
