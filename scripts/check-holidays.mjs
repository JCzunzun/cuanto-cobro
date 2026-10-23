// Comprueba si los calendarios oficiales que hacen falta están cargados en
// src/lib/holidays.ts. Si falta, escribe `missing=AÑO` para que el workflow abra un aviso.
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/lib/holidays.ts", import.meta.url), "utf8");
const block = source.slice(source.indexOf("const OFFICIAL_REGIONAL"));
const loaded = [...block.matchAll(/^ {2}(\d{4}):/gm)].map((m) => Number(m[1]));

// La web planifica el año en curso. Desde el 15 de octubre, cuando el BOE ya ha publicado
// el calendario siguiente, también avisa si falta el del año que viene, para cargarlo con tiempo.
const now = new Date();
const required = [now.getFullYear()];
if (now.getMonth() > 9 || (now.getMonth() === 9 && now.getDate() >= 15)) required.push(now.getFullYear() + 1);

const missing = required.find((year) => !loaded.includes(year));
if (missing) {
  console.error(`Falta el calendario oficial de ${missing}.`);
  console.log(`missing=${missing}`);
} else {
  console.error(`Calendarios oficiales cargados: ${loaded.join(", ")}.`);
}
