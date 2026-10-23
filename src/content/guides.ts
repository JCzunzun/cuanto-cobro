import { DEFAULT_PLAN } from "../lib/defaults";
import { eur, eurCents, num } from "../lib/format";
import { HOLIDAY_YEAR } from "../lib/holidays";
import { FLAT_RATE_MONTHLY, SS_BRACKETS, SS_RATE, quote } from "../lib/tax";

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  list?: string[];
  table?: { caption: string; head: string[]; rows: string[][] };
}

export interface Guide {
  slug: string;
  metaTitle: string;
  description: string;
  title: string;
  intro: string;
  sections: GuideSection[];
  faqs: { q: string; a: string }[];
}

export const GUIDES_UPDATED = "2026-10-23";

const percent = (n: number) => `${(n * 100).toLocaleString("es-ES", { maximumFractionDigits: 1 })} %`;

// Tabla de tramos a partir de los mismos datos que usa la calculadora.
const quotaRows = SS_BRACKETS.map((b, i) => {
  const from = i === 0 ? 0 : SS_BRACKETS[i - 1].upTo;
  const range =
    i === 0
      ? `Hasta ${num(b.upTo)} €`
      : b.upTo === Infinity
        ? `Más de ${num(from)} €`
        : `De ${num(from)} a ${num(b.upTo)} €`;
  const name = i < 3 ? `Reducida ${i + 1}` : `General ${i - 2}`;
  return [name, range, eurCents(b.minBase), eurCents(b.minBase * SS_RATE)];
});

const example = quote(DEFAULT_PLAN);
const exampleHours = num(example.billableHours);

export const GUIDES: Guide[] = [
  {
    slug: "cuota-autonomos-2026",
    metaTitle: "Cuota de autónomos 2026: tabla de tramos y cuánto pagas",
    description:
      "Tabla oficial de tramos de la cuota de autónomos en 2026: rendimientos netos, base mínima y cuota mensual. Cómo se calcula tu tramo y cuándo se regulariza.",
    title: "Cuota de autónomos 2026",
    intro: `Desde 2023 la cuota de autónomos depende de lo que ganas. En 2026 hay 15 tramos y la cuota mínima va de ${eur(SS_BRACKETS[0].minBase * SS_RATE)} a ${eur(SS_BRACKETS[SS_BRACKETS.length - 1].minBase * SS_RATE)} al mes.`,
    sections: [
      {
        heading: "Cómo se calcula",
        paragraphs: [
          `Según tus rendimientos netos mensuales previstos te corresponde un tramo, y cada tramo tiene una base mínima y una máxima. Tú eliges la base dentro de ese margen y pagas el ${percent(SS_RATE)} de ella. Casi todo el mundo elige la mínima.`,
          "Ese porcentaje incluye contingencias comunes, contingencias profesionales, cese de actividad, formación profesional y el mecanismo de equidad intergeneracional (MEI).",
        ],
      },
      {
        heading: "Tabla de tramos 2026",
        paragraphs: [],
        table: {
          caption: "Rendimientos netos mensuales, base mínima y cuota mínima en 2026",
          head: ["Tramo", "Rendimientos netos al mes", "Base mínima", "Cuota mínima"],
          rows: quotaRows,
        },
      },
      {
        heading: "Qué cuenta como rendimiento neto",
        paragraphs: [
          "Tus ingresos menos tus gastos deducibles, a lo que se suma la propia cuota de autónomos y se le resta un 7 % en concepto de gastos genéricos. El resultado anual se divide entre 12 para saber el tramo.",
        ],
      },
      {
        heading: "Si te equivocas de tramo",
        paragraphs: [
          "Puedes cambiar de tramo hasta seis veces al año, según cómo vaya tu actividad. Al año siguiente, la Seguridad Social cruza tus datos con los de Hacienda y regulariza: si pagaste de menos te reclama la diferencia y si pagaste de más te la devuelve.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Cuál es la cuota mínima de autónomos en 2026?",
        a: `En el tramo más bajo, con rendimientos de hasta 670 € al mes, unos ${eur(SS_BRACKETS[0].minBase * SS_RATE)} al mes. Si es tu primer año, puedes pagar la tarifa plana de ${FLAT_RATE_MONTHLY} €.`,
      },
      {
        q: "¿Qué porcentaje se paga de cuota de autónomos en 2026?",
        a: `El ${percent(SS_RATE)} de la base de cotización que elijas dentro de tu tramo.`,
      },
    ],
  },
  {
    slug: "tarifa-plana-autonomos",
    metaTitle: `Tarifa plana de autónomos: ${FLAT_RATE_MONTHLY} € al mes, requisitos y duración`,
    description: `La tarifa plana permite pagar ${FLAT_RATE_MONTHLY} € al mes de cuota durante el primer año como autónomo. Quién puede pedirla, cuánto dura y qué pasa después.`,
    title: "Tarifa plana de autónomos",
    intro: `Si te das de alta como autónomo por primera vez, durante los primeros 12 meses puedes pagar una cuota fija de ${FLAT_RATE_MONTHLY} € al mes, ganes lo que ganes.`,
    sections: [
      {
        heading: "Quién puede pedirla",
        paragraphs: ["Tienes derecho si cumples estas condiciones:"],
        list: [
          "No has estado de alta como autónomo en los dos años anteriores (tres si ya disfrutaste antes de la tarifa plana).",
          "La solicitas en el momento de darte de alta.",
        ],
      },
      {
        heading: "Cuánto dura",
        paragraphs: [
          "12 meses. Si en el segundo año tus rendimientos netos siguen por debajo del salario mínimo interprofesional, puedes alargarla otros 12 meses.",
          "Algunas comunidades autónomas tienen ayudas que devuelven parte o toda la cuota durante el primer año. Merece la pena consultar las de la tuya.",
        ],
      },
      {
        heading: "Qué pasa después",
        paragraphs: [
          "Pasas a cotizar por el tramo que corresponda a tus rendimientos. Es el salto que más sorprende: de 80 € a 300 o 400 € al mes en cuanto la actividad va bien. Conviene tenerlo en cuenta al poner precio desde el primer día.",
        ],
      },
    ],
    faqs: [
      {
        q: "¿Cuánto es la tarifa plana de autónomos?",
        a: `${FLAT_RATE_MONTHLY} € al mes durante los primeros 12 meses.`,
      },
      {
        q: "¿Se puede alargar la tarifa plana?",
        a: "Sí, otros 12 meses, si tus rendimientos netos del primer año quedan por debajo del salario mínimo interprofesional.",
      },
    ],
  },
  {
    slug: "como-calcular-tarifa-autonomo",
    metaTitle: "Cómo calcular tu tarifa por hora como autónomo (con ejemplo)",
    description:
      "El método para poner precio a tu hora como autónomo: parte de lo que quieres ganar, suma impuestos, cuota y gastos, y divide entre las horas que puedes facturar.",
    title: "Cómo calcular tu tarifa por hora",
    intro:
      "El error más común es poner precio mirando a la competencia o dividir el sueldo que quieres entre 160 horas. Así se acaba trabajando más por menos. El cálculo correcto se hace al revés.",
    sections: [
      {
        heading: "1. Parte de lo que quieres ganar",
        paragraphs: [
          "Decide cuánto quieres que te quede limpio al mes, como si fuera un sueldo neto. Multiplícalo por 12: es tu objetivo anual.",
        ],
      },
      {
        heading: "2. Suma el IRPF y la cuota",
        paragraphs: [
          "Sobre lo que ganas pagas IRPF, y la cuota de autónomos depende de tus rendimientos. Las dos cosas se influyen entre sí, así que la forma fiable de calcularlas es probar y ajustar hasta que cuadran. Es lo que hace la calculadora.",
        ],
      },
      {
        heading: "3. Suma tus gastos",
        paragraphs: [
          "Todo lo que pagas para poder trabajar: software, equipo, gestoría, coworking, teléfono. Además de sumarse a lo que tienes que facturar, reducen lo que tributas.",
        ],
      },
      {
        heading: "4. Divide entre las horas que puedes facturar",
        paragraphs: [
          "No entre las que trabajas. Una parte de tu semana se va en buscar clientes, presupuestos y papeleo. Quita también vacaciones y festivos de tu provincia: los días que no trabajas no se facturan.",
        ],
      },
      {
        heading: "Un ejemplo",
        paragraphs: [
          `Para que te queden ${eur(DEFAULT_PLAN.netMonthly)} al mes en Madrid, con ${eur(DEFAULT_PLAN.expensesMonthly)} de gastos mensuales, ${DEFAULT_PLAN.billableHoursWeek} horas facturables a la semana, ${DEFAULT_PLAN.vacationWeeks} semanas de vacaciones y los festivos de ${HOLIDAY_YEAR}:`,
        ],
        list: [
          `Tienes que facturar ${eur(example.revenue)} al año, sin IVA.`,
          `De eso, ${eur(example.incomeTax)} son IRPF y ${eur(example.socialSecurity)} cuota de autónomos.`,
          `Facturas ${exampleHours} horas al año.`,
          `Tu precio mínimo: ${eurCents(example.hourly)} la hora.`,
        ],
      },
    ],
    faqs: [
      {
        q: "¿Cómo calculo cuánto cobrar por hora siendo autónomo?",
        a: "Suma lo que quieres ganar al año, el IRPF, la cuota de autónomos y tus gastos, y divide el total entre las horas que de verdad puedes facturar en el año.",
      },
      {
        q: "¿Cuántas horas puede facturar un autónomo al año?",
        a: `Depende de cada caso, pero con 30 horas facturables a la semana, 4 semanas de vacaciones y los festivos de Madrid de ${HOLIDAY_YEAR} salen unas ${exampleHours} horas.`,
      },
    ],
  },
];
