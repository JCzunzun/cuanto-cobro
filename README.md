# ¿Cuánto cobrar por hora como autónomo?

Calculadora que parte de lo que quieres ganar limpio al mes y te dice cuánto tienes que cobrar por hora, contando el IRPF, la cuota de autónomos de 2026, tus gastos y las horas que de verdad puedes facturar.

En producción: https://tarifa.camilab.es

## Cómo calcula

- **Cuota de autónomos:** base mínima del tramo de rendimientos (Orden PJC/297/2026) por el 31,5 %. La cuota depende del rendimiento y el rendimiento descuenta la cuota, así que se itera hasta que cuadra.
- **IRPF:** estimación directa simplificada, 5 % de gastos de difícil justificación (máximo 2.000 €), mínimo personal de 5.550 € y escala estatal más la de Madrid. Para otras comunidades se usa la escala estatal duplicada como aproximación.
- **Facturación necesaria:** búsqueda por bisección de la facturación mínima que deja el neto pedido.

Todo se calcula en el navegador. No hay servidor ni se guarda nada.

## Desarrollo

```bash
npm install
npm run dev
npm test
npm run build   # build + pre-renderizado del HTML
```

React 19, TypeScript y Vite. La lógica está en `src/lib/tax.ts` y sus tests en `src/lib/tax.test.ts`.
