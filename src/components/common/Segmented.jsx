import React from 'react';

export default function Segmented({ values, value, onChange, ariaLabel = 'Seleção' }) {
  return (
    <div className="segmented" role="radiogroup" aria-label={ariaLabel}>
      {values.map((v) => {
        const valStr = typeof v === 'object' ? v.value : v;
        const label = typeof v === 'object' ? v.label : v;
        const isSelected = valStr === value;
        return (
          <button
            key={String(valStr)}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={isSelected ? 'active' : ''}
            onClick={() => onChange(valStr)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
