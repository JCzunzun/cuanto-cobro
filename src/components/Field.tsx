import { useId, type CSSProperties } from "react";

interface Props {
  label: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
}

// Barra deslizante y campo numérico enlazados: la barra para tantear, el campo para afinar.
export function Field({ label, hint, value, onChange, min, max, step, unit }: Props) {
  const id = useId();
  const progress = ((Math.min(Math.max(value, min), max) - min) / (max - min)) * 100;

  return (
    <div className="field">
      <div className="field-head">
        <label htmlFor={id}>{label}</label>
        <span className="field-input">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            min={min}
            step={step}
            value={Number.isFinite(value) ? value : ""}
            onChange={(e) => onChange(Math.max(0, e.target.valueAsNumber || 0))}
          />
          <span className="unit">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={Math.min(value, max)}
        style={{ "--p": `${progress}%` } as CSSProperties}
        onChange={(e) => onChange(e.target.valueAsNumber)}
      />
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}
