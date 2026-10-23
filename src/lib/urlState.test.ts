import { describe, expect, it } from "vitest";
import { DEFAULT_PLAN } from "./defaults";
import { calculatorLink, planFromSearch, searchFromPlan } from "./urlState";

describe("estado en la URL", () => {
  it("sin parámetros deja los valores por defecto", () => {
    expect(planFromSearch("", DEFAULT_PLAN)).toEqual(DEFAULT_PLAN);
    expect(searchFromPlan(DEFAULT_PLAN, DEFAULT_PLAN)).toBe("");
  });

  it("ida y vuelta", () => {
    const plan = { ...DEFAULT_PLAN, netMonthly: 2500, province: "sevilla", flatRate: true };
    expect(planFromSearch(searchFromPlan(plan, DEFAULT_PLAN), DEFAULT_PLAN)).toEqual(plan);
  });

  it("ignora valores raros y provincias que no existen", () => {
    const plan = planFromSearch("?neto=abc&horas=999&provincia=atlantida", DEFAULT_PLAN);
    expect(plan.netMonthly).toBe(DEFAULT_PLAN.netMonthly);
    expect(plan.billableHoursWeek).toBe(80);
    expect(plan.province).toBe("madrid");
  });

  it("el enlace de una provincia abre la calculadora", () => {
    expect(calculatorLink({ province: "sevilla" }, DEFAULT_PLAN)).toBe("/?provincia=sevilla#calculadora");
  });
});
