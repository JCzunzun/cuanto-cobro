// Cabecera y pie comunes a la calculadora, las guías y las páginas de provincia.
export function SiteHeader() {
  return (
    <div className="topbar">
      <div className="wrap">
        <a href="/" className="brand">
          ¿Cuánto cobrar?
        </a>
        <nav aria-label="Secciones">
          <a href="/guias">Guías</a>
          <a href="/provincias">Por provincia</a>
        </nav>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <p>
          Calculadora orientativa. No sustituye el consejo de tu asesor fiscal. Lo que escribes no sale de tu navegador.
        </p>
        <p>
          Otra herramienta: <a href="https://verifactu.camilab.es">¿Me toca Verifactu?</a> · Hecho por Juan Camilo
          Zúñiga · <a href="https://camilab.es">camilab.es</a>
        </p>
      </div>
    </footer>
  );
}
