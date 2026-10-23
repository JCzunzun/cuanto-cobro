import { describe, expect, it } from "vitest";
import { PROVINCES, holidaysFor, weekdaysInYear } from "./holidays";
import { regionOf } from "./tax";

describe("festivos 2027", () => {
  it("2027 tiene 261 días de lunes a viernes", () => {
    expect(weekdaysInYear()).toBe(261);
  });

  it("no cuenta los que caen en fin de semana", () => {
    // 1 de mayo y 25 de diciembre de 2027 son sábado.
    const dates = holidaysFor("madrid").weekdayHolidays.map((h) => h.date);
    expect(dates).not.toContain("05-01");
    expect(dates).not.toContain("12-25");
  });

  it("Madrid: 7 nacionales entre semana + 3 autonómicos + 2 locales", () => {
    expect(holidaysFor("madrid").total).toBe(12);
  });

  it("Cataluña no tiene Jueves Santo y la Diada cae en sábado", () => {
    const h = holidaysFor("barcelona");
    const dates = h.weekdayHolidays.map((x) => x.date);
    expect(dates).not.toContain("03-25");
    expect(dates).not.toContain("09-11");
    expect(h.total).toBe(11);
  });

  it("Canarias suma el festivo insular", () => {
    expect(holidaysFor("las-palmas").extra).toBe(1);
  });

  it("hay 52 provincias y cada una apunta a su comunidad", () => {
    expect(PROVINCES).toHaveLength(52);
    expect(new Set(PROVINCES.map((p) => p.id)).size).toBe(52);
    expect(regionOf("madrid")).toBe("madrid");
    expect(regionOf("sevilla")).toBe("other");
  });
});
