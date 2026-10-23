import { DEFAULT_PLAN } from "../lib/defaults";
import { eur, eurCents, num } from "../lib/format";
import { HOLIDAY_YEAR, PROVINCES, holidaysFor } from "../lib/holidays";
import { calculatorLink } from "../lib/urlState";
import type { ProvinceData } from "../content/provinces";
import { CalculatorCta, StaticLayout } from "./StaticLayout";

const dateFormat = new Intl.DateTimeFormat("es-ES", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const formatDate = (mmdd: string) => {
  const [m, d] = mmdd.split("-").map(Number);
  return dateFormat.format(new Date(Date.UTC(HOLIDAY_YEAR, m - 1, d)));
};

export function ProvincePage({ data }: { data: ProvinceData }) {
  const { province, example, communityName } = data;
  const holidays = holidaysFor(province.id);
  const neighbours = PROVINCES.filter((p) => p.community === province.community && p.id !== province.id);

  return (
    <StaticLayout
      crumbs={[
        { href: "/", label: "Calculadora" },
        { href: "/provincias", label: "Por provincia" },
        { label: province.name },
      ]}
    >
      <h1>
        ¿Cuánto cobrar por hora como autónomo en <span>{province.name}?</span>
      </h1>
      <p className="page-intro">
        Para que te queden {eur(DEFAULT_PLAN.netMonthly)} limpios al mes en {province.name}, con{" "}
        {eur(DEFAULT_PLAN.expensesMonthly)} de gastos y {DEFAULT_PLAN.billableHoursWeek} horas facturables a la semana,
        necesitas cobrar como mínimo <strong>{eurCents(example.hourly)} la hora</strong>, sin IVA.
      </p>

      <section>
        <h2>Tu tarifa según lo que quieras ganar</h2>
        <p>
          Con {DEFAULT_PLAN.vacationWeeks} semanas de vacaciones y los festivos de {province.name} en {HOLIDAY_YEAR}{" "}
          trabajas {example.workingDays} días y facturas unas {num(example.billableHours)} horas al año.
        </p>
        <div className="table-scroll">
          <table>
            <caption>Tarifa mínima por hora en {province.name}, sin IVA</caption>
            <thead>
              <tr>
                <th scope="col">Quieres ganar al mes</th>
                <th scope="col">Facturación al año</th>
                <th scope="col">Precio por hora</th>
              </tr>
            </thead>
            <tbody>
              {data.byNet.map((row) => (
                <tr key={row.net}>
                  <th scope="row">{eur(row.net)}</th>
                  <td>{eur(row.revenue)}</td>
                  <td>
                    <strong>{eurCents(row.hourly)}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="note">{data.taxNote}</p>
      </section>

      <CalculatorCta
        href={calculatorLink({ province: province.id }, DEFAULT_PLAN)}
        text={`Cambia el sueldo, los gastos y las horas: la calculadora ya viene con ${province.name} seleccionada.`}
      />

      <section>
        <h2>
          Festivos de {HOLIDAY_YEAR} en {province.name} que caen entre semana
        </h2>
        <p>
          Son {holidays.total} días en los que no facturas: los nacionales y los de {communityName}, más los dos locales
          de tu ayuntamiento{holidays.extra > 0 ? ` y ${holidays.community.extra?.note}` : ""}.
          {!holidays.official &&
            ` Los ${holidays.pendingRegional} autonómicos de ${HOLIDAY_YEAR} aún no se han publicado y se estiman.`}
        </p>
        <ul className="dates">
          {holidays.weekdayHolidays.map((h) => (
            <li key={h.date}>
              <span>{formatDate(h.date)}</span>
              {h.name}
            </li>
          ))}
        </ul>
      </section>

      {neighbours.length > 0 && (
        <section className="related">
          <h2>Otras provincias de {communityName}</h2>
          <ul className="chips">
            {neighbours.map((p) => (
              <li key={p.id}>
                <a href={`/provincia/${p.id}`}>{p.name}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="all-link">
        <a href="/provincias">Ver todas las provincias</a> · <a href="/guias">Guías para autónomos</a>
      </p>
    </StaticLayout>
  );
}
