// Inserta en dist/index.html el HTML de la calculadora, para que no llegue vacío.
import { readFile, rm, writeFile } from "node:fs/promises";

const { render } = await import("../dist-ssr/entry-server.js");
const file = new URL("../dist/index.html", import.meta.url);
const html = await readFile(file, "utf8");
const marker = '<div id="root"></div>';
if (!html.includes(marker)) throw new Error("No se encontró el contenedor #root en dist/index.html");

await writeFile(file, html.replace(marker, `<div id="root">${render()}</div>`));
await rm(new URL("../dist-ssr", import.meta.url), { recursive: true, force: true });
console.log("Prerender listo");
