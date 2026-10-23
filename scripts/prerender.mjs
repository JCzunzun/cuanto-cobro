// Completa el build estático:
// 1. Inserta en dist/index.html el HTML de la calculadora, para que no llegue vacío.
// 2. Genera una página HTML por cada guía y provincia, con sus metadatos y sin JavaScript.
// 3. Escribe el sitemap con todas las URLs.
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const { render, staticPages, SITE, GUIDES_UPDATED } = await import("../dist-ssr/entry-server.js");
const dist = (path) => new URL(`../dist/${path}`, import.meta.url);

const template = await readFile(dist("index.html"), "utf8");
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error("No se encontró el contenedor #root en dist/index.html");

await writeFile(dist("index.html"), template.replace(marker, `<div id="root">${render()}</div>`));

const escape = (text) => text.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;");
const absolute = (path) => new URL(path.replace(/^\//, ""), SITE).href;

function setTag(html, pattern, value) {
  if (!pattern.test(html)) throw new Error(`No se encontró la etiqueta ${pattern}`);
  return html.replace(pattern, (tag) => tag.replace(/(content|href)="[^"]*"/, `$1="${escape(value)}"`));
}

const pages = staticPages();
for (const page of pages) {
  const jsonLd = { "@context": "https://schema.org", "@graph": page.jsonLd };
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`)
    .replace(
      /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
      () => `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
    )
    .replace(/<script type="module"[^>]*><\/script>/g, "")
    .replace(/<link rel="modulepreload"[^>]*>/g, "")
    .replace(marker, `<div id="root">${page.html}</div>`);
  html = setTag(html, /<meta\s+name="description"[^>]*>/, page.description);
  html = setTag(html, /<link rel="canonical"[^>]*>/, absolute(page.path));
  html = setTag(html, /<meta property="og:url"[^>]*>/, absolute(page.path));
  html = setTag(html, /<meta property="og:title"[^>]*>/, page.title);
  html = setTag(html, /<meta\s+property="og:description"[^>]*>/, page.description);
  html = setTag(html, /<meta property="og:type"[^>]*>/, page.type);

  const file = dist(page.file);
  await mkdir(dirname(fileURLToPath(file)), { recursive: true });
  await writeFile(file, html);
}

const urls = ["/", ...pages.map((p) => p.path)].map(absolute);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>\n    <loc>${u}</loc>\n    <lastmod>${GUIDES_UPDATED}</lastmod>\n  </url>`).join("\n")}
</urlset>
`;
await writeFile(dist("sitemap.xml"), sitemap);

await rm(new URL("../dist-ssr", import.meta.url), { recursive: true, force: true });
console.log(`Prerender listo: portada y ${pages.length} páginas`);
