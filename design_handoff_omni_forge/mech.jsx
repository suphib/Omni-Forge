// mech.jsx — Holographic blueprint of the Omni-Forge T-7 «KLEIO» hybrid mech.
// Stylized but technical: orthographic front view, hairlines, callouts, scan sweep.

const MechBlueprint = ({ equipped = [], highlight = null, onPart = () => {} }) => {
  const has = (id) => equipped.includes(id);

  // helper: line color
  const fg = "rgba(143,210,222,0.85)";     // cyan blueprint stroke
  const fgD = "rgba(143,210,222,0.45)";    // dim
  const fill = "rgba(143,210,222,0.06)";
  const hot = "#ff5a44";
  const amb = "#d4a82c";

  const Part = ({ id, children, ...rest }) => (
    <g
      onMouseEnter={() => onPart(id, true)}
      onMouseLeave={() => onPart(id, false)}
      style={{ cursor: 'pointer', opacity: highlight && highlight !== id ? 0.45 : 1, transition: 'opacity .15s' }}
      {...rest}
    >
      {children}
    </g>
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Hologram base glow */}
      <div style={{
        position: 'absolute', left: '10%', right: '10%', bottom: '6%', height: '14%',
        background: 'radial-gradient(ellipse at center, rgba(111,200,216,0.22), transparent 70%)',
        filter: 'blur(2px)', pointerEvents: 'none',
      }} />

      {/* Floor grid */}
      <svg viewBox="0 0 800 700" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <pattern id="floorGrid" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="skewX(-12) scale(1, 0.45)">
            <path d="M0 0 L40 0 M0 0 L0 40" stroke="rgba(111,200,216,0.18)" strokeWidth="0.5" fill="none"/>
          </pattern>
          <linearGradient id="floorFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(111,200,216,0)"/>
            <stop offset="60%" stopColor="rgba(111,200,216,0.5)"/>
            <stop offset="100%" stopColor="rgba(111,200,216,0)"/>
          </linearGradient>
          <mask id="floorMask"><rect x="0" y="540" width="800" height="160" fill="url(#floorFade)"/></mask>

          <linearGradient id="armorGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(111,200,216,0.18)"/>
            <stop offset="100%" stopColor="rgba(111,200,216,0.02)"/>
          </linearGradient>
        </defs>

        <rect x="0" y="540" width="800" height="160" fill="url(#floorGrid)" mask="url(#floorMask)"/>

        {/* Center axis tick */}
        <line x1="400" y1="540" x2="400" y2="560" stroke={fgD} strokeWidth="0.5"/>
        <line x1="320" y1="550" x2="480" y2="550" stroke={fgD} strokeWidth="0.5" strokeDasharray="2 3"/>
      </svg>

      {/* The mech */}
      <svg viewBox="0 0 800 700" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <g stroke={fg} strokeWidth="1.2" fill="none" strokeLinejoin="round" strokeLinecap="round">

          {/* ── Drone hangar on the back (Matroschka) — drawn first so it sits behind ── */}
          {has('hgr-6') && (
            <Part id="hgr-6">
              {/* Back-mounted box */}
              <path d="M285 215 L255 220 L245 320 L260 365 L290 370 L295 235 Z" fill={fill}/>
              <path d="M285 215 L255 220 L245 320 L260 365 L290 370 L295 235 Z"/>
              {/* Hangar bay doors */}
              <g stroke={fgD}>
                <line x1="258" y1="245" x2="288" y2="240"/>
                <line x1="256" y1="275" x2="287" y2="270"/>
                <line x1="254" y1="305" x2="286" y2="300"/>
                <line x1="252" y1="335" x2="285" y2="330"/>
              </g>
              {/* Vent slits */}
              <g stroke={fg} strokeWidth="0.6">
                <line x1="263" y1="225" x2="291" y2="221"/>
                <line x1="263" y1="229" x2="291" y2="225"/>
              </g>
              {/* Indicator dot */}
              <circle cx="282" cy="350" r="2.5" fill={amb}/>
            </Part>
          )}

          {/* ── Torso (chassis hub) ── */}
          <Part id="chassis">
            <path d="M325 195 L475 195 L490 235 L495 320 L475 360 L325 360 L305 320 L310 235 Z" fill={fill}/>
            <path d="M325 195 L475 195 L490 235 L495 320 L475 360 L325 360 L305 320 L310 235 Z"/>
            {/* Cockpit slit */}
            <path d="M355 215 L445 215 L455 240 L345 240 Z" fill="rgba(255,210,140,0.12)" stroke={amb} strokeWidth="0.8"/>
            <line x1="360" y1="227" x2="440" y2="227" stroke={amb} strokeWidth="2" opacity="0.7"/>
            {/* Hexagonal armor plate (composite) */}
            {has('arm-a') && (
              <g>
                <path d="M360 265 L440 265 L460 295 L440 325 L360 325 L340 295 Z" fill="url(#armorGrad)"/>
                <path d="M360 265 L440 265 L460 295 L440 325 L360 325 L340 295 Z"/>
                <text x="400" y="300" fontFamily="IBM Plex Mono, monospace" fontSize="9" fill={fgD} textAnchor="middle">CP-A · 1400HP</text>
              </g>
            )}
            {/* Reactor core indicator */}
            <circle cx="400" cy="295" r="6" fill="rgba(111,200,216,0.3)" stroke={fg}/>
            <circle cx="400" cy="295" r="2" fill={fg}/>
            {/* Rivets */}
            <g fill={fgD}>
              <circle cx="318" cy="205" r="1.5"/>
              <circle cx="482" cy="205" r="1.5"/>
              <circle cx="318" cy="350" r="1.5"/>
              <circle cx="482" cy="350" r="1.5"/>
            </g>
          </Part>

          {/* ── Head/sensor cluster ── */}
          <Part id="head">
            <path d="M370 155 L430 155 L440 175 L430 195 L370 195 L360 175 Z" fill={fill}/>
            <path d="M370 155 L430 155 L440 175 L430 195 L370 195 L360 175 Z"/>
            <line x1="370" y1="175" x2="430" y2="175" stroke={fg} strokeWidth="0.6"/>
            <circle cx="385" cy="175" r="3" fill={hot} opacity="0.9"/>
            <circle cx="415" cy="175" r="3" fill={fg} opacity="0.9"/>
            {/* Antenna */}
            <line x1="400" y1="155" x2="400" y2="135"/>
            <circle cx="400" cy="133" r="2" fill={fg}/>
          </Part>

          {/* ── Left arm: Kinetic cannon KN-88 ── */}
          {has('kn-88') && (
            <Part id="kn-88">
              {/* Shoulder */}
              <path d="M305 240 L280 245 L270 285 L290 320 L305 318 Z" fill={fill}/>
              <path d="M305 240 L280 245 L270 285 L290 320 L305 318 Z"/>
              {/* Upper arm */}
              <path d="M275 305 L255 320 L235 380 L260 400 L290 380 L285 320 Z" fill={fill}/>
              <path d="M275 305 L255 320 L235 380 L260 400 L290 380 L285 320 Z"/>
              {/* Cannon barrel */}
              <path d="M240 380 L160 405 L155 425 L235 425 Z" fill={fill}/>
              <path d="M240 380 L160 405 L155 425 L235 425 Z"/>
              <rect x="148" y="408" width="14" height="14" fill="rgba(0,0,0,0.5)" stroke={fg}/>
              {/* Cooling fins */}
              <g stroke={fgD} strokeWidth="0.6">
                <line x1="195" y1="395" x2="195" y2="425"/>
                <line x1="210" y1="392" x2="210" y2="425"/>
                <line x1="225" y1="388" x2="225" y2="425"/>
              </g>
            </Part>
          )}

          {/* ── Right arm: Plasma blade LCS-3 ── */}
          {has('lcs-3') && (
            <Part id="lcs-3">
              {/* Shoulder */}
              <path d="M495 240 L520 245 L530 285 L510 320 L495 318 Z" fill={fill}/>
              <path d="M495 240 L520 245 L530 285 L510 320 L495 318 Z"/>
              {/* Arm */}
              <path d="M525 305 L545 320 L555 390 L530 410 L505 388 L515 320 Z" fill={fill}/>
              <path d="M525 305 L545 320 L555 390 L530 410 L505 388 L515 320 Z"/>
              {/* Hilt */}
              <rect x="525" y="405" width="20" height="22" fill="rgba(0,0,0,0.5)" stroke={fg}/>
              {/* Blade — plasma */}
              <line x1="535" y1="405" x2="595" y2="245" stroke="#ff5a44" strokeWidth="3" opacity="0.85"/>
              <line x1="535" y1="405" x2="595" y2="245" stroke="#ffd4c0" strokeWidth="1" opacity="0.9"/>
              <circle cx="595" cy="245" r="5" fill="#ff5a44" opacity="0.5"/>
            </Part>
          )}

          {/* ── Shoulder rocket pod RKT-12 ── */}
          {has('rkt-12') && (
            <Part id="rkt-12">
              <path d="M455 200 L515 192 L530 215 L470 222 Z" fill={fill}/>
              <path d="M455 200 L515 192 L530 215 L470 222 Z"/>
              {/* 12 tubes (4×3) */}
              {[0,1,2,3].map((c) => [0,1,2].map((r) => (
                <circle key={c+'-'+r} cx={467 + c*15} cy={200 + r*7} r="2.2" fill="rgba(0,0,0,0.5)" stroke={fgD} strokeWidth="0.6"/>
              )))}
            </Part>
          )}

          {/* ── Legs: tracked TX-MK4 ── */}
          {has('tx-mk4') && (
            <Part id="tx-mk4">
              {/* Hip block */}
              <path d="M335 360 L465 360 L475 395 L325 395 Z" fill={fill}/>
              <path d="M335 360 L465 360 L475 395 L325 395 Z"/>
              {/* Left leg upper */}
              <path d="M335 395 L325 470 L350 510 L385 510 L390 470 L380 395 Z" fill={fill}/>
              <path d="M335 395 L325 470 L350 510 L385 510 L390 470 L380 395 Z"/>
              {/* Right leg upper */}
              <path d="M420 395 L410 470 L415 510 L450 510 L475 470 L465 395 Z" fill={fill}/>
              <path d="M420 395 L410 470 L415 510 L450 510 L475 470 L465 395 Z"/>
              {/* Left track */}
              <path d="M310 510 L395 510 L405 570 L380 600 L325 600 L300 570 Z" fill="rgba(0,0,0,0.4)"/>
              <path d="M310 510 L395 510 L405 570 L380 600 L325 600 L300 570 Z"/>
              {/* Right track */}
              <path d="M405 510 L490 510 L500 570 L475 600 L420 600 L395 570 Z" fill="rgba(0,0,0,0.4)"/>
              <path d="M405 510 L490 510 L500 570 L475 600 L420 600 L395 570 Z"/>
              {/* Track wheels */}
              <g fill={fgD}>
                <circle cx="320" cy="555" r="6" fill="none" stroke={fg}/>
                <circle cx="350" cy="565" r="9" fill="none" stroke={fg}/>
                <circle cx="380" cy="555" r="6" fill="none" stroke={fg}/>
                <circle cx="420" cy="555" r="6" fill="none" stroke={fg}/>
                <circle cx="450" cy="565" r="9" fill="none" stroke={fg}/>
                <circle cx="480" cy="555" r="6" fill="none" stroke={fg}/>
              </g>
              {/* Track treads */}
              <g stroke={fgD} strokeWidth="0.6">
                {[0,1,2,3,4,5,6,7,8,9].map(i => (
                  <line key={i} x1={305 + i*10} y1={595} x2={310 + i*10} y2={602}/>
                ))}
              </g>
            </Part>
          )}

          {/* Repair swarm — small aux pod */}
          {has('rep-1') && (
            <Part id="rep-1">
              <circle cx="498" cy="178" r="6" fill={fill} stroke={fg}/>
              <circle cx="498" cy="178" r="2" fill={fg}/>
            </Part>
          )}
        </g>

        {/* ── Callouts (always visible) ── */}
        <g fontFamily="IBM Plex Mono, monospace" fontSize="9" fill={fgD}>
          {has('hgr-6') && (
            <g>
              <line x1="220" y1="280" x2="245" y2="280" stroke={fgD} strokeWidth="0.5"/>
              <circle cx="220" cy="280" r="2" fill="none" stroke={fgD}/>
              <text x="118" y="278" textAnchor="start" letterSpacing="1.2">SPC-064</text>
              <text x="118" y="290" textAnchor="start" letterSpacing="0.5">DRONE BAY</text>
            </g>
          )}
          {has('kn-88') && (
            <g>
              <line x1="155" y1="416" x2="100" y2="445" stroke={fgD} strokeWidth="0.5"/>
              <text x="50" y="460" letterSpacing="1.2">WPN-088</text>
              <text x="50" y="472" letterSpacing="0.5">KN-88 · 105MM</text>
            </g>
          )}
          {has('lcs-3') && (
            <g>
              <line x1="595" y1="245" x2="675" y2="200" stroke={fgD} strokeWidth="0.5"/>
              <text x="680" y="195" letterSpacing="1.2">WPN-203</text>
              <text x="680" y="207" letterSpacing="0.5">PLASMA BLADE</text>
            </g>
          )}
          {has('rkt-12') && (
            <g>
              <line x1="490" y1="205" x2="555" y2="155" stroke={fgD} strokeWidth="0.5"/>
              <text x="560" y="150" letterSpacing="1.2">WPN-126</text>
              <text x="560" y="162" letterSpacing="0.5">RKT-12 · SALVO</text>
            </g>
          )}
          {has('arm-a') && (
            <g>
              <line x1="340" y1="295" x2="240" y2="345" stroke={fgD} strokeWidth="0.5"/>
              <text x="118" y="346" letterSpacing="1.2">ARM-014</text>
              <text x="118" y="358" letterSpacing="0.5">COMPOSIT CP-A</text>
            </g>
          )}
          {has('tx-mk4') && (
            <g>
              <line x1="495" y1="555" x2="585" y2="555" stroke={fgD} strokeWidth="0.5"/>
              <text x="590" y="552" letterSpacing="1.2">PRP-041</text>
              <text x="590" y="564" letterSpacing="0.5">TX-MK4 · TRACK</text>
            </g>
          )}

          {/* Center axis label */}
          <text x="400" y="650" textAnchor="middle" letterSpacing="2" fill="rgba(143,210,222,0.55)">CHS-7041-MATR · ORTHO · FRONT</text>
          <text x="400" y="665" textAnchor="middle" letterSpacing="1" fill="rgba(143,210,222,0.35)">SCALE 1 : 24 · MASS BALANCE Δ-CG 0.4M</text>
        </g>

        {/* Scale ticks left */}
        <g stroke={fgD} strokeWidth="0.5" fontFamily="IBM Plex Mono, monospace" fontSize="8" fill={fgD}>
          {[0,1,2,3,4,5,6].map(i => (
            <g key={i}>
              <line x1="35" y1={130 + i*80} x2="50" y2={130 + i*80}/>
              <text x="20" y={133 + i*80} textAnchor="start" letterSpacing="0.5">{(6-i).toString().padStart(2,'0')}M</text>
            </g>
          ))}
          <line x1="42" y1="130" x2="42" y2="610"/>
        </g>
      </svg>

      {/* Scan sweep */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '140px',
          background: 'linear-gradient(180deg, transparent, rgba(143,210,222,0.10) 50%, transparent)',
          animation: 'scan-sweep 6s linear infinite',
        }}/>
      </div>
    </div>
  );
};

window.MechBlueprint = MechBlueprint;
