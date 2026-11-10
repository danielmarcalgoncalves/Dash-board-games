import React from 'react';

export default function Icon({ name, size = 16, className = '' }) {
  const paths = {
    scatter: (
      <>
        <circle cx="7" cy="16" r="1.5" />
        <circle cx="11" cy="11" r="1.5" />
        <circle cx="16" cy="7" r="1.5" />
        <path d="M4 4v16h16" />
      </>
    ),
    network: (
      <>
        <circle cx="6" cy="12" r="2.5" />
        <circle cx="17" cy="6" r="2.5" />
        <circle cx="18" cy="18" r="2.5" />
        <path d="m8 11 7-4m-7 6 8 4m1-8v6" />
      </>
    ),
    map: (
      <>
        <path d="m3 6 5-2 8 3 5-2v13l-5 2-8-3-5 2Z" />
        <path d="M8 4v13m8-10v13" />
      </>
    ),
    flow: (
      <>
        <rect x="3" y="4" width="6" height="5" rx="1" />
        <rect x="15" y="15" width="6" height="5" rx="1" />
        <path d="M9 6.5h5a3 3 0 0 1 3 3V15m-3-1 3 2 3-2" />
      </>
    ),
    table: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="1" />
        <path d="M3 9h18M9 4v16M15 4v16" />
      </>
    ),
    gamepad: (
      <>
        <path d="M7 8h10c3 0 5 7 3 9-1.5 1.5-3.5-2-5-2H9c-1.5 0-3.5 3.5-5 2-2-2 0-9 3-9Z" />
        <path d="M8 10v4m-2-2h4m6-1h.01m2 2h.01" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-4-4 4 4 4-4M5 20h14" />
      </>
    ),
    target: (
      <>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
      </>
    ),
    pause: (
      <>
        <path d="M8 5v14M16 5v14" />
      </>
    ),
    play: <path d="m8 5 11 7-11 7Z" />,
    reset: (
      <>
        <path d="M4 9a8 8 0 1 1 1 8" />
        <path d="M4 4v5h5" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    chevronLeft: <path d="m15 18-6-6 6-6" />,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    compass: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </>
    ),
  };

  const path = paths[name] || paths.scatter;

  return (
    <svg
      className={`icon ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {path}
    </svg>
  );
}
