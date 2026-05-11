/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },

      // ─── Color system ──────────────────────────────────────────────────────
      colors: {
        // Semantic surface tokens
        surface: {
          DEFAULT:  '#15212B', // main background
          elevated: '#1B2A38', // cards
          sunken:   '#101A23', // input bg / deeper layers
          hover:    '#243443',
          // Legacy aliases (mapped to new palette so old code keeps rendering)
          950: '#15212B',
          900: '#1B2A38',
          800: '#243443',
          700: '#324558',
        },
        // Primary action color
        primary: {
          DEFAULT: '#ff0019ff',
          hover:   '#ff001eff',
          pressed: '#ff001eff',
          soft:    'rgb(255, 0, 25)',
          softer:  'rgba(255, 0, 25, 1)',
          border:  'rgba(255, 0, 25, 1)',
        },
        // Legacy brand aliases (remapped)
        brand: {
          50:    '#FDE9EC',
          100:   '#F8C7CD',
          400:   '#C53A4A',
          500:   '#9E2532',
          600:   '#7E1D28',
          700:   '#6A1822',
          900:   '#4A101A',
          accent: '#ff0019ff',
        },
        // Borders
        border: {
          DEFAULT: 'rgba(255,255,255,0.08)',
          strong:  'rgba(255,255,255,0.16)',
          subtle:  'rgba(255,255,255,0.04)',
          focus:   'rgba(158,37,50,0.55)',
        },
        // Text
        text: {
          primary:   '#FFFFFF',
          secondary: 'rgba(255, 255, 255, 1)',
          tertiary:  'rgba(255, 255, 255, 0.48)',
          disabled:  'rgba(255, 255, 255, 0.32)',
        },
        // States
        success: {
          DEFAULT: '#2FA36B',
          hover:   '#36BC7B',
          soft:    'rgba(47,163,107,0.12)',
          border:  'rgba(47,163,107,0.30)',
        },
        warning: {
          DEFAULT: '#D9A441',
          hover:   '#E5B25A',
          soft:    'rgba(217,164,65,0.12)',
          border:  'rgba(217,164,65,0.30)',
        },
        danger: {
          DEFAULT: '#D64545',
          hover:   '#E25858',
          soft:    'rgba(214,69,69,0.12)',
          border:  'rgba(214,69,69,0.30)',
        },
      },

      // ─── Typography scale ─────────────────────────────────────────────────
      fontSize: {
        display:  ['1.75rem',   { lineHeight: '2.25rem', letterSpacing: '-0.02em', fontWeight: 600 }],
        h1:       ['1.25rem',   { lineHeight: '1.75rem', letterSpacing: '-0.01em', fontWeight: 600 }],
        h2:       ['1rem',      { lineHeight: '1.5rem',  letterSpacing: '-0.005em', fontWeight: 600 }],
        body:     ['0.875rem',  { lineHeight: '1.375rem', fontWeight: 400 }],
        bodyL:    ['0.9375rem', { lineHeight: '1.5rem',   fontWeight: 400 }],
        caption:  ['0.8125rem', { lineHeight: '1.25rem',  fontWeight: 400 }],
        overline: ['0.75rem',   { lineHeight: '1rem',     letterSpacing: '0.06em', fontWeight: 600 }],
      },

      // ─── Border radius (enterprise — smaller values) ──────────────────────
      borderRadius: {
        sm:     '4px',
        DEFAULT: '6px',
        md:     '6px',
        lg:     '8px',
        xl:     '10px',
        '2xl':  '14px',
      },

      // ─── Shadow ───────────────────────────────────────────────────────────
      boxShadow: {
        card:       '0 1px 2px rgba(0,0,0,0.20), 0 2px 8px rgba(0,0,0,0.12)',
        elevated:   '0 4px 16px rgba(0,0,0,0.28)',
        overlay:    '0 16px 48px rgba(0,0,0,0.46)',
        focus:      '0 0 0 3px rgba(158,37,50,0.22)',
        'focus-danger': '0 0 0 3px rgba(214,69,69,0.22)',
      },

      // ─── Spacing (enterprise grid) ────────────────────────────────────────
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
      },

      // ─── Animation ────────────────────────────────────────────────────────
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%':   { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'spin-slow': {
          to: { transform: 'rotate(360deg)' },
        },
        'shimmer': {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up':   'fade-up 0.4s ease-out forwards',
        'fade-up-d': 'fade-up 0.4s ease-out 0.18s forwards',
        'fade-in':   'fade-in 0.25s ease-out forwards',
        'fade-out':  'fade-out 0.25s ease-out forwards',
        'spin-slow': 'spin-slow 0.8s linear infinite',
        'shimmer':   'shimmer 2.2s linear infinite',
      },
    },
  },
  plugins: [],
}
