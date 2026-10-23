import { useState } from "react";
import { FAQS } from "../lib/faq";

export function FaqList() {
  const [open, setOpen] = useState<string | null>(FAQS[0].id);

  return (
    <section className="section" aria-labelledby="faq-title">
      <div className="wrap">
        <h2 id="faq-title" className="section-title">
          Preguntas frecuentes
        </h2>
        <div className="faq">
          {FAQS.map((f) => {
            const isOpen = open === f.id;
            return (
              <div key={f.id} className={`faq-item${isOpen ? " open" : ""}`}>
                <h3>
                  <button
                    type="button"
                    id={`faq-btn-${f.id}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${f.id}`}
                    onClick={() => setOpen(isOpen ? null : f.id)}
                  >
                    <span>{f.q}</span>
                    <svg className="chev" viewBox="0 0 20 20" aria-hidden="true">
                      <path
                        d="M5 7.5l5 5 5-5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </h3>
                <div
                  className="faq-panel"
                  id={`faq-panel-${f.id}`}
                  role="region"
                  aria-labelledby={`faq-btn-${f.id}`}
                  inert={!isOpen}
                >
                  <div className="faq-inner">
                    <p>{f.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
