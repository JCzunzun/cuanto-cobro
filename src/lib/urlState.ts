import { findProvince } from "./holidays";
import type { Plan } from "./tax";

// La calculadora guarda sus valores en la URL para poder compartir un cálculo
// y para que las páginas de provincia abran la calculadora ya configurada.
const KEYS = {
  netMonthly: "neto",
  expensesMonthly: "gastos",
  billableHoursWeek: "horas",
  vacationWeeks: "vacaciones",
  province: "provincia",
  flatRate: "plana",
} as const;

const LIMITS: Partial<Record<keyof Plan, [number, number]>> = {
  netMonthly: [0, 100000],
  expensesMonthly: [0, 50000],
  billableHoursWeek: [1, 80],
  vacationWeeks: [0, 40],
};

export function planFromSearch(search: string, base: Plan): Plan {
  const params = new URLSearchParams(search);
  const plan = { ...base };
  for (const key of ["netMonthly", "expensesMonthly", "billableHoursWeek", "vacationWeeks"] as const) {
    const raw = params.get(KEYS[key]);
    const value = raw === null ? NaN : Number(raw);
    const [min, max] = LIMITS[key]!;
    if (Number.isFinite(value)) plan[key] = Math.min(max, Math.max(min, value));
  }
  const province = params.get(KEYS.province);
  if (province) plan.province = findProvince(province).id;
  if (params.has(KEYS.flatRate)) plan.flatRate = params.get(KEYS.flatRate) === "1";
  return plan;
}

// Solo escribe lo que difiere de los valores por defecto, así la URL queda corta.
export function searchFromPlan(plan: Plan, base: Plan): string {
  const params = new URLSearchParams();
  for (const key of Object.keys(KEYS) as (keyof Plan)[]) {
    if (plan[key] === base[key]) continue;
    params.set(KEYS[key], typeof plan[key] === "boolean" ? (plan[key] ? "1" : "0") : String(plan[key]));
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function calculatorLink(partial: Partial<Plan>, base: Plan): string {
  return `/${searchFromPlan({ ...base, ...partial }, base)}#calculadora`;
}
