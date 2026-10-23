import { findProvince, holidaysFor, weekdaysInYear, type HolidaySummary } from "./holidays";

// Cifras de 2026.
// Cuota de autónomos: Orden PJC/297/2026 (BOE-A-2026-7296), art. 18.
// IRPF: escala estatal del art. 63.1 LIRPF y escala autonómica de la Comunidad de Madrid.

export interface Bracket {
  upTo: number; // límite superior del tramo, en euros
  rate: number; // tipo en tanto por uno
}

// Rendimiento neto mensual (límite superior) → base mínima de cotización.
// Usamos la base mínima porque es la que elige la gran mayoría de autónomos.
export const SS_BRACKETS: { upTo: number; minBase: number }[] = [
  { upTo: 670, minBase: 653.59 },
  { upTo: 900, minBase: 718.95 },
  { upTo: 1166.7, minBase: 849.67 },
  { upTo: 1300, minBase: 950.98 },
  { upTo: 1500, minBase: 960.78 },
  { upTo: 1700, minBase: 960.78 },
  { upTo: 1850, minBase: 1143.79 },
  { upTo: 2030, minBase: 1209.15 },
  { upTo: 2330, minBase: 1274.51 },
  { upTo: 2760, minBase: 1356.21 },
  { upTo: 3190, minBase: 1437.91 },
  { upTo: 3620, minBase: 1519.61 },
  { upTo: 4050, minBase: 1601.31 },
  { upTo: 6000, minBase: 1732.03 },
  { upTo: Infinity, minBase: 1928.1 },
];

// 28,3 comunes + 1,3 profesionales + 0,9 cese de actividad + 0,1 formación + 0,9 MEI.
export const SS_RATE = 0.315;
export const FLAT_RATE_MONTHLY = 80;

// La Seguridad Social descuenta un 7 % de gastos genéricos al calcular el rendimiento computable.
const SS_GENERIC_EXPENSES = 0.07;

// Gastos de difícil justificación en estimación directa simplificada: 5 %, con tope de 2.000 € al año.
const HARD_TO_PROVE_RATE = 0.05;
const HARD_TO_PROVE_CAP = 2000;

const PERSONAL_ALLOWANCE = 5550;

const STATE_SCALE: Bracket[] = [
  { upTo: 12450, rate: 0.095 },
  { upTo: 20200, rate: 0.12 },
  { upTo: 35200, rate: 0.15 },
  { upTo: 60000, rate: 0.185 },
  { upTo: 300000, rate: 0.225 },
  { upTo: Infinity, rate: 0.245 },
];

const MADRID_SCALE: Bracket[] = [
  { upTo: 13362.22, rate: 0.085 },
  { upTo: 19004.63, rate: 0.107 },
  { upTo: 35425.68, rate: 0.128 },
  { upTo: 57320.4, rate: 0.174 },
  { upTo: Infinity, rate: 0.205 },
];

export type Region = "madrid" | "other";

// Para el resto de comunidades usamos la escala estatal duplicada como aproximación:
// cada comunidad tiene la suya y las diferencias en rentas medias son pequeñas.
const REGIONAL_SCALE: Record<Region, Bracket[]> = {
  madrid: MADRID_SCALE,
  other: STATE_SCALE,
};

export function applyScale(amount: number, scale: Bracket[]): number {
  let tax = 0;
  let from = 0;
  for (const { upTo, rate } of scale) {
    if (amount <= from) break;
    tax += (Math.min(amount, upTo) - from) * rate;
    from = upTo;
  }
  return tax;
}

export function incomeTax(taxableIncome: number, region: Region): number {
  const base = Math.max(0, taxableIncome);
  const allowance = Math.min(base, PERSONAL_ALLOWANCE);
  const scales = [STATE_SCALE, REGIONAL_SCALE[region]];
  const tax = scales.reduce((sum, scale) => sum + applyScale(base, scale) - applyScale(allowance, scale), 0);
  return Math.max(0, tax);
}

export function monthlySocialSecurity(computableMonthly: number): number {
  const bracket = SS_BRACKETS.find((b) => computableMonthly <= b.upTo) ?? SS_BRACKETS[SS_BRACKETS.length - 1];
  return round2(bracket.minBase * SS_RATE);
}

export interface Settings {
  expensesMonthly: number;
  region: Region;
  flatRate: boolean;
}

export interface YearResult {
  revenue: number;
  expenses: number;
  socialSecurity: number;
  incomeTax: number;
  net: number;
}

// Lo que queda limpio en un año facturando `revenue` (sin IVA).
export function yearFromRevenue(revenue: number, s: Settings): YearResult {
  const expenses = s.expensesMonthly * 12;
  const margin = revenue - expenses;

  // La cuota depende del rendimiento, y el rendimiento descuenta la cuota.
  // Con unas pocas vueltas el valor se estabiliza.
  let ssMonthly = s.flatRate ? FLAT_RATE_MONTHLY : monthlySocialSecurity((margin * (1 - SS_GENERIC_EXPENSES)) / 12);
  let taxable = 0;
  for (let i = 0; i < 6; i++) {
    const beforeHardToProve = margin - ssMonthly * 12;
    const hardToProve = Math.min(Math.max(0, beforeHardToProve) * HARD_TO_PROVE_RATE, HARD_TO_PROVE_CAP);
    taxable = beforeHardToProve - hardToProve;
    if (s.flatRate) break;
    const computable = (taxable + ssMonthly * 12) * (1 - SS_GENERIC_EXPENSES);
    ssMonthly = monthlySocialSecurity(computable / 12);
  }

  const socialSecurity = ssMonthly * 12;
  const tax = incomeTax(taxable, s.region);
  return {
    revenue,
    expenses,
    socialSecurity,
    incomeTax: tax,
    net: revenue - expenses - socialSecurity - tax,
  };
}

// Facturación anual mínima para que te quede `targetNet` limpio.
// Al cambiar de tramo la cuota sube de golpe, así que el neto no crece de forma perfectamente
// continua: buscamos por bisección y luego afinamos euro a euro hacia abajo.
export function revenueForNet(targetNet: number, s: Settings): YearResult {
  let lo = s.expensesMonthly * 12;
  let hi = lo + targetNet * 3 + 20000;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (yearFromRevenue(mid, s).net >= targetNet) hi = mid;
    else lo = mid;
  }
  return yearFromRevenue(Math.ceil(hi), s);
}

export interface Plan {
  netMonthly: number;
  expensesMonthly: number;
  billableHoursWeek: number;
  vacationWeeks: number;
  province: string;
  flatRate: boolean;
}

export interface Quote extends YearResult {
  workingDays: number;
  holidays: HolidaySummary;
  billableHours: number;
  hourly: number;
  daily: number;
}

export const HOURS_PER_DAY = 8;

// Solo Madrid tiene su escala autonómica cargada; el resto usa la aproximación.
export function regionOf(provinceId: string): Region {
  return findProvince(provinceId).community === "madrid" ? "madrid" : "other";
}

function settingsOf(p: Plan): Settings {
  return { expensesMonthly: p.expensesMonthly, region: regionOf(p.province), flatRate: p.flatRate };
}

// Días que de verdad trabajas: lunes a viernes, menos festivos entre semana y vacaciones.
export function workingDays(p: Pick<Plan, "vacationWeeks" | "province">): number {
  return Math.max(1, weekdaysInYear() - holidaysFor(p.province).total - p.vacationWeeks * 5);
}

export function billableHoursPerYear(p: Pick<Plan, "billableHoursWeek" | "vacationWeeks" | "province">): number {
  return Math.max(1, (workingDays(p) * p.billableHoursWeek) / 5);
}

export function quote(p: Plan): Quote {
  const year = revenueForNet(p.netMonthly * 12, settingsOf(p));
  const billableHours = billableHoursPerYear(p);
  const hourly = year.revenue / billableHours;
  return {
    ...year,
    workingDays: workingDays(p),
    holidays: holidaysFor(p.province),
    billableHours,
    hourly,
    daily: hourly * HOURS_PER_DAY,
  };
}

// El camino inverso: si cobro `hourly` €/h, ¿cuánto me queda al año?
export function netFromHourly(hourly: number, p: Plan): YearResult {
  return yearFromRevenue(hourly * billableHoursPerYear(p), settingsOf(p));
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
