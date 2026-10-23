// En español, Intl no separa los miles en números de cuatro cifras ("3000 €").
// Lo forzamos para que "3.000 €" y "35.994 €" se lean igual en la misma tabla.
const grouping = { useGrouping: "always" } as unknown as Intl.NumberFormatOptions;

const euros = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
  ...grouping,
});
const eurosCents = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  ...grouping,
});
const plain = new Intl.NumberFormat("es-ES", { maximumFractionDigits: 0, ...grouping });

export const eur = (n: number) => euros.format(Math.round(n));
export const eurCents = (n: number) => eurosCents.format(n);
export const num = (n: number) => plain.format(n);
