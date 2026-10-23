import { REVIEWED_ON } from "../config";

export function Hero() {
  return (
    <header className="hero">
      <div className="wrap">
        <p className="kicker">Calculadora para autónomos · 2026</p>
        <h1>¿Cuánto cobrar por hora como autónomo?</h1>
        <p className="lede">
          Dime cuánto quieres que te quede limpio al mes y te digo cuánto tienes que cobrar, contando el IRPF, la cuota
          de autónomos, tus gastos y las horas que de verdad puedes facturar.
        </p>
        <p className="stamp">Cifras de 2026 revisadas el {REVIEWED_ON}</p>
      </div>
    </header>
  );
}
