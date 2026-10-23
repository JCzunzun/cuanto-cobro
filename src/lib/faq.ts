import { DEFAULT_PLAN } from "./defaults";
import { eur, eurCents } from "./format";
import { FLAT_RATE_MONTHLY, monthlySocialSecurity, quote } from "./tax";

export interface Faq {
  id: string;
  q: string;
  a: string;
}

// El ejemplo sale de la propia calculadora, así el texto nunca se queda desfasado.
const example = quote(DEFAULT_PLAN);
const minFee = monthlySocialSecurity(0);
const maxFee = monthlySocialSecurity(Infinity);

export const FAQS: Faq[] = [
  {
    id: "cuanto-hora",
    q: "¿Cuánto debe cobrar un autónomo por hora?",
    a: `Depende de lo que quieras ganar y de cuántas horas puedas facturar de verdad. Por ejemplo, para que te queden ${eur(DEFAULT_PLAN.netMonthly)} limpios al mes en Madrid, con ${eur(DEFAULT_PLAN.expensesMonthly)} de gastos mensuales y ${DEFAULT_PLAN.billableHoursWeek} horas facturables a la semana, necesitas cobrar unos ${eurCents(example.hourly)} la hora, sin IVA.`,
  },
  {
    id: "horas",
    q: "¿Por qué no calculo con 40 horas a la semana?",
    a: "Porque no todas las horas que trabajas se pueden cobrar. Buscar clientes, hacer presupuestos, facturar, formarte o hacer papeleo también es trabajo y nadie te lo paga. Lo normal es poder facturar entre 25 y 32 horas de cada 40.",
  },
  {
    id: "iva",
    q: "¿El precio incluye IVA?",
    a: "No. La tarifa que calcula es la base, sin IVA. Al facturar le sumas el IVA que corresponda (normalmente el 21 %), pero ese dinero no es tuyo: lo ingresas a Hacienda cada trimestre.",
  },
  {
    id: "retencion",
    q: "¿Y la retención del 15 % en las facturas?",
    a: "Si facturas a empresas o a otros autónomos como profesional, te retienen un 15 % (un 7 % el año en que empiezas y los dos siguientes). No es un impuesto extra: es un adelanto del IRPF que luego se descuenta en la declaración de la renta. Por eso no cambia la tarifa que necesitas.",
  },
  {
    id: "cuota",
    q: "¿Cuánto es la cuota de autónomos en 2026?",
    a: `Depende de tus rendimientos netos. Con la base mínima de cada tramo, va desde unos ${eur(minFee)} al mes en el tramo más bajo hasta unos ${eur(maxFee)} en el más alto. La calculadora busca tu tramo automáticamente.`,
  },
  {
    id: "tarifa-plana",
    q: "¿Qué es la tarifa plana?",
    a: `Si te das de alta por primera vez (o hace más de dos años que no eras autónomo), pagas ${FLAT_RATE_MONTHLY} € al mes durante los primeros 12 meses. Si tus rendimientos siguen por debajo del salario mínimo, se puede alargar otros 12 meses.`,
  },
  {
    id: "irpf",
    q: "¿Cómo calcula el IRPF esta calculadora?",
    a: "Supone que tributas en estimación directa simplificada: descuenta tus gastos, la cuota de autónomos y un 5 % de gastos de difícil justificación (hasta 2.000 € al año), aplica el mínimo personal de 5.550 € y la escala estatal más la autonómica. Para Madrid usa su escala; para el resto, una aproximación. No tiene en cuenta hijos, otras rentas ni deducciones, así que el resultado es orientativo.",
  },
];
