import type { Plan } from "./tax";

// Un caso típico: alguien que empieza y quiere 2.000 € limpios al mes.
// 30 horas facturables porque el resto se va en comerciales, administración y formación.
// 4 semanas de vacaciones; los festivos se calculan según la provincia.
export const DEFAULT_PLAN: Plan = {
  netMonthly: 2000,
  expensesMonthly: 150,
  billableHoursWeek: 30,
  vacationWeeks: 4,
  province: "madrid",
  flatRate: false,
};
