import React from 'react';

export default function SectionHead({
  eyebrow,
  title,
  desc,
  code,
  archive = 'ARCHIVE / 2025'
}) {
  return (
    <div className="section-head">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      <div className="plate-code">
        <span>PLATE</span>
        <b>{code}</b>
        <small>{archive}</small>
      </div>
    </div>
  );
}
