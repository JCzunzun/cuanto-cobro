/* eslint-disable react-refresh/only-export-components -- este módulo solo se usa al construir */
import { StrictMode, type ReactElement } from "react";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
import App from "./App";
import { SITE } from "./config";
import { GUIDES, GUIDES_UPDATED } from "./content/guides";
import { PROVINCE_PAGES } from "./content/provinces";
import { GuidePage } from "./pages/GuidePage";
import { GuidesIndex, ProvincesIndex } from "./pages/IndexPages";
import { ProvincePage } from "./pages/ProvincePage";

// Se usa solo al construir: genera el HTML de cada página para que buscadores y
// vistas previas de enlaces vean el contenido sin ejecutar JavaScript.
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

export interface StaticPage {
  path: string; // URL pública, sin barra final
  file: string; // ruta dentro de dist/
  title: string;
  description: string;
  type: "article" | "website";
  jsonLd: object[];
  html: string;
}

const AUTHOR = { "@type": "Person", name: "Juan Camilo Zúñiga", url: "https://camilab.es/" };
const url = (path: string) => new URL(path.replace(/^\//, ""), SITE).href;

function breadcrumb(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: url(it.path),
    })),
  };
}

function faqPage(faqs: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

const page = (el: ReactElement) => renderToStaticMarkup(el);

export function staticPages(): StaticPage[] {
  const guides: StaticPage[] = GUIDES.map((g) => ({
    path: `/${g.slug}`,
    file: `${g.slug}.html`,
    title: g.metaTitle,
    description: g.description,
    type: "article",
    jsonLd: [
      {
        "@type": "Article",
        headline: g.metaTitle,
        description: g.description,
        inLanguage: "es-ES",
        dateModified: GUIDES_UPDATED,
        mainEntityOfPage: url(`/${g.slug}`),
        image: url("/og.png"),
        author: AUTHOR,
        publisher: AUTHOR,
      },
      breadcrumb([
        { name: "Calculadora", path: "/" },
        { name: "Guías", path: "/guias" },
        { name: g.title, path: `/${g.slug}` },
      ]),
      faqPage(g.faqs),
    ],
    html: page(<GuidePage guide={g} />),
  }));

  const provinces: StaticPage[] = PROVINCE_PAGES.map((d) => ({
    path: `/provincia/${d.province.id}`,
    file: `provincia/${d.province.id}.html`,
    title: d.metaTitle,
    description: d.description,
    type: "article",
    jsonLd: [
      {
        "@type": "WebPage",
        name: d.metaTitle,
        description: d.description,
        inLanguage: "es-ES",
        dateModified: GUIDES_UPDATED,
        url: url(`/provincia/${d.province.id}`),
        author: AUTHOR,
      },
      breadcrumb([
        { name: "Calculadora", path: "/" },
        { name: "Por provincia", path: "/provincias" },
        { name: d.province.name, path: `/provincia/${d.province.id}` },
      ]),
    ],
    html: page(<ProvincePage data={d} />),
  }));

  const indexes: StaticPage[] = [
    {
      path: "/provincias",
      file: "provincias.html",
      title: "Cuánto cobrar por hora como autónomo en cada provincia",
      description:
        "Tarifa mínima por hora para autónomos en las 52 provincias de España, con los festivos de cada una, el IRPF y la cuota de autónomos.",
      type: "website",
      jsonLd: [
        breadcrumb([
          { name: "Calculadora", path: "/" },
          { name: "Por provincia", path: "/provincias" },
        ]),
      ],
      html: page(<ProvincesIndex />),
    },
    {
      path: "/guias",
      file: "guias.html",
      title: "Guías para autónomos: cuota, tarifa plana y cómo poner precio",
      description:
        "Guías claras para autónomos: tabla de la cuota de 2026, tarifa plana y cómo calcular tu precio por hora con un ejemplo.",
      type: "website",
      jsonLd: [
        breadcrumb([
          { name: "Calculadora", path: "/" },
          { name: "Guías", path: "/guias" },
        ]),
      ],
      html: page(<GuidesIndex />),
    },
  ];

  return [...indexes, ...guides, ...provinces];
}

export { GUIDES_UPDATED, SITE };
