// Comprueba si el calendario oficial del año que toca planificar está cargado en
// src/lib/holidays.ts. Si falta, escribe `missing=AÑO` para que el workflow abra un aviso.
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../src/lib/holidays.ts", import.meta.url), "utf8");
const block = source.slice(source.indexOf("const OFFICIAL_REGIONAL"));
const loaded = [...block.matchAll(/^ {2}(\d{4}):/gm)].map((m) => Number(m[1]));

// Misma regla que planningYear(): desde el 15 de octubre se planifica el año siguiente.
const now = new Date();
const fromOctober15 = now.getMonth() > 9 || (now.getMonth() === 9 && now.getDate() >= 15);
const year = now.getFullYear() + (fromOctober15 ? 1 : 0);

if (loaded.includes(year)) {
  console.error(`Calendario oficial de ${year} cargado (años: ${loaded.join(", ")}).`);
} else {
  console.error(`Falta el calendario oficial de ${year}.`);
  console.log(`missing=${year}`);
}
