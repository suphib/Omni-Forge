// stier-mech.jsx — KMR-01 «STIER» blueprint + dossier
// First combat robot. Horns, drill, web, lightsaber, shield, production bay.

const { useState: useStateS, useEffect: useEffectS } = React;

// ── Color tokens (override) ──────────────────────────────────
const stierVars = {
  '--cyan':       '#e8b53c',  // yellow now drives "info accent"
  '--cyan-soft':  '#f4d57a',
  '--cyan-dim':   '#7a5a1c',
  '--cyan-ink':   'rgba(232,181,60,0.12)',
  '--line-cyan':  'rgba(244,213,122,0.35)',
  '--red':        '#c8302a',
  '--red-bright': '#ff4d3a',
  '--red-dim':    '#5a1812',
  '--red-ink':    'rgba(200,48,42,0.14)',
  '--amber':      '#f4a82c',
};

// ── Bull mech blueprint ──────────────────────────────────────
const StierBlueprint = () => {
  const Y = '#f4d57a';     // hot yellow line
  const Yd = 'rgba(244,213,122,0.55)';
  const R = '#ff4d3a';     // red highlight
  const Rd = 'rgba(255,77,58,0.6)';
  const Steel = 'rgba(244,213,122,0.85)';
  const fill = 'rgba(200,48,42,0.10)';   // red wash
  const fillY = 'rgba(232,181,60,0.10)'; // yellow wash

  return (
    <svg viewBox="0 0 900 900" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="shield-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="rgba(232,181,60,0)"/>
          <stop offset="60%" stopColor="rgba(232,181,60,0.02)"/>
          <stop offset="85%" stopColor="rgba(244,213,122,0.18)"/>
          <stop offset="98%" stopColor="rgba(244,213,122,0.45)"/>
          <stop offset="100%" stopColor="rgba(244,213,122,0)"/>
        </radialGradient>
        <linearGradient id="armor-red" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="rgba(200,48,42,0.22)"/>
          <stop offset="100%" stopColor="rgba(200,48,42,0.05)"/>
        </linearGradient>
        <linearGradient id="armor-yellow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="rgba(232,181,60,0.28)"/>
          <stop offset="100%" stopColor="rgba(232,181,60,0.06)"/>
        </linearGradient>
        <pattern id="suction" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="7" cy="7" r="2.4" fill="none" stroke="rgba(244,213,122,0.5)" strokeWidth="0.6"/>
          <circle cx="7" cy="7" r="0.8" fill="rgba(244,213,122,0.4)"/>
        </pattern>
        <pattern id="hazard" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="20" fill="rgba(232,181,60,0.5)"/>
          <rect x="10" width="10" height="20" fill="rgba(20,15,8,0.7)"/>
        </pattern>
        <filter id="glow"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>

      {/* ── Floor grid ────────────────────────────────────── */}
      <g opacity="0.45" transform="skewX(-14)">
        <pattern id="floor-stier" width="50" height="25" patternUnits="userSpaceOnUse">
          <path d="M0 0 L50 0 M0 0 L0 25" stroke="rgba(244,213,122,0.25)" strokeWidth="0.5" fill="none"/>
        </pattern>
        <rect x="0" y="720" width="900" height="180" fill="url(#floor-stier)"/>
      </g>

      {/* ── Electro-shield (outer hex sphere) ──────────────── */}
      <g opacity="0.55">
        <circle cx="450" cy="460" r="400" fill="url(#shield-grad)"/>
        {/* Hex grid */}
        <g fill="none" stroke="rgba(244,213,122,0.25)" strokeWidth="0.6">
          {Array.from({length: 8}).map((_, ring) => {
            const r = 200 + ring * 28;
            return Array.from({length: 24}).map((_, i) => {
              const a = (i/24) * Math.PI * 2;
              const a2 = ((i+1)/24) * Math.PI * 2;
              const x1 = 450 + Math.cos(a) * r, y1 = 460 + Math.sin(a) * r * 0.95;
              const x2 = 450 + Math.cos(a2) * r, y2 = 460 + Math.sin(a2) * r * 0.95;
              return <line key={ring + '-' + i} x1={x1} y1={y1} x2={x2} y2={y2}/>;
            });
          })}
        </g>
        {/* Lightning arcs */}
        <path d="M 90 460 L 130 440 L 100 470 L 140 450" stroke={Y} strokeWidth="1.2" fill="none" filter="url(#glow)"/>
        <path d="M 810 460 L 770 440 L 800 470 L 760 450" stroke={Y} strokeWidth="1.2" fill="none" filter="url(#glow)"/>
        <path d="M 450 70 L 470 100 L 440 90 L 460 120" stroke={Y} strokeWidth="1.2" fill="none" filter="url(#glow)"/>
        {/* Shield arc indicator labels */}
        <text x="450" y="62" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill={Y} letterSpacing="3">⚡ ELEKTRO-SCHUTZSCHILD · 100% ⚡</text>
      </g>

      {/* ── The mech (centered, anchored at floor y≈760) ──── */}

      {/* ── LEGS ───────────────────────────────────────────── */}
      {/* Hip plate */}
      <path d="M340 580 L560 580 L580 620 L320 620 Z" fill="url(#armor-red)" stroke={Y} strokeWidth="1.4"/>
      {/* Hazard band on hip */}
      <rect x="350" y="600" width="200" height="8" fill="url(#hazard)" opacity="0.9"/>

      {/* Left leg */}
      <path d="M340 620 L325 700 L335 760 L370 760 L385 700 L380 620 Z" fill="url(#armor-red)" stroke={Y} strokeWidth="1.4"/>
      {/* Poison spikes — left (some present, some regrowing after firing) */}
      <g fill={R} stroke="#000" strokeWidth="0.5">
        {[645, 670, 695, 720].map((y, i) => {
          const fired = i === 1;
          return (
            <g key={'lspike-' + i}>
              {fired ? (
                <g>
                  <circle cx={324} cy={y-1} r="4" fill={Y} opacity="0.55" filter="url(#glow)"/>
                  <path d={`M325 ${y} L319 ${y-2} L325 ${y+2} Z`} fill={Y} opacity="0.85"/>
                  <circle cx={386} cy={y-1} r="4" fill={Y} opacity="0.55" filter="url(#glow)"/>
                  <path d={`M385 ${y} L391 ${y-2} L385 ${y+2} Z`} fill={Y} opacity="0.85"/>
                </g>
              ) : (
                <g>
                  <path d={`M325 ${y} L313 ${y-3} L325 ${y+3} Z`}/>
                  <path d={`M385 ${y} L397 ${y-3} L385 ${y+3} Z`}/>
                  <circle cx={310} cy={y-3} r="1.5" fill={Y}/>
                  <circle cx={400} cy={y-3} r="1.5" fill={Y}/>
                </g>
              )}
            </g>
          );
        })}
      </g>
      {/* Flying spike projectiles — leftward */}
      <g fill={R} stroke="#000" strokeWidth="0.5">
        <g transform="translate(265 668) rotate(-12)">
          <path d="M0 0 L-16 -4 L0 -4 Z"/>
          <circle cx="-18" cy="-2" r="1.6" fill={Y}/>
          <line x1="-2" y1="-2" x2="-32" y2="-2" stroke={Y} strokeWidth="0.5" opacity="0.45" strokeDasharray="2 2"/>
        </g>
        <g transform="translate(255 690) rotate(-6)">
          <path d="M0 0 L-14 -3 L0 -3 Z"/>
          <circle cx="-16" cy="-1.5" r="1.4" fill={Y}/>
          <line x1="-2" y1="-1" x2="-28" y2="-1" stroke={Y} strokeWidth="0.5" opacity="0.4" strokeDasharray="2 2"/>
        </g>
      </g>

      {/* Right leg */}
      <path d="M520 620 L515 700 L530 760 L565 760 L575 700 L560 620 Z" fill="url(#armor-red)" stroke={Y} strokeWidth="1.4"/>
      {/* Poison spikes — right */}
      <g fill={R} stroke="#000" strokeWidth="0.5">
        {[645, 670, 695, 720].map((y, i) => (
          <g key={'rspike-' + i}>
            <path d={`M515 ${y} L503 ${y-3} L515 ${y+3} Z`}/>
            <path d={`M575 ${y} L587 ${y-3} L575 ${y+3} Z`}/>
            <circle cx={500} cy={y-3} r="1.5" fill={Y}/>
            <circle cx={590} cy={y-3} r="1.5" fill={Y}/>
          </g>
        ))}
      </g>

      {/* Feet thrusters with flame */}
      <g>
        {/* L foot */}
        <path d="M328 760 L378 760 L385 778 L321 778 Z" fill="rgba(20,15,8,0.85)" stroke={Y} strokeWidth="1.2"/>
        <ellipse cx="353" cy="785" rx="20" ry="6" fill="rgba(0,0,0,0.5)"/>
        {/* Flame */}
        <path d="M335 778 L345 805 L353 790 L361 808 L371 778 Z" fill={R} opacity="0.85"/>
        <path d="M340 778 L350 800 L356 788 L362 802 L366 778 Z" fill={Y}/>
        <path d="M348 778 L353 795 L358 778 Z" fill="#fff" opacity="0.9"/>

        {/* R foot */}
        <path d="M523 760 L572 760 L578 778 L516 778 Z" fill="rgba(20,15,8,0.85)" stroke={Y} strokeWidth="1.2"/>
        <ellipse cx="548" cy="785" rx="20" ry="6" fill="rgba(0,0,0,0.5)"/>
        <path d="M530 778 L540 805 L548 790 L556 808 L566 778 Z" fill={R} opacity="0.85"/>
        <path d="M535 778 L545 800 L551 788 L557 802 L561 778 Z" fill={Y}/>
        <path d="M543 778 L548 795 L553 778 Z" fill="#fff" opacity="0.9"/>
      </g>

      {/* ── TORSO ──────────────────────────────────────────── */}
      {/* Main chest plate */}
      <path d="M310 360 L590 360 L605 420 L600 540 L580 590 L320 590 L300 540 L295 420 Z"
            fill="url(#armor-red)" stroke={Y} strokeWidth="1.6"/>

      {/* Suction cup field — chest */}
      <rect x="328" y="438" width="80" height="120" fill="url(#suction)" opacity="0.85"/>
      <rect x="492" y="438" width="80" height="120" fill="url(#suction)" opacity="0.85"/>

      {/* Yellow chest stripe */}
      <path d="M310 365 L590 365 L590 380 L310 380 Z" fill={Y}/>
      <text x="450" y="378" textAnchor="middle" fontFamily="Chakra Petch, sans-serif" fontWeight="700" fontSize="11" fill="#1a0d05" letterSpacing="4">KMR-01 · STIER</text>

      {/* ── BELLY HATCH (production bay, half-open) ─────── */}
      <g>
        {/* Hatch frame */}
        <path d="M380 470 L520 470 L530 555 L370 555 Z" fill="rgba(0,0,0,0.6)" stroke={Y} strokeWidth="1.4"/>
        {/* Hatch open: top panel hinged up */}
        <path d="M380 470 L520 470 L516 455 L384 455 Z" fill="rgba(50,30,12,0.85)" stroke={Y} strokeWidth="1.2"/>
        {/* Hazard stripes around hatch */}
        <rect x="370" y="462" width="160" height="6" fill="url(#hazard)" opacity="0.9"/>

        {/* Inside the bay — mini tank + mini plane outline */}
        {/* Mini tank */}
        <g transform="translate(395 500)">
          <rect x="0" y="14" width="36" height="14" fill="rgba(244,213,122,0.85)" stroke="#000" strokeWidth="0.6"/>
          <rect x="-2" y="20" width="40" height="4" fill="rgba(20,15,8,0.7)"/>
          <rect x="10" y="6" width="14" height="10" fill="rgba(244,213,122,0.85)" stroke="#000" strokeWidth="0.6"/>
          <rect x="22" y="9" width="16" height="3" fill="rgba(244,213,122,0.85)" stroke="#000" strokeWidth="0.4"/>
          {/* Lightning bolt = electric */}
          <path d="M16 -2 L13 6 L18 6 L14 14" stroke={Y} strokeWidth="1.5" fill="none"/>
        </g>
        {/* Mini plane silhouette */}
        <g transform="translate(450 488)">
          <path d="M30 12 L62 16 L62 19 L30 17 Z" fill="rgba(244,213,122,0.85)"/>
          <path d="M30 12 L0 16 L0 19 L30 17 Z" fill="rgba(244,213,122,0.85)"/>
          <ellipse cx="32" cy="16" rx="8" ry="3" fill="rgba(200,48,42,0.85)"/>
          <path d="M50 16 L52 8 L54 16 Z" fill="rgba(244,213,122,0.85)"/>
        </g>

        {/* Bay glow */}
        <ellipse cx="450" cy="540" rx="50" ry="12" fill="rgba(244,213,122,0.25)" filter="url(#glow)"/>
        <text x="450" y="572" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9" fill={Y} letterSpacing="2">⚡ PRODUKTIONS-BUCHT · ELEKTRO-PANZER + JÄGER</text>
      </g>

      {/* Reactor core (between belly + chest) */}
      <circle cx="450" cy="430" r="14" fill="rgba(244,213,122,0.4)" stroke={Y} strokeWidth="1.5"/>
      <circle cx="450" cy="430" r="6" fill={Y}/>
      <circle cx="450" cy="430" r="3" fill="#fff"/>

      {/* Shoulder plates with suction cups */}
      <path d="M295 380 L260 400 L255 440 L290 445 Z" fill="url(#armor-red)" stroke={Y} strokeWidth="1.4"/>
      <path d="M605 380 L640 400 L645 440 L610 445 Z" fill="url(#armor-red)" stroke={Y} strokeWidth="1.4"/>
      <rect x="262" y="408" width="22" height="28" fill="url(#suction)" opacity="0.9"/>
      <rect x="616" y="408" width="22" height="28" fill="url(#suction)" opacity="0.9"/>

      {/* ── SPIDER-WEB LAUNCHER (chest centerpiece) ───────── */}
      <g transform="translate(450 510)">
        <circle r="22" fill="rgba(20,15,8,0.85)" stroke={Y} strokeWidth="1.5"/>
        <circle r="14" fill="none" stroke={Y} strokeWidth="0.6"/>
        <circle r="6"  fill="none" stroke={Y} strokeWidth="0.6"/>
        {/* spider lines radiating */}
        {Array.from({length: 8}).map((_, i) => {
          const a = (i/8) * Math.PI * 2;
          return <line key={'wl-'+i} x1={Math.cos(a)*4} y1={Math.sin(a)*4} x2={Math.cos(a)*20} y2={Math.sin(a)*20} stroke={Y} strokeWidth="0.6"/>;
        })}
        <circle r="2.5" fill={R}/>
      </g>

      {/* ── NECK ───────────────────────────────────────────── */}
      <path d="M410 320 L490 320 L500 360 L400 360 Z" fill="rgba(40,20,10,0.85)" stroke={Y} strokeWidth="1.2"/>
      <line x1="410" y1="335" x2="490" y2="335" stroke={Y} strokeWidth="0.5"/>
      <line x1="410" y1="345" x2="490" y2="345" stroke={Y} strokeWidth="0.5"/>

      {/* ── HEAD (bull skull) ─────────────────────────────── */}
      <path d="M380 220 L520 220 L540 260 L530 305 L490 320 L410 320 L370 305 L360 260 Z"
            fill="url(#armor-yellow)" stroke={Y} strokeWidth="1.6"/>

      {/* Eye slits — glowing red */}
      <path d="M395 263 L435 258 L440 273 L395 278 Z" fill="rgba(0,0,0,0.85)" stroke={Y} strokeWidth="0.8"/>
      <path d="M460 258 L505 263 L505 278 L460 273 Z" fill="rgba(0,0,0,0.85)" stroke={Y} strokeWidth="0.8"/>
      <rect x="402" y="266" width="32" height="5" fill={R}/>
      <rect x="466" y="266" width="32" height="5" fill={R}/>
      {/* Glow under eyes */}
      <ellipse cx="418" cy="276" rx="22" ry="3" fill={R} opacity="0.5" filter="url(#glow)"/>
      <ellipse cx="482" cy="276" rx="22" ry="3" fill={R} opacity="0.5" filter="url(#glow)"/>

      {/* Nose / mouth grill */}
      <path d="M425 290 L475 290 L470 312 L430 312 Z" fill="rgba(20,15,8,0.9)" stroke={Y} strokeWidth="0.8"/>
      <g stroke={Y} strokeWidth="0.6">
        <line x1="430" y1="295" x2="470" y2="295"/>
        <line x1="430" y1="300" x2="470" y2="300"/>
        <line x1="430" y1="305" x2="470" y2="305"/>
      </g>

      {/* ── HORNS (proper bull — curving outward + up from head) ── */}
      <g>
        {/* Left horn — starts top-left of head, curves up-and-out then forward-up to tip */}
        <path d="M378 218 Q 358 198 332 168 Q 304 132 272 88 Q 252 60 240 32 Q 252 28 270 38 Q 296 60 318 92 Q 348 132 372 175 Q 388 200 396 220 Z"
              fill="url(#armor-yellow)" stroke={Y} strokeWidth="1.8"/>
        {/* Horn ridges following curve */}
        <path d="M290 80 Q 318 110 348 145 Q 372 175 388 210" stroke={Y} strokeWidth="0.8" fill="none"/>
        <path d="M275 85 Q 305 115 335 150 Q 360 180 380 215" stroke={Y} strokeWidth="0.6" fill="none" opacity="0.7"/>
        {/* Horn tip = bomb launcher (pointing up-out) */}
        <circle cx="248" cy="40" r="9" fill="rgba(20,15,8,0.9)" stroke={Y} strokeWidth="1.4"/>
        <circle cx="248" cy="40" r="4" fill={R}/>
        <circle cx="248" cy="40" r="1.5" fill="#fff"/>
        {/* Smoke/danger wisps from horn tip */}
        <path d="M242 30 Q 236 22 230 24 Q 234 16 228 14" stroke={Y} strokeWidth="0.7" fill="none" opacity="0.6"/>

        {/* Right horn — mirrored */}
        <path d="M522 218 Q 542 198 568 168 Q 596 132 628 88 Q 648 60 660 32 Q 648 28 630 38 Q 604 60 582 92 Q 552 132 528 175 Q 512 200 504 220 Z"
              fill="url(#armor-yellow)" stroke={Y} strokeWidth="1.8"/>
        <path d="M610 80 Q 582 110 552 145 Q 528 175 512 210" stroke={Y} strokeWidth="0.8" fill="none"/>
        <path d="M625 85 Q 595 115 565 150 Q 540 180 520 215" stroke={Y} strokeWidth="0.6" fill="none" opacity="0.7"/>
        <circle cx="652" cy="40" r="9" fill="rgba(20,15,8,0.9)" stroke={Y} strokeWidth="1.4"/>
        <circle cx="652" cy="40" r="4" fill={R}/>
        <circle cx="652" cy="40" r="1.5" fill="#fff"/>
        <path d="M658 30 Q 664 22 670 24 Q 666 16 672 14" stroke={Y} strokeWidth="0.7" fill="none" opacity="0.6"/>

        {/* Hazard bands on horn bases */}
        <ellipse cx="382" cy="210" rx="14" ry="6" fill="url(#hazard)" transform="rotate(-40 382 210)"/>
        <ellipse cx="518" cy="210" rx="14" ry="6" fill="url(#hazard)" transform="rotate(40 518 210)"/>
      </g>

      {/* ── DRILL (between horns, vertical) ───────────────── */}
      <g transform="translate(450 130)">
        {/* Drill mount */}
        <rect x="-22" y="80" width="44" height="20" fill="rgba(20,15,8,0.9)" stroke={Y} strokeWidth="1.2"/>
        <rect x="-26" y="76" width="52" height="6" fill={Y}/>
        {/* Drill body (spiraled) */}
        <path d="M-18 80 L18 80 L14 -10 L-14 -10 Z" fill="url(#armor-yellow)" stroke={Y} strokeWidth="1.4"/>
        {/* Drill spirals */}
        <path d="M-18 75 L18 65 M-18 60 L18 50 M-18 45 L18 35 M-18 30 L18 20 M-18 15 L18 5 M-18 0 L18 -10" stroke={Y} strokeWidth="1" fill="none"/>
        {/* Drill tip */}
        <path d="M-14 -10 L0 -65 L14 -10 Z" fill="url(#armor-yellow)" stroke={Y} strokeWidth="1.6"/>
        <path d="M-8 -10 L0 -45 L8 -10" stroke={Y} strokeWidth="0.8" fill="none"/>
        {/* Spin motion lines */}
        <path d="M-26 -30 Q -22 -32 -18 -30" stroke={Y} strokeWidth="0.6" fill="none"/>
        <path d="M18 -30 Q 22 -32 26 -30" stroke={Y} strokeWidth="0.6" fill="none"/>
      </g>

      {/* ── LEFT ARM: LASER PISTOL ─────────────────────────── */}
      <g>
        {/* Shoulder joint */}
        <circle cx="260" cy="425" r="22" fill="rgba(40,20,10,0.85)" stroke={Y} strokeWidth="1.3"/>
        <circle cx="260" cy="425" r="8" fill={Y}/>
        {/* Upper arm */}
        <path d="M245 445 L218 460 L200 530 L228 552 L260 540 L260 460 Z" fill="url(#armor-red)" stroke={Y} strokeWidth="1.4"/>
        {/* Suction cups arm */}
        <rect x="215" y="475" width="22" height="50" fill="url(#suction)" opacity="0.8"/>
        {/* Forearm */}
        <path d="M218 540 L200 560 L208 620 L240 620 L254 565 L252 540 Z" fill="url(#armor-red)" stroke={Y} strokeWidth="1.4"/>
        {/* Hand grip */}
        <rect x="208" y="615" width="32" height="14" fill="rgba(20,15,8,0.9)" stroke={Y} strokeWidth="1"/>
        {/* Laser pistol body */}
        <path d="M120 590 L210 580 L218 620 L130 630 Z" fill="url(#armor-yellow)" stroke={Y} strokeWidth="1.4"/>
        {/* Pistol barrel */}
        <rect x="92" y="595" width="32" height="14" fill="rgba(20,15,8,0.85)" stroke={Y} strokeWidth="1"/>
        <rect x="80" y="598" width="14" height="8" fill="rgba(255,77,58,0.6)" stroke={R} strokeWidth="1"/>
        {/* Hazard band */}
        <rect x="145" y="590" width="60" height="6" fill="url(#hazard)"/>
        {/* Energy coil */}
        <circle cx="175" cy="610" r="6" fill={R} opacity="0.85"/>
        <circle cx="175" cy="610" r="3" fill="#fff"/>
      </g>

      {/* ── RIGHT ARM: LIGHTSABER ──────────────────────────── */}
      <g>
        {/* Shoulder joint */}
        <circle cx="640" cy="425" r="22" fill="rgba(40,20,10,0.85)" stroke={Y} strokeWidth="1.3"/>
        <circle cx="640" cy="425" r="8" fill={Y}/>
        {/* Upper arm */}
        <path d="M655 445 L682 460 L700 530 L672 552 L640 540 L640 460 Z" fill="url(#armor-red)" stroke={Y} strokeWidth="1.4"/>
        <rect x="663" y="475" width="22" height="50" fill="url(#suction)" opacity="0.8"/>
        {/* Forearm */}
        <path d="M682 540 L700 560 L692 620 L660 620 L646 565 L648 540 Z" fill="url(#armor-red)" stroke={Y} strokeWidth="1.4"/>
        {/* Hand */}
        <rect x="660" y="615" width="32" height="14" fill="rgba(20,15,8,0.9)" stroke={Y} strokeWidth="1"/>
        {/* Lightsaber hilt */}
        <rect x="668" y="625" width="20" height="36" fill={Y} stroke="#000" strokeWidth="0.8"/>
        <rect x="664" y="660" width="28" height="8" fill={Y} stroke="#000" strokeWidth="0.8"/>
        {/* Blade — red/yellow plasma */}
        <line x1="678" y1="660" x2="788" y2="820" stroke={R} strokeWidth="6" opacity="0.85"/>
        <line x1="678" y1="660" x2="788" y2="820" stroke="#ffe2b8" strokeWidth="1.5" opacity="0.95"/>
        <circle cx="788" cy="820" r="10" fill={R} opacity="0.4" filter="url(#glow)"/>

        {/* FLAMMENWERFER — wrist-mounted on right hand */}
        <g>
          <rect x="704" y="545" width="14" height="36" rx="2" fill="rgba(40,20,10,0.95)" stroke={Y} strokeWidth="1"/>
          <rect x="720" y="548" width="10" height="30" rx="2" fill="rgba(40,20,10,0.95)" stroke={Y} strokeWidth="1"/>
          <rect x="704" y="572" width="26" height="6" fill="url(#hazard)"/>
          <text x="717" y="560" textAnchor="middle" fontFamily="Chakra Petch, sans-serif" fontWeight="700" fontSize="6" fill={Y} letterSpacing="1">FUEL</text>
          <path d="M704 580 L702 596 L710 612 L716 632" stroke={Y} strokeWidth="1.2" fill="none"/>
          <path d="M695 624 L730 632 L748 658 L744 678 L716 666 L702 642 Z" fill="rgba(40,20,10,0.95)" stroke={Y} strokeWidth="1.3"/>
          <circle cx="744" cy="668" r="4" fill={R} opacity="0.9"/>
          {/* FLAME CONE (forward-down-right) */}
          <g opacity="0.92">
            <path d="M744 670 Q 800 690 860 730 Q 880 745 870 765 Q 850 740 820 740 Q 870 770 870 800 Q 840 780 810 770 Q 845 800 830 830 Q 800 800 770 790 Q 800 825 770 850 Q 760 820 740 800 Q 750 760 740 740 Q 730 720 744 670 Z" fill={R} opacity="0.85" filter="url(#glow)"/>
            <path d="M748 672 Q 790 695 840 728 Q 855 745 845 760 Q 825 740 800 740 Q 840 770 835 790 Q 815 775 790 768 Q 815 795 802 818 Q 778 795 758 786 Q 778 812 760 832 Q 750 808 738 790 Q 746 762 740 742 Z" fill={Y} opacity="0.85"/>
            <path d="M748 672 Q 778 692 810 720 Q 824 740 816 755 Q 800 738 778 738 Q 808 762 800 782 Q 782 770 762 762 Q 776 786 760 808 Q 748 786 740 770 Z" fill="#fff" opacity="0.55"/>
            <circle cx="870" cy="720" r="2" fill={Y}/>
            <circle cx="855" cy="768" r="2.5" fill={R}/>
            <circle cx="840" cy="810" r="2" fill={Y}/>
            <circle cx="818" cy="758" r="1.5" fill="#fff"/>
            <circle cx="790" cy="824" r="2" fill={R}/>
            <circle cx="868" cy="796" r="1.5" fill={Y}/>
          </g>
          {/* Melted-metal puddle */}
          <ellipse cx="836" cy="830" rx="34" ry="6" fill={R} opacity="0.45" filter="url(#glow)"/>
          <ellipse cx="836" cy="830" rx="22" ry="3" fill={Y} opacity="0.55"/>
        </g>
      </g>

      {/* ── LICHTSCHWERT-SPAWNER (back-mounted forge) ──────── */}
      <g>
        <g transform="translate(228 332)">
          <path d="M0 0 L62 0 L70 14 L66 56 L52 70 L8 70 L-4 56 L-2 14 Z" fill="rgba(40,20,10,0.95)" stroke={Y} strokeWidth="1.4"/>
          <rect x="-2" y="0" width="72" height="10" fill={Y}/>
          <text x="34" y="8" textAnchor="middle" fontFamily="Chakra Petch, sans-serif" fontWeight="700" fontSize="7" fill="#1a0d05" letterSpacing="1.5">SBR-FORGE</text>
          {[8, 26, 44].map((x, i) => (
            <g key={'sf-' + i}>
              <rect x={x} y="16" width="14" height="44" fill="rgba(0,0,0,0.6)" stroke={Yd} strokeWidth="0.6"/>
              <rect x={x + 2} y={i === 1 ? 22 : 18} width="10" height={i === 1 ? 32 : 38} fill={Y} opacity={i === 2 ? 0.4 : 0.95} stroke="#000" strokeWidth="0.4"/>
              <circle cx={x + 7} cy="63" r="1.6" fill={i === 2 ? 'rgba(244,213,122,0.35)' : R}/>
            </g>
          ))}
          <g stroke={Yd} strokeWidth="0.5">
            <line x1="-3" y1="22" x2="4" y2="22"/>
            <line x1="-3" y1="30" x2="4" y2="30"/>
            <line x1="-3" y1="38" x2="4" y2="38"/>
            <line x1="68" y1="22" x2="75" y2="22"/>
            <line x1="68" y1="30" x2="75" y2="30"/>
            <line x1="68" y1="38" x2="75" y2="38"/>
          </g>
        </g>

        {/* Energy beam */}
        <path d="M262 402 Q 240 440 195 475" stroke={Y} strokeWidth="1.4" fill="none" strokeDasharray="2 3" opacity="0.85"/>
        <path d="M262 402 Q 240 440 195 475" stroke={Y} strokeWidth="3" fill="none" opacity="0.3" filter="url(#glow)"/>

        {/* Second lightsaber — mid-assembly hovering in mid-air */}
        <g transform="translate(160 510)">
          <circle r="22" fill="none" stroke={Y} strokeWidth="0.8" strokeDasharray="3 2" opacity="0.6"/>
          <circle r="30" fill="none" stroke={Y} strokeWidth="0.5" strokeDasharray="1 4" opacity="0.4"/>
          <rect x="-10" y="-22" width="20" height="36" fill={Y} stroke="#000" strokeWidth="0.8"/>
          <rect x="-14" y="14" width="28" height="8" fill={Y} stroke="#000" strokeWidth="0.8"/>
          <rect x="-14" y="-26" width="28" height="5" fill={Y} stroke="#000" strokeWidth="0.5"/>
          <line x1="0" y1="-26" x2="-44" y2="-122" stroke={R} strokeWidth="6" opacity="0.55"/>
          <line x1="0" y1="-26" x2="-44" y2="-122" stroke="#ffe2b8" strokeWidth="1.5" opacity="0.85"/>
          <circle cx="-44" cy="-122" r="8" fill={Y} opacity="0.6" filter="url(#glow)"/>
          <circle cx="-22" cy="-66" r="1.5" fill={Y}/>
          <circle cx="-32" cy="-90" r="1" fill="#fff"/>
          <circle cx="-14" cy="-44" r="1.2" fill={Y}/>
          <circle cx="6" cy="-12" r="1" fill={R}/>
        </g>
      </g>

      {/* ── Center axis label ─────────────────────────────── */}
      <text x="450" y="858" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="rgba(244,213,122,0.7)" letterSpacing="3">KMR-01-MATR · ORTHO · FRONT · SCALE 1:18</text>
      <text x="450" y="875" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="rgba(244,213,122,0.4)" letterSpacing="2">M-LV 7.8 · CG +0.0M · POWER 4.2 GW · SHIELD 100%</text>

      {/* ── CALLOUT LINES + NUMBERS ────────────────────────── */}
      <g fontFamily="IBM Plex Mono, monospace" fontSize="11" fill={Yd} stroke={Yd} strokeWidth="0.6">
        {/* 1 — Drill */}
        <line x1="450" y1="55" x2="730" y2="55"/>
        <circle cx="450" cy="55" r="3" fill="none"/>
        <Callout n="01" x={742} y={58}/>

        {/* 2 — Horn bomb launcher (left) */}
        <line x1="248" y1="40" x2="100" y2="40"/>
        <circle cx="248" cy="40" r="3" fill="none"/>
        <Callout n="02" x={74} y={44} right/>

        {/* 3 — Horn bomb launcher (right) */}
        <line x1="652" y1="40" x2="800" y2="40"/>
        <circle cx="652" cy="40" r="3" fill="none"/>
        <Callout n="03" x={802} y={44}/>

        {/* 4 — Eye slit */}
        <line x1="450" y1="270" x2="730" y2="270"/>
        <circle cx="450" cy="270" r="3" fill="none"/>
        <Callout n="04" x={742} y={274}/>

        {/* 5 — Web launcher */}
        <line x1="450" y1="510" x2="730" y2="490"/>
        <circle cx="450" cy="510" r="3" fill="none"/>
        <Callout n="05" x={742} y={494}/>

        {/* 6 — Suction cups */}
        <line x1="370" y1="495" x2="160" y2="495"/>
        <Callout n="06" x={138} y={499} right/>

        {/* 7 — Laser pistol */}
        <line x1="100" y1="603" x2="160" y2="640"/>
        <circle cx="100" cy="603" r="3" fill="none"/>
        <Callout n="07" x={138} y={644} right/>

        {/* 8 — Lightsaber */}
        <line x1="780" y1="800" x2="765" y2="850"/>
        <circle cx="780" cy="800" r="3" fill="none"/>
        <Callout n="08" x={742} y={854}/>

        {/* 9 — Belly hatch / production */}
        <line x1="450" y1="555" x2="160" y2="560"/>
        <circle cx="450" cy="555" r="3" fill="none"/>
        <Callout n="09" x={138} y={564} right/>

        {/* 10 — Poison spikes */}
        <line x1="310" y1="680" x2="160" y2="700"/>
        <circle cx="310" cy="680" r="3" fill="none"/>
        <Callout n="10" x={138} y={704} right/>

        {/* 11 — Thruster feet */}
        <line x1="548" y1="800" x2="730" y2="760"/>
        <circle cx="548" cy="800" r="3" fill="none"/>
        <Callout n="11" x={742} y={764}/>

        {/* 12 — Electro shield */}
        <line x1="850" y1="460" x2="730" y2="380"/>
        <Callout n="12" x={742} y={384}/>

        {/* 13 — Lightsaber spawner */}
        <line x1="260" y1="360" x2="160" y2="330"/>
        <circle cx="260" cy="360" r="3" fill="none"/>
        <Callout n="13" x={134} y={334} right/>

        {/* 14 — Flammenwerfer */}
        <line x1="830" y1="790" x2="790" y2="830"/>
        <circle cx="830" cy="790" r="3" fill="none"/>
        <Callout n="14" x={802} y={834}/>

        {/* 15 — Shootable poison spikes (mid-flight) */}
        <line x1="250" y1="672" x2="160" y2="640"/>
        <Callout n="15" x={134} y={644} right/>
      </g>

      {/* ── Scale ticks left ───────────────────────────────── */}
      <g stroke={Yd} strokeWidth="0.5" fontFamily="IBM Plex Mono, monospace" fontSize="8" fill={Yd}>
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <g key={i}>
            <line x1="38" y1={70 + i*90} x2="58" y2={70 + i*90}/>
            <text x="22" y={73 + i*90} fontSize="8" letterSpacing="0.5">{(8-i).toString().padStart(2,'0')}M</text>
          </g>
        ))}
        <line x1="48" y1="70" x2="48" y2="790"/>
      </g>
    </svg>
  );
};

const Callout = ({ n, x, y, right }) => (
  <g>
    <rect x={right ? x - 2 : x - 2} y={y - 11} width="26" height="14" fill="rgba(244,213,122,0.92)" stroke="none"/>
    <text x={x + 11} y={y} textAnchor="middle" fontFamily="Chakra Petch, sans-serif" fontWeight="700" fontSize="10" fill="#1a0d05" letterSpacing="1">{n}</text>
  </g>
);

// ── Dossier card ─────────────────────────────────────────────
const FeatureCard = ({ n, title, code, severity, body, dps, cd, range }) => {
  const sevColor = severity === 'crit' ? 'var(--red-bright)' : severity === 'warn' ? 'var(--amber)' : 'var(--cyan-soft)';
  const sevLabel = severity === 'crit' ? 'KRITISCH' : severity === 'warn' ? 'GEFAHRGUT' : 'STANDARD';
  return (
    <div style={{
      padding: 14, background: 'rgba(20,15,8,0.6)',
      border: '1px solid var(--line)', position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 32, height: 32, display: 'grid', placeItems: 'center',
          background: 'var(--cyan-soft)', color: '#1a0d05',
          fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 13,
          letterSpacing: '0.04em', flexShrink: 0,
        }}>{n}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div className="disp" style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.02em' }}>{title}</div>
            <div className="mono" style={{ fontSize: 9, color: sevColor, letterSpacing: '0.18em' }}>{sevLabel}</div>
          </div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--bone-dim)', letterSpacing: '0.14em', marginTop: 2 }}>{code}</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--bone-mute)', lineHeight: 1.55, marginTop: 8 }}>{body}</div>
      {(dps || cd || range) && (
        <div style={{ display: 'flex', gap: 14, marginTop: 10, paddingTop: 8, borderTop: '1px dashed var(--line-soft)' }}>
          {dps && <Stat k="DPS" v={dps}/>}
          {cd && <Stat k="ABK" v={cd}/>}
          {range && <Stat k="RW" v={range}/>}
        </div>
      )}
    </div>
  );
};

const Stat = ({ k, v }) => (
  <div>
    <div className="mono" style={{ fontSize: 8, color: 'var(--bone-dim)', letterSpacing: '0.2em' }}>{k}</div>
    <div className="mono tnum" style={{ fontSize: 13, color: 'var(--bone)', marginTop: 1 }}>{v}</div>
  </div>
);

// ── Top dossier header ──────────────────────────────────────
const DossierHeader = () => (
  <div style={{
    position: 'absolute', top: 0, left: 0, right: 0, height: 80,
    borderBottom: '1px solid var(--line)',
    background: 'linear-gradient(180deg, rgba(40,20,10,0.95), rgba(20,12,6,0.85))',
    display: 'flex', alignItems: 'center', padding: '0 24px', gap: 24, zIndex: 100,
  }}>
    {/* Brand */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        <path d="M24 4 L42 14 L42 34 L24 44 L6 34 L6 14 Z" fill="none" stroke="var(--cyan-soft)" strokeWidth="2"/>
        <path d="M24 12 L36 18 L36 30 L24 36 L12 30 L12 18 Z" fill="rgba(244,213,122,0.2)" stroke="var(--cyan-soft)" strokeWidth="1.2"/>
        <circle cx="24" cy="24" r="3" fill="var(--cyan-soft)"/>
      </svg>
      <div>
        <div className="disp" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--cyan-soft)' }}>OMNI-FORGE</div>
        <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.28em', marginTop: 1 }}>UNIT DOSSIER · KMR-SERIE</div>
      </div>
    </div>
    <div style={{ width: 1, height: 44, background: 'var(--line)' }}/>

    {/* Title */}
    <div style={{ flex: 1 }}>
      <div className="mono" style={{ fontSize: 9, color: 'var(--cyan-dim)', letterSpacing: '0.32em' }}>CLASS-01 · HEAVY ASSAULT · HORN-MORPH</div>
      <div className="disp" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--bone)', marginTop: 2 }}>
        KMR-01 «STIER»
      </div>
    </div>

    {/* Classification */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ textAlign: 'right' }}>
        <div className="mono" style={{ fontSize: 9, color: 'var(--red-bright)', letterSpacing: '0.22em', whiteSpace: 'nowrap' }}>● BIOHAZARD · ELECTRO · KINETIC</div>
        <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.22em', marginTop: 2, whiteSpace: 'nowrap' }}>BEDROHUNG · ROT</div>
      </div>
      <div style={{
        padding: '10px 14px', border: '2px solid var(--red-bright)',
        background: 'rgba(200,48,42,0.18)', color: 'var(--red-bright)',
        fontFamily: 'var(--f-display)', fontWeight: 700, letterSpacing: '0.18em', fontSize: 16,
        whiteSpace: 'nowrap',
      }}>STUFE V</div>
    </div>
  </div>
);

// ── Stat bar ────────────────────────────────────────────────
const Bar = ({ label, code, value, pct, tone }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span className="label">{label}</span>
      <span className="mono" style={{ fontSize: 9, color: 'var(--bone-mute)', letterSpacing: '0.14em' }}>{code}</span>
    </div>
    <div className="mono tnum" style={{ fontSize: 14, marginTop: 3, color: tone === 'crit' ? 'var(--red-bright)' : 'var(--bone)' }}>{value}</div>
    <div className={`bar ${tone || ''}`} style={{ marginTop: 5 }}>
      <i style={{ width: `${pct*100}%` }}/>
      <div className="ticks"/>
    </div>
  </div>
);

// ── Main view ───────────────────────────────────────────────
const StierDossier = () => {
  return (
    <div className="stage-host">
      <ScalingStageS>
        <div className="stage" style={{
          ...stierVars,
          background: `
            radial-gradient(ellipse at 30% 0%, rgba(80,40,20,0.18), transparent 60%),
            radial-gradient(ellipse at 70% 100%, rgba(40,30,10,0.15), transparent 55%),
            #0c0a06
          `,
        }}>
          <DossierHeader/>

          {/* ── Layout body ────────────────────────────────── */}
          <div style={{
            position: 'absolute', inset: '80px 0 0 0',
            display: 'grid',
            gridTemplateColumns: '300px 1fr 460px',
            gap: 14, padding: 14,
          }}>
            {/* LEFT — Stats column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Vital stats */}
              <div className="panel bracket-corners">
                <span className="bc-bl"></span><span className="bc-br"></span>
                <div className="panel-hd">
                  <span className="dot" style={{ background: 'var(--cyan-soft)', boxShadow: '0 0 6px var(--cyan-soft)' }}></span>
                  <span className="title">Vitalwerte</span>
                  <span className="id">TLM-001</span>
                </div>
                <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <Bar label="Panzerung HP" code="ARM" value="14.800 / 15.000" pct={0.987}/>
                  <Bar label="Schutzschild" code="SHD" value="100% · 4.2 GJ" pct={1.0}/>
                  <Bar label="Reaktor-Output" code="PWR" value="4.2 / 4.5 GW" pct={0.93} tone="warn"/>
                  <Bar label="Hitze" code="HET" value="38°C" pct={0.42}/>
                  <Bar label="Gewicht" code="MAS" value="7.8 / 10 T" pct={0.78}/>
                </div>
              </div>

              {/* Production */}
              <div className="panel bracket-corners">
                <span className="bc-bl"></span><span className="bc-br"></span>
                <div className="panel-hd">
                  <span className="dot" style={{ background: 'var(--cyan-soft)', boxShadow: '0 0 6px var(--cyan-soft)' }}></span>
                  <span className="title">Produktions-Bucht</span>
                  <span className="id">SPC-09</span>
                </div>
                <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <ProduceRow icon="⚡" name="Elektro-Panzer EP-3" code="GND" eta="14" hp="800" />
                  <ProduceRow icon="✈" name="Kampfflugzeug KJ-2"  code="AIR" eta="22" hp="520" building />
                  <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.18em', marginTop: 6, padding: '0 4px' }}>
                    KAPAZITÄT 4 EINHEITEN · METALL 412 / 600 KG
                  </div>
                </div>
              </div>

              {/* Threat assessment */}
              <div className="panel bracket-corners" style={{ borderColor: 'var(--red)' }}>
                <span className="bc-bl"></span><span className="bc-br"></span>
                <div className="panel-hd" style={{ background: 'linear-gradient(180deg, rgba(200,48,42,0.35), transparent)' }}>
                  <span className="dot red blink"></span>
                  <span className="title" style={{ color: 'var(--red-bright)' }}>Gefährdungs-Profil</span>
                  <span className="id">THR-12</span>
                </div>
                <div style={{ padding: '12px 14px', fontSize: 11, color: 'var(--bone-mute)', lineHeight: 1.6 }}>
                  Bei Konfrontation: <span style={{ color: 'var(--red-bright)' }}>kein Frontalangriff</span>. 
                  Fernattacken werden vom Schild absorbiert. Empfohlene Taktik: 
                  Flankieren während Bauch-Bucht offen, EMP gegen Schild-Generator, dann Nahkampf.
                </div>
              </div>
            </div>

            {/* CENTER — Mech blueprint */}
            <div className="panel bracket-corners" style={{ position: 'relative', overflow: 'hidden' }}>
              <span className="bc-bl"></span><span className="bc-br"></span>

              {/* Top info strip */}
              <div style={{
                position: 'absolute', top: 12, left: 14, right: 14, zIndex: 5,
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              }}>
                <div>
                  <div className="label" style={{ color: 'var(--cyan-dim)' }}>HOLO-PROJEKTION · HALL 03</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--bone-mute)', letterSpacing: '0.16em', marginTop: 2 }}>FRONT-ANSICHT · 12 SYSTEME · KOMPLETTANSICHT</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="label" style={{ color: 'var(--cyan-dim)' }}>SCAN-MODUS</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--cyan-soft)', letterSpacing: '0.16em', marginTop: 2 }}>RÖNTGEN · MULTISPEKTRAL</div>
                </div>
              </div>

              {/* The blueprint */}
              <div style={{ position: 'absolute', inset: '50px 0 30px 0' }}>
                <StierBlueprint/>
              </div>

              {/* Bottom — corner notes */}
              <div style={{
                position: 'absolute', bottom: 10, left: 14, right: 14, zIndex: 5,
                display: 'flex', justifyContent: 'space-between',
                fontFamily: 'var(--f-mono)', fontSize: 9, color: 'var(--bone-faint)', letterSpacing: '0.22em',
              }}>
                <span>● LIVE TELEMETRY</span>
                <span>POLY 28.4K · 0.8MS</span>
                <span>KMR-01-MATR · R-04</span>
              </div>

              {/* Scan sweep */}
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{
                  position: 'absolute', left: 0, right: 0, height: 160,
                  background: 'linear-gradient(180deg, transparent, rgba(244,213,122,0.10) 50%, transparent)',
                  animation: 'scan-sweep 8s linear infinite',
                }}/>
              </div>
            </div>

            {/* RIGHT — Feature dossier */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
              <div className="panel-hd" style={{
                border: '1px solid var(--line)', background: 'linear-gradient(180deg, rgba(60,40,15,0.55), rgba(20,15,8,0.6))',
              }}>
                <span className="dot" style={{ background: 'var(--cyan-soft)', boxShadow: '0 0 6px var(--cyan-soft)' }}></span>
                <span className="title">Waffen- & System-Dossier</span>
                <span className="id">15 EINHEITEN</span>
              </div>

              <FeatureCard
                n="01"
                title="Hauptbohrer · Stier-Kern"
                code="MEL-001 · ZWISCHEN DEN HÖRNERN"
                severity="crit"
                body="Zentraler Diamant-Bohrer zwischen den Hörnern, 3200 U/min. Durchschlägt Frontpanzerung bei Sturmangriff (Aktivierung ab ≥ 12 m/s). Im stationären Modus tunnelt der Bohrer durch Wände, Beton und ganze Berge — Vortrieb 1.4 m/s bei massivem Fels. Erlaubt Überraschungs-Eintritt durch Gebäude oder Bergketten."
                dps="420"
                cd="6.0s"
                range="Berührung · Tunnel"
              />
              <FeatureCard
                n="02–03"
                title="Hörner-Bombenwerfer · Giftgas"
                code="BMB-002/003 · BIO-OFFENSIV"
                severity="crit"
                body="Aus beiden Hörnern werden Bombarden geschossen. Bei Detonation: Wolke aus neurotoxischem Gas, Radius 8m, Wirkdauer 14s. Verbündete benötigen Schutzanzug."
                dps="220 + GAS"
                cd="3.2s"
                range="60m"
              />
              <FeatureCard
                n="04"
                title="Rotglüh-Augen · Bedrohungsscan"
                code="SNS-004 · RÖNTGEN · GEO-TIEF"
                severity="warn"
                body="Stereo-Multispektral-Optik mit drei Modi: STANDARD markiert verwundbare Punkte gegnerischer Maschinen (Munition, Schild-Stärke, Wärmesignatur). RÖNTGEN durchblickt Wände, Mauern und Gebäudestrukturen bis 12m Stahl. GEO-TIEF sieht 8m in die Erde — erkennt Tunnel, Minen, vergrabene Maschinen und Fundamente. Auto-Marker für Verbündete sichtbar."
                range="Optik 2km · Röntgen 12m · Erde 8m"
              />
              <FeatureCard
                n="05"
                title="Spinnenweb-Werfer"
                code="WEB-005 · IMMOBILISIEREND"
                severity="warn"
                body="Spritzt klebrige Polymer-Stränge aus der Brust. Bei Treffer wird das Ziel für 10 Sekunden bewegungsunfähig. Web-Fäden können vom Ziel ausgebrannt werden."
                dps="0 · STUN 10s"
                cd="12s"
                range="22m"
              />
              <FeatureCard
                n="06"
                title="Saugknopf-Felder"
                code="ADH-006 · KÖRPERWEIT"
                severity=""
                body="Hexagonale Saugknöpfe an Brust, Schulter und Armen. Erlauben dem Stier, an Wänden, Decken und Felswänden zu kleben. Auch zum Festhalten gegnerischer Maschinen."
                cd="—"
              />
              <FeatureCard
                n="07"
                title="Laser-Pistole · LP-Stier"
                code="WPN-007 · FERN"
                severity="warn"
                body="Geführter Pulslaser, präzise. Geringerer Schaden, aber unbegrenzte Munition und kein Geschossabfall. Drei-Schuss-Burst."
                dps="180"
                cd="0.8s"
                range="800m"
              />
              <FeatureCard
                n="08"
                title="Plasma-Klinge · gelb-rot"
                code="WPN-008 · NAH"
                severity="crit"
                body="Energieklinge mit gelb-rotem Plasmakern. Reflektiert eingehende Geschosse. Schneidet Composit-Panzerung in einem Hieb."
                dps="380"
                cd="1.4s"
                range="3m"
              />
              <FeatureCard
                n="09"
                title="Produktions-Bucht · Bauch"
                code="SPC-009 · MATROSCHKA"
                severity="warn"
                body="Bauchklappe öffnet sich, produziert Elektro-Panzer (Boden) und Kampfflugzeuge (Luft). Während offen ist der Reaktorkern exponiert — Schwachstelle."
                cd="14–22s"
              />
              <FeatureCard
                n="10"
                title="Gift-Stacheln · Beine & Füße"
                code="MEL-010 · BIO"
                severity="warn"
                body="32 Stacheln entlang der Beine und Füße. Tritt-Schaden + 8s Vergiftung. Wirkt durch leichte Panzerung."
                dps="95 + GIFT"
                cd="0.6s"
                range="Berührung"
              />
              <FeatureCard
                n="11"
                title="Fuß-Triebwerk · Sprung & Flug"
                code="PRP-011"
                severity=""
                body="Plasma-Triebwerke in beiden Füßen. Erlauben Sprung-Boost (3s) oder Schweben (max. 18s). Hitzesignatur erhöht."
                cd="3s/18s"
              />
              <FeatureCard
                n="12"
                title="Elektro-Schutzschild"
                code="DEF-012 · OMNIDIREKTIONAL"
                severity="crit"
                body="Hochenergetisches Elektro-Feld blockt sämtliche Fernattacken (Geschosse, Laser, Raketen). Nahkampf durchdringt. Bei Direkt-Treffer auf den Schildgenerator (Reaktorkern bei offener Bauchklappe) kollabiert das Feld."
                cd="REGEN 14s"
              />

              <FeatureCard
                n="13"
                title="Lichtschwert-Schmiede · SBR-FORGE"
                code="SPC-013 · BACK-MODUL"
                severity="warn"
                body="Drei Hilft-Slots am Rückenmodul. Spawnt jederzeit ein neues Plasma-Schwert — als Ersatz für ein verlorenes oder als zweite Klinge für den Doppel-Lichtschwert-Modus. Im Doppel-Modus wechselt die KI auf Wirbel-Choreografie, +60% Nahkampf-DPS."
                dps="DOPPEL +60%"
                cd="4.0s"
                range="Berührung"
              />
              <FeatureCard
                n="14"
                title="Flammenwerfer · Stier-Glut + Ölsprüher"
                code="WPN-014 · INZEND + AKZEL"
                severity="crit"
                body="Wrist-Düse auf der rechten Hand, gespeist aus zwei Tanks am Unterarm. Zwei Betriebsmodi: GLUT entzündet einen Strahl mit 1.840°C — Metall schmilzt, Panzerung wird in 2s durchdrungen. ÖL spritzt brennbare Hochviskos-Flüssigkeit (5m Kegel) ohne Zündung — als Tümpel auf dem Boden bzw. ölt das Ziel ein. Bei späterer Zündung (manuell oder z.B. via Stachel-Treffer) explodiert die Pfütze: Flächenschaden, brennt 8s nach. Ideale Falle für verfolgende Gegner."
                dps="260 / DOT 40 · 6s"
                cd="0.4s"
                range="14m Konus · Öl 5m"
              />
              <FeatureCard
                n="15"
                title="Gift-Stachel-Werfer · Regenerativ"
                code="WPN-015 · STREU"
                severity="crit"
                body="Die 32 Bein-Stacheln aus 10 können abgefeuert werden — Reichweite 40m, Vergiftungs-Schaden 12s. Stachel-Substrat regeneriert sich aus dem Bio-Reservoir im Reaktor: pro Sekunde wachsen 2 neue Stacheln nach. Munition praktisch unbegrenzt."
                dps="120 + GIFT 12s"
                cd="0.2s"
                range="40m"
              />

              {/* footer note */}
              <div className="mono" style={{ fontSize: 9, color: 'var(--bone-faint)', letterSpacing: '0.2em', padding: '10px 14px', textAlign: 'center', borderTop: '1px solid var(--line)' }}>
                DOSSIER R-05 · LETZTES UPDATE 17.05.2026 · KMR-LABS
              </div>
            </div>
          </div>

          {/* Classification stamp moved to corners */}
          <div style={{
            position: 'absolute', bottom: 6, left: 14, zIndex: 60,
            display: 'flex', gap: 10, alignItems: 'center',
            fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.22em',
          }}>
            <span style={{ color: 'rgba(200,48,42,0.75)' }}>● VERTRAULICH</span>
            <span style={{ color: 'var(--bone-faint)' }}>·</span>
            <span style={{ color: 'var(--bone-dim)' }}>KMR-01-STIER · R-04</span>
            <span style={{ color: 'var(--bone-faint)' }}>·</span>
            <span style={{ color: 'rgba(200,48,42,0.75)' }}>NUR FÜR BERECHTIGTE</span>
          </div>
        </div>
      </ScalingStageS>
    </div>
  );
};

// Production row helper
const ProduceRow = ({ icon, name, code, eta, hp, building }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '28px 1fr 50px', gap: 8, alignItems: 'center',
    padding: '8px 10px', background: 'rgba(20,15,8,0.5)', border: '1px solid var(--line-soft)',
  }}>
    <div style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', background: 'var(--bg-deep)', border: '1px solid var(--line)', color: 'var(--cyan-soft)', fontSize: 14 }}>{icon}</div>
    <div>
      <div className="disp" style={{ fontSize: 12, fontWeight: 600 }}>{name}</div>
      <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.14em', marginTop: 1 }}>{code} · {hp} HP</div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <div className="mono" style={{ fontSize: 11, color: building ? 'var(--amber)' : 'var(--green)', letterSpacing: '0.12em' }}>
        {building ? 'BAU' : 'BEREIT'}
      </div>
      <div className="mono" style={{ fontSize: 9, color: 'var(--bone-faint)', marginTop: 1 }}>{eta}s</div>
    </div>
  </div>
);

// Scaling stage (private copy — won't clash with app.jsx)
const ScalingStageS = ({ children }) => {
  const [scale, setScale] = useStateS(1);
  useEffectS(() => {
    const update = () => setScale(Math.min(window.innerWidth / 1920, window.innerHeight / 1080));
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return (
    <div style={{
      position: 'absolute', left: '50%', top: '50%',
      width: 1920, height: 1080,
      transform: `translate(-50%, -50%) scale(${scale})`,
      transformOrigin: 'center center',
    }}>
      {children}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<StierDossier/>);
