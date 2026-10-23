import { describe, expect, it } from "vitest";
import {
  applyScale,
  incomeTax,
  monthlySocialSecurity,
  netFromHourly,
  quote,
  revenueForNet,
  yearFromRevenue,
  type Plan,
} from "./tax";

const plan: Plan = {
  netMonthly: 2000,
  expensesMonthly: 150,
  billableHoursWeek: 30,
  weeksOff: 6,
  region: "madrid",
  flatRate: false,
};

describe("IRPF", () => {
  it("aplica la escala por tramos", () => {
    expect(applyScale(12450, [{ upTo: 12450, rate: 0.095 }])).toBeCloseTo(1182.75);
  });

  it("calcula 30.000 € en Madrid a mano", () => {
    // Estatal: 3.582,75 - 527,25 del mínimo personal. Madrid: 3.146,93 - 471,75.
    expect(incomeTax(30000, "madrid")).toBeCloseTo(5730.68, 1);
  });

  it("no cobra nada por debajo del mínimo personal", () => {
    expect(incomeTax(5000, "madrid")).toBe(0);
    expect(incomeTax(-300, "other")).toBe(0);
  });

  it("en Madrid se paga menos que con la escala de referencia", () => {
    expect(incomeTax(40000, "madrid")).toBeLessThan(incomeTax(40000, "other"));
  });
});

describe("cuota de autónomos", () => {
  it("usa la base mínima del tramo", () => {
    expect(monthlySocialSecurity(1000)).toBeCloseTo(267.65);
    expect(monthlySocialSecurity(1250)).toBeCloseTo(299.56);
    expect(monthlySocialSecurity(9000)).toBeCloseTo(607.35);
  });

  it("con tarifa plana son 80 € al mes", () => {
    const year = yearFromRevenue(40000, { expensesMonthly: 100, region: "madrid", flatRate: true });
    expect(year.socialSecurity).toBe(960);
  });
});

describe("facturación necesaria", () => {
  it("cuadra: lo que queda es lo que se pidió", () => {
    const year = revenueForNet(24000, plan);
    expect(year.net).toBeGreaterThanOrEqual(24000);
    expect(year.net).toBeLessThan(24010);
    expect(year.revenue - year.expenses - year.socialSecurity - year.incomeTax).toBeCloseTo(year.net);
  });

  it("la tarifa plana reduce lo que hay que facturar", () => {
    const normal = revenueForNet(24000, plan).revenue;
    const flat = revenueForNet(24000, { ...plan, flatRate: true }).revenue;
    expect(flat).toBeLessThan(normal);
  });

  it("reparte la facturación entre las horas facturables", () => {
    const q = quote(plan);
    expect(q.billableHours).toBe(30 * 46);
    expect(q.hourly).toBeCloseTo(q.revenue / 1380);
    expect(q.daily).toBeCloseTo(q.hourly * 8);
  });

  it("ida y vuelta: cobrando la tarifa calculada queda el neto pedido", () => {
    const q = quote(plan);
    expect(netFromHourly(q.hourly, plan).net).toBeGreaterThanOrEqual(24000 - 1);
  });
});
