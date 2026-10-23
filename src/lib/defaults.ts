import type { Plan } from "./tax";

// Un caso típico: alguien que empieza y quiere 2.000 € limpios al mes.
// 30 horas facturables porque el resto se va en comerciales, administración y formación.
// 6 semanas sin facturar: vacaciones, festivos y algún día de baja.
export const DEFAULT_PLAN: Plan = {
  netMonthly: 2000,
  expensesMonthly: 150,
  billableHoursWeek: 30,
  weeksOff: 6,
  region: "madrid",
  flatRate: false,
};
