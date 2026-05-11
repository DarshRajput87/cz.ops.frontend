// ─── Design Tokens ──────────────────────────────────────────────────────────
// Single source of truth for design primitives. Mirror of tailwind.config.js
// for use in JS contexts (recharts, dynamic styles, framer-motion variants).

export const colors = {
  surface: {
    DEFAULT:  '#15212B',
    elevated: '#1B2A38',
    sunken:   '#101A23',
    hover:    '#243443',
  },
  primary: {
    DEFAULT: '#9E2532',
    hover:   '#B12C3B',
    pressed: '#7E1D28',
    soft:    'rgba(158,37,50,0.12)',
    border:  'rgba(158,37,50,0.32)',
  },
  border: {
    DEFAULT: 'rgba(255,255,255,0.08)',
    strong:  'rgba(255,255,255,0.16)',
    subtle:  'rgba(255,255,255,0.04)',
  },
  text: {
    primary:   '#FFFFFF',
    secondary: 'rgba(255,255,255,0.72)',
    tertiary:  'rgba(255,255,255,0.48)',
    disabled:  'rgba(255,255,255,0.32)',
  },
  success: { DEFAULT: '#2FA36B', soft: 'rgba(47,163,107,0.12)',  border: 'rgba(47,163,107,0.30)' },
  warning: { DEFAULT: '#D9A441', soft: 'rgba(217,164,65,0.12)',  border: 'rgba(217,164,65,0.30)' },
  danger:  { DEFAULT: '#D64545', soft: 'rgba(214,69,69,0.12)',   border: 'rgba(214,69,69,0.30)' },
}

export const radius = {
  sm:   '4px',
  md:   '6px',
  lg:   '8px',
  xl:   '10px',
  '2xl':'14px',
}

export const shadows = {
  card:     '0 1px 2px rgba(0,0,0,0.20), 0 2px 8px rgba(0,0,0,0.12)',
  elevated: '0 4px 16px rgba(0,0,0,0.28)',
  overlay:  '0 16px 48px rgba(0,0,0,0.46)',
}

// Status → palette mapping for badges, indicators, chips
export const STATUS_PALETTE = {
  // Booking statuses
  scheduled:   { fg: '#9E2532', bg: 'rgba(158,37,50,0.12)',  border: 'rgba(158,37,50,0.32)',  label: 'Scheduled' },
  in_progress: { fg: '#D9A441', bg: 'rgba(217,164,65,0.12)', border: 'rgba(217,164,65,0.30)', label: 'In Progress' },
  completed:   { fg: '#2FA36B', bg: 'rgba(47,163,107,0.12)', border: 'rgba(47,163,107,0.30)', label: 'Completed' },
  cancelled:   { fg: '#D64545', bg: 'rgba(214,69,69,0.12)',  border: 'rgba(214,69,69,0.30)',  label: 'Cancelled' },
  no_show:     { fg: 'rgba(255,255,255,0.48)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.10)', label: 'No Show' },

  // Payment statuses
  paid:    { fg: '#2FA36B', bg: 'rgba(47,163,107,0.12)', border: 'rgba(47,163,107,0.30)', label: 'Paid' },
  pending: { fg: '#D9A441', bg: 'rgba(217,164,65,0.12)', border: 'rgba(217,164,65,0.30)', label: 'Pending' },
  failed:  { fg: '#D64545', bg: 'rgba(214,69,69,0.12)',  border: 'rgba(214,69,69,0.30)',  label: 'Failed' },

  // Generic
  active:    { fg: '#2FA36B', bg: 'rgba(47,163,107,0.12)', border: 'rgba(47,163,107,0.30)', label: 'Active' },
  inactive:  { fg: 'rgba(255,255,255,0.48)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.10)', label: 'Inactive' },
  available: { fg: '#2FA36B', bg: 'rgba(47,163,107,0.12)', border: 'rgba(47,163,107,0.30)', label: 'Available' },
  offline:   { fg: 'rgba(255,255,255,0.48)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.10)', label: 'Offline' },
  faulted:   { fg: '#D64545', bg: 'rgba(214,69,69,0.12)',  border: 'rgba(214,69,69,0.30)',  label: 'Faulted' },
}

export const TIER_PALETTE = {
  PLATINUM: { fg: '#E5E9F0', bg: 'rgba(229,233,240,0.10)' },
  GOLD:     { fg: '#D9A441', bg: 'rgba(217,164,65,0.12)' },
  SILVER:   { fg: 'rgba(255,255,255,0.72)', bg: 'rgba(255,255,255,0.08)' },
  BRONZE:   { fg: '#C57B45', bg: 'rgba(197,123,69,0.12)' },
}
