import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

// Se usa solo al construir: genera el HTML inicial para que buscadores y vistas
// previas de enlaces vean el contenido sin ejecutar JavaScript.
export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
