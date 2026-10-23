import { REVIEWED_ON } from "../config";

export function Hero() {
  return (
    <header className="hero">
      <div className="wrap">
        <h1>
          ¿Cuánto cobrar por hora <span>como autónomo?</span>
        </h1>
        <p className="lede">
          Pon lo que quieres que te quede limpio cada mes. La cuenta suma el IRPF, la cuota de autónomos y tus gastos, y
          lo reparte entre las horas que de verdad puedes facturar.
        </p>
        <p className="stamp">Cifras de 2026 · revisadas el {REVIEWED_ON}</p>
      </div>
    </header>
  );
}
