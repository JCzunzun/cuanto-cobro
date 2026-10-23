// Festivos por año, comunidad y provincia.
//
// - Los nacionales se calculan para cualquier año: fechas fijas más Viernes Santo,
//   que depende de la Pascua.
// - Los autonómicos se cargan del calendario oficial que publica el BOE cada octubre
//   (OFFICIAL_REGIONAL). Si un año aún no está cargado, se estiman y la web lo avisa.
// - Las dos fiestas locales las fija cada ayuntamiento: se cuentan como dos días más.

export const LOCAL_HOLIDAYS = 2;
// Cada comunidad fija unos tres festivos propios al año (12 en total menos los nacionales).
export const ESTIMATED_REGIONAL = 3;

export interface Holiday {
  date: string; // MM-DD
  name: string;
}

// El calendario del año siguiente se publica a mediados de octubre: desde el 15 de
// octubre la calculadora ya planifica el año que viene.
export function planningYear(now: Date = new Date()): number {
  const year = now.getFullYear();
  const fromOctober15 = now.getMonth() > 9 || (now.getMonth() === 9 && now.getDate() >= 15);
  return fromOctober15 ? year + 1 : year;
}

// Año que usa la web. En el navegador es el del día en que se abre; en el build,
// el del día en que se construye (la web se reconstruye cada semana).
export const HOLIDAY_YEAR = planningYear();

// Domingo de Pascua (algoritmo anónimo gregoriano), como MM-DD.
export function easterSunday(year: number): string {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return mmdd(month, day);
}

function mmdd(month: number, day: number): string {
  return `${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function shift(year: number, date: string, days: number): string {
  const [m, d] = date.split("-").map(Number);
  const t = new Date(Date.UTC(year, m - 1, d + days));
  return mmdd(t.getUTCMonth() + 1, t.getUTCDate());
}

export function nationalHolidays(year: number): Holiday[] {
  return [
    { date: "01-01", name: "Año Nuevo" },
    { date: "01-06", name: "Epifanía del Señor" },
    { date: shift(year, easterSunday(year), -2), name: "Viernes Santo" },
    { date: "05-01", name: "Fiesta del Trabajo" },
    { date: "08-15", name: "Asunción de la Virgen" },
    { date: "10-12", name: "Fiesta Nacional de España" },
    { date: "11-01", name: "Todos los Santos" },
    { date: "12-06", name: "Día de la Constitución" },
    { date: "12-08", name: "Inmaculada Concepción" },
    { date: "12-25", name: "Navidad" },
  ];
}

export interface Community {
  name: string;
  // Festivos sin fecha común en toda la comunidad, como el insular de cada isla canaria.
  extra?: { count: number; note: string };
}

export const COMMUNITIES = {
  andalucia: { name: "Andalucía" },
  aragon: { name: "Aragón" },
  asturias: { name: "Asturias" },
  baleares: { name: "Illes Balears" },
  canarias: { name: "Canarias", extra: { count: 1, note: "el festivo de tu isla" } },
  cantabria: { name: "Cantabria" },
  "castilla-leon": { name: "Castilla y León" },
  "castilla-la-mancha": { name: "Castilla-La Mancha" },
  cataluna: { name: "Cataluña" },
  valencia: { name: "Comunitat Valenciana" },
  extremadura: { name: "Extremadura" },
  galicia: { name: "Galicia" },
  madrid: { name: "Comunidad de Madrid" },
  murcia: { name: "Región de Murcia" },
  navarra: { name: "Navarra" },
  "pais-vasco": { name: "País Vasco" },
  rioja: { name: "La Rioja" },
  ceuta: { name: "Ceuta" },
  melilla: { name: "Melilla" },
} satisfies Record<string, Community>;

export type CommunityId = keyof typeof COMMUNITIES;

export interface Province {
  id: string;
  name: string;
  community: CommunityId;
}

const p = (name: string, community: CommunityId): Province => ({
  id: name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z]+/g, "-"),
  name,
  community,
});

export const PROVINCES: Province[] = [
  p("A Coruña", "galicia"),
  p("Álava", "pais-vasco"),
  p("Albacete", "castilla-la-mancha"),
  p("Alicante", "valencia"),
  p("Almería", "andalucia"),
  p("Asturias", "asturias"),
  p("Ávila", "castilla-leon"),
  p("Badajoz", "extremadura"),
  p("Barcelona", "cataluna"),
  p("Bizkaia", "pais-vasco"),
  p("Burgos", "castilla-leon"),
  p("Cáceres", "extremadura"),
  p("Cádiz", "andalucia"),
  p("Cantabria", "cantabria"),
  p("Castellón", "valencia"),
  p("Ceuta", "ceuta"),
  p("Ciudad Real", "castilla-la-mancha"),
  p("Córdoba", "andalucia"),
  p("Cuenca", "castilla-la-mancha"),
  p("Gipuzkoa", "pais-vasco"),
  p("Girona", "cataluna"),
  p("Granada", "andalucia"),
  p("Guadalajara", "castilla-la-mancha"),
  p("Huelva", "andalucia"),
  p("Huesca", "aragon"),
  p("Illes Balears", "baleares"),
  p("Jaén", "andalucia"),
  p("La Rioja", "rioja"),
  p("Las Palmas", "canarias"),
  p("León", "castilla-leon"),
  p("Lleida", "cataluna"),
  p("Lugo", "galicia"),
  p("Madrid", "madrid"),
  p("Málaga", "andalucia"),
  p("Melilla", "melilla"),
  p("Murcia", "murcia"),
  p("Navarra", "navarra"),
  p("Ourense", "galicia"),
  p("Palencia", "castilla-leon"),
  p("Pontevedra", "galicia"),
  p("Salamanca", "castilla-leon"),
  p("Santa Cruz de Tenerife", "canarias"),
  p("Segovia", "castilla-leon"),
  p("Sevilla", "andalucia"),
  p("Soria", "castilla-leon"),
  p("Tarragona", "cataluna"),
  p("Teruel", "aragon"),
  p("Toledo", "castilla-la-mancha"),
  p("Valencia", "valencia"),
  p("Valladolid", "castilla-leon"),
  p("Zamora", "castilla-leon"),
  p("Zaragoza", "aragon"),
];

export function findProvince(id: string): Province {
  return PROVINCES.find((pr) => pr.id === id) ?? PROVINCES.find((pr) => pr.id === "madrid")!;
}

// Festivos propios de cada comunidad (incluidos los traslados), según el calendario oficial.
// Para añadir un año: copiar el bloque y rellenarlo con la resolución del BOE de octubre.
const OFFICIAL_REGIONAL: Record<number, Record<CommunityId, Holiday[]>> = {
  // Resolución de 8 de octubre de 2026 de la Dirección General de Trabajo (BOE de 13 de octubre de 2026).
  2027: (() => {
    const juevesSanto = { date: "03-25", name: "Jueves Santo" };
    const sanJose = { date: "03-19", name: "San José" };
    const lunesPascua = { date: "03-29", name: "Lunes de Pascua" };
    const asuncion = { date: "08-16", name: "Lunes siguiente a la Asunción" };
    return {
      andalucia: [{ date: "03-01", name: "Día de Andalucía" }, juevesSanto, asuncion],
      aragon: [juevesSanto, { date: "04-23", name: "Día de Aragón" }, asuncion],
      asturias: [juevesSanto, asuncion, { date: "09-08", name: "Día de Asturias" }],
      baleares: [{ date: "03-01", name: "Día de les Illes Balears" }, juevesSanto, lunesPascua],
      canarias: [juevesSanto, asuncion],
      cantabria: [
        juevesSanto,
        { date: "07-28", name: "Día de las Instituciones" },
        { date: "09-15", name: "La Bien Aparecida" },
      ],
      "castilla-leon": [juevesSanto, { date: "04-23", name: "Fiesta de Castilla y León" }, asuncion],
      "castilla-la-mancha": [
        juevesSanto,
        { date: "05-27", name: "Corpus Christi" },
        { date: "05-31", name: "Día de Castilla-La Mancha" },
      ],
      cataluna: [lunesPascua, { date: "06-24", name: "Sant Joan" }, { date: "09-11", name: "Diada" }],
      valencia: [sanJose, lunesPascua, { date: "10-09", name: "Día de la Comunitat Valenciana" }],
      extremadura: [
        juevesSanto,
        { date: "09-08", name: "Día de Extremadura" },
        { date: "10-11", name: "Traslado de la Asunción" },
      ],
      galicia: [sanJose, juevesSanto, { date: "05-17", name: "Día das Letras Galegas" }],
      madrid: [sanJose, juevesSanto, asuncion],
      murcia: [sanJose, juevesSanto, { date: "06-09", name: "Día de la Región de Murcia" }],
      navarra: [sanJose, juevesSanto, lunesPascua],
      "pais-vasco": [juevesSanto, lunesPascua, { date: "10-07", name: "Aniversario del primer Gobierno Vasco" }],
      rioja: [juevesSanto, lunesPascua, { date: "06-09", name: "Día de La Rioja" }],
      ceuta: [
        juevesSanto,
        { date: "05-17", name: "Fiesta del Sacrificio" },
        { date: "08-05", name: "Nuestra Señora de África" },
      ],
      melilla: [
        { date: "03-10", name: "Fiesta del Eid al-Fitr" },
        juevesSanto,
        { date: "05-17", name: "Fiesta del Sacrificio" },
      ],
    };
  })(),
};

export const OFFICIAL_YEARS = Object.keys(OFFICIAL_REGIONAL).map(Number);

export function hasOfficialCalendar(year: number): boolean {
  return year in OFFICIAL_REGIONAL;
}

function weekday(year: number, date: string): number {
  const [m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(year, m - 1, d)).getUTCDay();
}

// Lunes a viernes del año.
export function weekdaysInYear(year: number = HOLIDAY_YEAR): number {
  let count = 0;
  for (let t = Date.UTC(year, 0, 1); new Date(t).getUTCFullYear() === year; t += 86400000) {
    const day = new Date(t).getUTCDay();
    if (day !== 0 && day !== 6) count++;
  }
  return count;
}

export interface HolidaySummary {
  year: number;
  // false: los autonómicos de ese año aún no se han publicado y se estiman.
  official: boolean;
  community: Community;
  // Los que caen en sábado o domingo no quitan días de trabajo, así que no se cuentan.
  weekdayHolidays: Holiday[];
  pendingRegional: number;
  extra: number;
  local: number;
  total: number;
}

export function holidaysFor(provinceId: string, year: number = HOLIDAY_YEAR): HolidaySummary {
  const id = findProvince(provinceId).community;
  const community: Community = COMMUNITIES[id];
  const official = hasOfficialCalendar(year);
  const regional = official ? OFFICIAL_REGIONAL[year][id] : [];

  const byDate = new Map<string, Holiday>();
  for (const h of [...nationalHolidays(year), ...regional]) {
    if (!byDate.has(h.date)) byDate.set(h.date, h);
  }
  const weekdayHolidays = [...byDate.values()]
    .filter((h) => {
      const day = weekday(year, h.date);
      return day !== 0 && day !== 6;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const pendingRegional = official ? 0 : ESTIMATED_REGIONAL;
  const extra = community.extra?.count ?? 0;
  return {
    year,
    official,
    community,
    weekdayHolidays,
    pendingRegional,
    extra,
    local: LOCAL_HOLIDAYS,
    total: weekdayHolidays.length + pendingRegional + extra + LOCAL_HOLIDAYS,
  };
}
