import { DEFAULT_PLAN } from "../lib/defaults";
import { eur, eurCents } from "../lib/format";
import { COMMUNITIES, HOLIDAY_YEAR, PROVINCES, holidaysFor, type Province } from "../lib/holidays";
import { quote, regionOf, type Quote } from "../lib/tax";

export const NET_TARGETS = [1500, 2000, 2500, 3000, 4000];

export interface ProvinceData {
  province: Province;
  communityName: string;
  example: Quote;
  byNet: { net: number; hourly: number; revenue: number }[];
  taxNote: string;
  metaTitle: string;
  description: string;
}

function taxNote(p: Province): string {
  if (regionOf(p.id) === "madrid")
    return "El IRPF se calcula con la escala estatal y la autonómica de la Comunidad de Madrid.";
  if (p.community === "pais-vasco" || p.community === "navarra")
    return `${COMMUNITIES[p.community].name} tiene IRPF foral propio. Aquí se usa la escala estatal como aproximación, así que tómalo como orientación.`;
  return `El IRPF se calcula con la escala estatal y una aproximación de la autonómica de ${COMMUNITIES[p.community].name}. En rentas medias la diferencia es pequeña.`;
}

export function provinceData(p: Province): ProvinceData {
  const plan = { ...DEFAULT_PLAN, province: p.id };
  const example = quote(plan);
  return {
    province: p,
    communityName: COMMUNITIES[p.community].name,
    example,
    byNet: NET_TARGETS.map((net) => {
      const q = quote({ ...plan, netMonthly: net });
      return { net, hourly: q.hourly, revenue: q.revenue };
    }),
    taxNote: taxNote(p),
    metaTitle: `Cuánto cobrar por hora como autónomo en ${p.name} (${HOLIDAY_YEAR})`,
    description: `Tarifa mínima por hora para autónomos en ${p.name}, con los ${holidaysFor(p.id).total} festivos de ${HOLIDAY_YEAR}, el IRPF y la cuota. Para ganar ${eur(DEFAULT_PLAN.netMonthly)} limpios al mes: ${eurCents(example.hourly)} la hora.`,
  };
}

export const PROVINCE_PAGES = PROVINCES.map(provinceData);
