/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { FAQS } from "./src/lib/faq";

const SITE = "https://tarifa.camilab.es/";

// Los datos estructurados salen de las mismas preguntas que muestra la página.
function structuredData(): Plugin {
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "Calculadora de tarifa para autónomos",
        url: SITE,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        inLanguage: "es-ES",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
        author: { "@type": "Person", name: "Juan Camilo Zúñiga", url: "https://camilab.es/" },
      },
      {
        "@type": "WebPage",
        "@id": SITE,
        url: SITE,
        name: "¿Cuánto cobrar por hora como autónomo? Calculadora 2026",
        inLanguage: "es-ES",
        dateModified: "2026-10-23",
        primaryImageOfPage: SITE + "og.png",
        isPartOf: { "@type": "WebSite", name: "Camilab", url: "https://camilab.es/" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };
  return {
    name: "structured-data",
    transformIndexHtml: () => [
      { tag: "script", attrs: { type: "application/ld+json" }, children: JSON.stringify(graph), injectTo: "head" },
    ],
  };
}

// `npm run build:single` genera un único index.html autocontenido (útil para demos).
export default defineConfig(({ mode }) => ({
  plugins: [react(), structuredData(), ...(mode === "single" ? [viteSingleFile()] : [])],
  build: mode === "single" ? { outDir: "dist-single" } : undefined,
  test: { environment: "node" },
}));
