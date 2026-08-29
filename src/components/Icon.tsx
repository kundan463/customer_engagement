/**
 * One 24×24 stroke-icon set for the whole page. Data files reference icons
 * by key so the content layer never carries markup.
 */
const P: Record<string, string> = {
  voice: 'M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3ZM5 11a7 7 0 0 0 14 0M12 18v3',
  inbound: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2ZM14 9h6M17 6l3 3-3 3',
  outbound: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2ZM21 9h-6M18 6l-3 3 3 3',
  message: 'M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12Z M8.5 11h.01M12 11h.01M15.5 11h.01',
  brain: 'M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5.8A3 3 0 0 0 7 18a3 3 0 0 0 5 1.5V4.5A3 3 0 0 0 9 4ZM15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5.8A3 3 0 0 1 17 18a3 3 0 0 1-5 1.5',
  revenue: 'M12 2v20M17 6.5A4 4 0 0 0 13 4h-2a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-2a4 4 0 0 1-4-2.5',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z',
  heart: 'M12 20s-7-4.4-7-9.4A4 4 0 0 1 12 8a4 4 0 0 1 7-2.6 4 4 0 0 1 0 5.2C19 15.6 12 20 12 20Z',
  poll: 'M6 20v-6M12 20V6M18 20v-9M3 20h18',
  sparkle: 'M12 3l1.6 4.6L18 9.2l-4.4 1.6L12 15.4l-1.6-4.6L6 9.2l4.4-1.6L12 3ZM18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z',
  tag: 'M3 11.5V4a1 1 0 0 1 1-1h7.5a1 1 0 0 1 .7.3l8.5 8.5a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 12.2a1 1 0 0 1-.3-.7ZM7.5 7.5h.01',
  support: 'M12 3a8 8 0 0 0-8 8v4M20 15v-4a8 8 0 0 0-3-6.2M4 14h1.5a1.5 1.5 0 0 1 1.5 1.5v2A1.5 1.5 0 0 1 5.5 19H4ZM20 14h-1.5a1.5 1.5 0 0 0-1.5 1.5v2a1.5 1.5 0 0 0 1.5 1.5H20ZM17 19v.5a2 2 0 0 1-2 2h-2',
  refresh: 'M20 12a8 8 0 1 1-2.6-5.9M20 4v5h-5',
  calendar: 'M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5ZM4 10h16M8.5 3v4M15.5 3v4',
  filter: 'M3 5h18l-7 8v6l-4 2v-8L3 5Z',
  database: 'M4 6.5C4 4.6 7.6 3 12 3s8 1.6 8 3.5-3.6 3.5-8 3.5-8-1.6-8-3.5ZM4 6.5v11C4 19.4 7.6 21 12 21s8-1.6 8-3.5v-11M4 12c0 1.9 3.6 3.5 8 3.5s8-1.6 8-3.5',
  agent: 'M12 3v2.5M7 6.5h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2ZM9.5 10.5v2M14.5 10.5v2M9 19.5l-1 1.5M15 19.5l1 1.5',
  book: 'M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5ZM5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3',
  flow: 'M6 4h5v4H6zM13 16h5v4h-5zM8.5 8v4a2 2 0 0 0 2 2h5M15.5 8h2.5M15.5 6l2.5 2-2.5 2',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20.5a7.5 7.5 0 0 1 15 0',
  sync: 'M4 8a8 8 0 0 1 13.7-4.5M20 16A8 8 0 0 1 6.3 20.5M4 3.5V8h4.5M20 20.5V16h-4.5',
  cart: 'M3 4h2.2l2 10.5a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L20.5 8H6M10 20h.01M17 20h.01',
  code: 'M9 7l-5 5 5 5M15 7l5 5-5 5',
  box: 'M12 3l8 4v10l-8 4-8-4V7l8-4ZM4 7l8 4 8-4M12 11v10',
  key: 'M14.5 3a6.5 6.5 0 1 0-4.3 11.4L9 15.6H7v2H5v2H3v-2.6l6.2-6.2A6.5 6.5 0 0 0 14.5 3ZM16 7.5h.01',
  log: 'M6 3h9l4 4v14H6ZM15 3v4h4M9 12h7M9 16h5',
  record: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z',
  lock: 'M6 10.5h12v10H6zM8.5 10.5V7a3.5 3.5 0 1 1 7 0v3.5M12 14.5v2.5',
  shield: 'M12 3l7.5 3v5.5c0 4.4-3 8.1-7.5 9.5-4.5-1.4-7.5-5.1-7.5-9.5V6L12 3Z',
  check: 'M12 3l7.5 3v5.5c0 4.4-3 8.1-7.5 9.5-4.5-1.4-7.5-5.1-7.5-9.5V6L12 3ZM9 12l2 2 4-4',
  /* A bare tick. `check` is a shield-with-tick and turns to mush below ~16px. */
  tick: 'M5 12.5l4.5 4.5L19 7',
  server: 'M4 4.5h16v5H4zM4 14.5h16v5H4zM7.5 7h.01M7.5 17h.01M11 7h4M11 17h4',
  phone: 'M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z',
  mail: 'M3 6.5h18v11H3zM3 7l9 6 9-6',
  bolt: 'M13.5 2.5 5 13.5h6l-.5 8L19 10.5h-6l.5-8Z',
  play: 'M8 5.5v13l10.5-6.5L8 5.5Z',
  pause: 'M9 5v14M15 5v14',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5.2l3.2 1.8',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  down: 'M12 5v14M6 13l6 6 6-6',
  plug: 'M9 3v5M15 3v5M7 8h10v3a5 5 0 0 1-10 0V8ZM12 16v5',
}

export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const d = P[name] ?? P.bolt
  return (
    <svg
      className="ico"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {d.split('M').filter(Boolean).map((seg, i) => (
        <path key={i} d={`M${seg.trim()}`} />
      ))}
    </svg>
  )
}
