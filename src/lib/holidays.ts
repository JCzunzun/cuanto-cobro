// Fiestas laborales de 2027: Resolución de 8 de octubre de 2026 de la Dirección General de Trabajo
// (BOE de 13 de octubre de 2026). Las dos fiestas locales las fija cada ayuntamiento y aún no
// están publicadas, así que se cuentan como dos días laborables más sin facturar.

export const HOLIDAY_YEAR = 2027;
export const LOCAL_HOLIDAYS = 2;

export interface Holiday {
  date: string; // MM-DD
  name: string;
}

const NATIONAL: Holiday[] = [
  { date: "01-01", name: "Año Nuevo" },
  { date: "01-06", name: "Epifanía del Señor" },
  { date: "03-26", name: "Viernes Santo" },
  { date: "05-01", name: "Fiesta del Trabajo" },
  { date: "10-12", name: "Fiesta Nacional de España" },
  { date: "11-01", name: "Todos los Santos" },
  { date: "12-06", name: "Día de la Constitución" },
  { date: "12-08", name: "Inmaculada Concepción" },
  { date: "12-25", name: "Navidad" },
];

const JUEVES_SANTO = { date: "03-25", name: "Jueves Santo" };
const SAN_JOSE = { date: "03-19", name: "San José" };
const LUNES_PASCUA = { date: "03-29", name: "Lunes de Pascua" };
const ASUNCION = { date: "08-16", name: "Lunes siguiente a la Asunción" };

export interface Community {
  name: string;
  holidays: Holiday[];
  // Festivos sin fecha común en toda la comunidad, como el insular de cada isla canaria.
  extra?: { count: number; note: string };
}

export const COMMUNITIES = {
  andalucia: { name: "Andalucía", holidays: [{ date: "03-01", name: "Día de Andalucía" }, JUEVES_SANTO, ASUNCION] },
  aragon: { name: "Aragón", holidays: [JUEVES_SANTO, { date: "04-23", name: "Día de Aragón" }, ASUNCION] },
  asturias: { name: "Asturias", holidays: [JUEVES_SANTO, ASUNCION, { date: "09-08", name: "Día de Asturias" }] },
  baleares: {
    name: "Illes Balears",
    holidays: [{ date: "03-01", name: "Día de les Illes Balears" }, JUEVES_SANTO, LUNES_PASCUA],
  },
  canarias: {
    name: "Canarias",
    holidays: [JUEVES_SANTO, ASUNCION],
    extra: { count: 1, note: "el festivo de tu isla" },
  },
  cantabria: {
    name: "Cantabria",
    holidays: [
      JUEVES_SANTO,
      { date: "07-28", name: "Día de las Instituciones" },
      { date: "09-15", name: "La Bien Aparecida" },
    ],
  },
  "castilla-leon": {
    name: "Castilla y León",
    holidays: [JUEVES_SANTO, { date: "04-23", name: "Fiesta de Castilla y León" }, ASUNCION],
  },
  "castilla-la-mancha": {
    name: "Castilla-La Mancha",
    holidays: [
      JUEVES_SANTO,
      { date: "05-27", name: "Corpus Christi" },
      { date: "05-31", name: "Día de Castilla-La Mancha" },
    ],
  },
  cataluna: {
    name: "Cataluña",
    holidays: [LUNES_PASCUA, { date: "06-24", name: "Sant Joan" }, { date: "09-11", name: "Diada" }],
  },
  valencia: {
    name: "Comunitat Valenciana",
    holidays: [SAN_JOSE, LUNES_PASCUA, { date: "10-09", name: "Día de la Comunitat Valenciana" }],
  },
  extremadura: {
    name: "Extremadura",
    holidays: [
      JUEVES_SANTO,
      { date: "09-08", name: "Día de Extremadura" },
      { date: "10-11", name: "Traslado de la Asunción" },
    ],
  },
  galicia: { name: "Galicia", holidays: [SAN_JOSE, JUEVES_SANTO, { date: "05-17", name: "Día das Letras Galegas" }] },
  madrid: { name: "Comunidad de Madrid", holidays: [SAN_JOSE, JUEVES_SANTO, ASUNCION] },
  murcia: {
    name: "Región de Murcia",
    holidays: [SAN_JOSE, JUEVES_SANTO, { date: "06-09", name: "Día de la Región de Murcia" }],
  },
  navarra: { name: "Navarra", holidays: [SAN_JOSE, JUEVES_SANTO, LUNES_PASCUA] },
  "pais-vasco": {
    name: "País Vasco",
    holidays: [JUEVES_SANTO, LUNES_PASCUA, { date: "10-07", name: "Aniversario del primer Gobierno Vasco" }],
  },
  rioja: { name: "La Rioja", holidays: [JUEVES_SANTO, LUNES_PASCUA, { date: "06-09", name: "Día de La Rioja" }] },
  ceuta: {
    name: "Ceuta",
    holidays: [
      JUEVES_SANTO,
      { date: "05-17", name: "Fiesta del Sacrificio" },
      { date: "08-05", name: "Nuestra Señora de África" },
    ],
  },
  melilla: {
    name: "Melilla",
    holidays: [
      { date: "03-10", name: "Fiesta del Eid al-Fitr" },
      JUEVES_SANTO,
      { date: "05-17", name: "Fiesta del Sacrificio" },
    ],
  },
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

function weekday(mmdd: string): number {
  const [m, d] = mmdd.split("-").map(Number);
  return new Date(Date.UTC(HOLIDAY_YEAR, m - 1, d)).getUTCDay();
}

const isWeekday = (h: Holiday) => {
  const day = weekday(h.date);
  return day !== 0 && day !== 6;
};

// Lunes a viernes del año.
export function weekdaysInYear(): number {
  let count = 0;
  for (let t = Date.UTC(HOLIDAY_YEAR, 0, 1); new Date(t).getUTCFullYear() === HOLIDAY_YEAR; t += 86400000) {
    const day = new Date(t).getUTCDay();
    if (day !== 0 && day !== 6) count++;
  }
  return count;
}

export interface HolidaySummary {
  community: Community;
  // Los que caen en sábado o domingo no quitan días de trabajo, así que no se cuentan.
  weekdayHolidays: Holiday[];
  extra: number;
  local: number;
  total: number;
}

export function holidaysFor(provinceId: string): HolidaySummary {
  const community: Community = COMMUNITIES[findProvince(provinceId).community];
  const weekdayHolidays = [...NATIONAL, ...community.holidays]
    .filter(isWeekday)
    .sort((a, b) => a.date.localeCompare(b.date));
  const extra = community.extra?.count ?? 0;
  return {
    community,
    weekdayHolidays,
    extra,
    local: LOCAL_HOLIDAYS,
    total: weekdayHolidays.length + extra + LOCAL_HOLIDAYS,
  };
}
