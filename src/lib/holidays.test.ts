import { describe, expect, it } from "vitest";
import { PROVINCES, easterSunday, hasOfficialCalendar, holidaysFor, planningYear, weekdaysInYear } from "./holidays";
import { regionOf } from "./tax";

describe("año que se planifica", () => {
  it("hasta el 14 de octubre, el año en curso", () => {
    expect(planningYear(new Date(2027, 9, 14))).toBe(2027);
    expect(planningYear(new Date(2027, 0, 1))).toBe(2027);
  });

  it("desde el 15 de octubre, el siguiente", () => {
    expect(planningYear(new Date(2026, 9, 15))).toBe(2027);
    expect(planningYear(new Date(2026, 11, 31))).toBe(2027);
  });
});

describe("Pascua", () => {
  it("coincide con las fechas conocidas", () => {
    expect(easterSunday(2026)).toBe("04-05");
    expect(easterSunday(2027)).toBe("03-28");
    expect(easterSunday(2028)).toBe("04-16");
    expect(easterSunday(2030)).toBe("04-21");
  });
});

describe("festivos 2027 (oficiales)", () => {
  it("2027 tiene 261 días de lunes a viernes", () => {
    expect(weekdaysInYear(2027)).toBe(261);
  });

  it("no cuenta los que caen en fin de semana", () => {
    // 1 de mayo, 15 de agosto y 25 de diciembre de 2027 caen en fin de semana.
    const dates = holidaysFor("madrid", 2027).weekdayHolidays.map((h) => h.date);
    expect(dates).not.toContain("05-01");
    expect(dates).not.toContain("08-15");
    expect(dates).not.toContain("12-25");
  });

  it("Madrid: 7 nacionales entre semana + 3 autonómicos + 2 locales", () => {
    const h = holidaysFor("madrid", 2027);
    expect(h.official).toBe(true);
    expect(h.total).toBe(12);
  });

  it("Cataluña no tiene Jueves Santo y la Diada cae en sábado", () => {
    const h = holidaysFor("barcelona", 2027);
    const dates = h.weekdayHolidays.map((x) => x.date);
    expect(dates).not.toContain("03-25");
    expect(dates).not.toContain("09-11");
    expect(h.total).toBe(11);
  });

  it("Canarias suma el festivo insular", () => {
    expect(holidaysFor("las-palmas", 2027).extra).toBe(1);
  });
});

describe("años sin calendario oficial", () => {
  it("calcula los nacionales y estima los autonómicos", () => {
    expect(hasOfficialCalendar(2028)).toBe(false);
    const h = holidaysFor("madrid", 2028);
    expect(h.official).toBe(false);
    expect(h.pendingRegional).toBe(3);
    // Viernes Santo de 2028: 14 de abril.
    expect(h.weekdayHolidays.map((x) => x.date)).toContain("04-14");
    expect(h.total).toBe(h.weekdayHolidays.length + 3 + 2);
  });
});

describe("provincias", () => {
  it("hay 52 y cada una apunta a su comunidad", () => {
    expect(PROVINCES).toHaveLength(52);
    expect(new Set(PROVINCES.map((p) => p.id)).size).toBe(52);
    expect(regionOf("madrid")).toBe("madrid");
    expect(regionOf("sevilla")).toBe("other");
  });
});
