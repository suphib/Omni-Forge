// krampus-mech.jsx — KMR-02 «KRAMPUS» blueprint + dossier
// Second combat robot. Krampus form: horn crown, spike helm, drill legs,
// chainsaw arm (also shoots chains), bomb arm, belly bay, electro shield.

const { useState: useStateK, useEffect: useEffectK } = React;

// ── Color tokens (krampus: dark charcoal + bone + ember) ─────
const krampusVars = {
  '--bg-deep':     '#08070a',
  '--bg-base':     '#100d11',
  '--bg-surface':  '#1a1518',
  '--bg-surface-2':'#241d1f',
  '--bg-raised':   '#2e2429',

  '--cyan':        '#d8cca8',  // bone ivory drives "info"
  '--cyan-soft':   '#ebe2c4',
  '--cyan-dim':    '#7a6e54',
  '--cyan-ink':    'rgba(216,204,168,0.10)',
  '--line-cyan':   'rgba(216,204,168,0.32)',

  '--red':         '#c93e1c',   // ember
  '--red-bright':  '#ff5a18',
  '--red-dim':     '#5a1808',
  '--red-ink':     'rgba(201,62,28,0.16)',
  '--amber':       '#e8a82c',
};

// ── Krampus blueprint ────────────────────────────────────────
const KrampusBlueprint = () => {
  const B  = '#ebe2c4';                      // bone (line/highlight)
  const Bd = 'rgba(216,204,168,0.55)';       // dim bone
  const E  = '#ff5a18';                      // ember
  const Ed = 'rgba(255,90,24,0.65)';
  const Steel = 'rgba(216,204,168,0.85)';

  return (
    <svg viewBox="0 0 900 900" style={{ width: '100%', height: '100%' }}>
      <defs>
        {/* Shield */}
        <radialGradient id="kshield" cx="50%" cy="50%" r="50%">
          <stop offset="0%"  stopColor="rgba(216,204,168,0)"/>
          <stop offset="60%" stopColor="rgba(216,204,168,0.02)"/>
          <stop offset="85%" stopColor="rgba(255,90,24,0.18)"/>
          <stop offset="98%" stopColor="rgba(255,90,24,0.45)"/>
          <stop offset="100%" stopColor="rgba(216,204,168,0)"/>
        </radialGradient>
        {/* Charcoal armor */}
        <linearGradient id="kArmor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="rgba(50,40,42,0.95)"/>
          <stop offset="100%" stopColor="rgba(22,18,20,0.95)"/>
        </linearGradient>
        {/* Bone */}
        <linearGradient id="kBone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="rgba(235,226,196,0.95)"/>
          <stop offset="100%" stopColor="rgba(160,145,108,0.85)"/>
        </linearGradient>
        {/* Drill spiral fill */}
        <linearGradient id="kDrill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor="rgba(216,204,168,0.40)"/>
          <stop offset="100%" stopColor="rgba(120,80,40,0.85)"/>
        </linearGradient>
        {/* Hazard pattern */}
        <pattern id="kHaz" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="20" fill="rgba(232,168,44,0.6)"/>
          <rect x="10" width="10" height="20" fill="rgba(10,8,10,0.9)"/>
        </pattern>
        {/* Mesh chain pattern (chainsaw blade) */}
        <pattern id="kChain" width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="rgba(20,15,15,0.9)"/>
          <path d="M0 0 L5 5 L0 10" stroke="rgba(216,204,168,0.55)" strokeWidth="0.6" fill="none"/>
          <path d="M5 0 L10 5 L5 10" stroke="rgba(216,204,168,0.55)" strokeWidth="0.6" fill="none"/>
        </pattern>
        <filter id="glowK"><feGaussianBlur stdDeviation="3"/></filter>
      </defs>

      {/* ── Floor grid ────────────────────────────────────── */}
      <g opacity="0.4" transform="skewX(-14)">
        <pattern id="kFloor" width="50" height="25" patternUnits="userSpaceOnUse">
          <path d="M0 0 L50 0 M0 0 L0 25" stroke="rgba(216,204,168,0.22)" strokeWidth="0.5" fill="none"/>
        </pattern>
        <rect x="0" y="780" width="900" height="160" fill="url(#kFloor)"/>
      </g>

      {/* Earth-mound (the bot half-drilled in) — subtle */}
      <g opacity="0.4">
        <ellipse cx="450" cy="850" rx="220" ry="14" fill="rgba(120,80,40,0.4)"/>
        <ellipse cx="450" cy="850" rx="180" ry="9"  fill="rgba(60,40,20,0.5)"/>
        {/* dust puffs */}
        <circle cx="280" cy="838" r="6" fill="rgba(120,80,40,0.4)"/>
        <circle cx="265" cy="828" r="3" fill="rgba(120,80,40,0.3)"/>
        <circle cx="620" cy="838" r="6" fill="rgba(120,80,40,0.4)"/>
        <circle cx="640" cy="826" r="4" fill="rgba(120,80,40,0.3)"/>
      </g>

      {/* ── Electro-shield (outer hex sphere) ──────────────── */}
      <g opacity="0.55">
        <circle cx="450" cy="450" r="410" fill="url(#kshield)"/>
        <g fill="none" stroke="rgba(255,90,24,0.22)" strokeWidth="0.6">
          {Array.from({length: 8}).map((_, ring) => {
            const r = 210 + ring * 28;
            return Array.from({length: 26}).map((_, i) => {
              const a = (i/26) * Math.PI * 2;
              const a2 = ((i+1)/26) * Math.PI * 2;
              const x1 = 450 + Math.cos(a) * r, y1 = 450 + Math.sin(a) * r * 0.95;
              const x2 = 450 + Math.cos(a2) * r, y2 = 450 + Math.sin(a2) * r * 0.95;
              return <line key={ring + '-' + i} x1={x1} y1={y1} x2={x2} y2={y2}/>;
            });
          })}
        </g>
        {/* Lightning arcs at cardinal points */}
        <path d="M 80 450 L 120 430 L 90 460 L 130 440" stroke={E} strokeWidth="1.2" fill="none" filter="url(#glowK)"/>
        <path d="M 820 450 L 780 430 L 810 460 L 770 440" stroke={E} strokeWidth="1.2" fill="none" filter="url(#glowK)"/>
        <path d="M 450 50 L 470 80 L 440 70 L 460 100" stroke={E} strokeWidth="1.2" fill="none" filter="url(#glowK)"/>
        <text x="450" y="42" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="11" fill={B} letterSpacing="3">⚡ ELEKTRO-SCHUTZSCHILD · 100% ⚡</text>
      </g>

      {/* ── DRILL LEGS (drawn first → behind body) ──────────── */}
      <g>
        {/* Left drill leg */}
        {/* Upper thigh */}
        <path d="M345 580 L325 660 L335 720 L385 720 L395 660 L385 580 Z" fill="url(#kArmor)" stroke={B} strokeWidth="1.4"/>
        {/* Drill housing (cylinder) */}
        <path d="M327 720 L393 720 L405 760 L398 800 L322 800 L315 760 Z" fill="rgba(20,15,15,0.9)" stroke={B} strokeWidth="1.4"/>
        {/* Drill cone */}
        <path d="M318 800 L402 800 L380 870 L370 880 L350 880 L340 870 Z" fill="url(#kDrill)" stroke={B} strokeWidth="1.5"/>
        {/* Drill spirals */}
        <g stroke={B} strokeWidth="1" fill="none">
          <path d="M318 810 Q 360 814 402 810"/>
          <path d="M322 820 Q 360 824 398 820"/>
          <path d="M326 830 Q 360 834 394 830"/>
          <path d="M332 842 Q 360 846 388 842"/>
          <path d="M340 855 Q 360 858 380 855"/>
        </g>
        {/* Ember-glow drill tip */}
        <circle cx="360" cy="878" r="10" fill={E} opacity="0.5" filter="url(#glowK)"/>
        {/* Side teeth on housing */}
        <g fill={B} stroke="#000" strokeWidth="0.4">
          <path d="M315 735 L308 740 L315 745 Z"/>
          <path d="M315 760 L308 765 L315 770 Z"/>
          <path d="M315 785 L308 790 L315 795 Z"/>
          <path d="M405 735 L412 740 L405 745 Z"/>
          <path d="M405 760 L412 765 L405 770 Z"/>
          <path d="M405 785 L412 790 L405 795 Z"/>
        </g>
        {/* Hazard band */}
        <rect x="324" y="722" width="72" height="6" fill="url(#kHaz)" opacity="0.9"/>

        {/* Right drill leg — mirrored */}
        <path d="M515 580 L505 660 L515 720 L565 720 L575 660 L555 580 Z" fill="url(#kArmor)" stroke={B} strokeWidth="1.4"/>
        <path d="M507 720 L573 720 L585 760 L578 800 L502 800 L495 760 Z" fill="rgba(20,15,15,0.9)" stroke={B} strokeWidth="1.4"/>
        <path d="M498 800 L582 800 L560 870 L550 880 L530 880 L520 870 Z" fill="url(#kDrill)" stroke={B} strokeWidth="1.5"/>
        <g stroke={B} strokeWidth="1" fill="none">
          <path d="M498 810 Q 540 814 582 810"/>
          <path d="M502 820 Q 540 824 578 820"/>
          <path d="M506 830 Q 540 834 574 830"/>
          <path d="M512 842 Q 540 846 568 842"/>
          <path d="M520 855 Q 540 858 560 855"/>
        </g>
        <circle cx="540" cy="878" r="10" fill={E} opacity="0.5" filter="url(#glowK)"/>
        <g fill={B} stroke="#000" strokeWidth="0.4">
          <path d="M495 735 L488 740 L495 745 Z"/>
          <path d="M495 760 L488 765 L495 770 Z"/>
          <path d="M495 785 L488 790 L495 795 Z"/>
          <path d="M585 735 L592 740 L585 745 Z"/>
          <path d="M585 760 L592 765 L585 770 Z"/>
          <path d="M585 785 L592 790 L585 795 Z"/>
        </g>
        <rect x="504" y="722" width="72" height="6" fill="url(#kHaz)" opacity="0.9"/>

        {/* Spinning motion blur arrows */}
        <path d="M310 760 Q 308 770 312 778" stroke={B} strokeWidth="0.6" fill="none" opacity="0.7"/>
        <path d="M410 760 Q 412 770 408 778" stroke={B} strokeWidth="0.6" fill="none" opacity="0.7"/>
        <path d="M490 760 Q 488 770 492 778" stroke={B} strokeWidth="0.6" fill="none" opacity="0.7"/>
        <path d="M590 760 Q 592 770 588 778" stroke={B} strokeWidth="0.6" fill="none" opacity="0.7"/>
      </g>

      {/* Hip plate */}
      <path d="M335 555 L585 555 L600 595 L590 615 L320 615 L300 595 Z" fill="url(#kArmor)" stroke={B} strokeWidth="1.4"/>
      <rect x="345" y="595" width="215" height="8" fill="url(#kHaz)" opacity="0.85"/>

      {/* ── TORSO ──────────────────────────────────────────── */}
      {/* Hunched shoulders make him menacing */}
      <path d="M295 340 L345 320 L555 320 L605 340 L630 410 L620 530 L590 590 L320 590 L290 530 L270 410 Z"
            fill="url(#kArmor)" stroke={B} strokeWidth="1.7"/>

      {/* Chest hazard stripe */}
      <path d="M315 340 L585 340 L585 358 L315 358 Z" fill={B} opacity="0.9"/>
      <text x="450" y="354" textAnchor="middle" fontFamily="Chakra Petch, sans-serif" fontWeight="700" fontSize="11" fill="#1a0d05" letterSpacing="4">KMR-02 · KRAMPUS</text>

      {/* Rib lines / armor seams */}
      <g stroke={Bd} strokeWidth="0.7" fill="none">
        <path d="M340 380 Q 380 388 410 388"/>
        <path d="M560 380 Q 520 388 490 388"/>
        <path d="M335 415 Q 380 425 415 425"/>
        <path d="M565 415 Q 520 425 485 425"/>
        <path d="M345 445 Q 380 452 415 452"/>
        <path d="M555 445 Q 520 452 485 452"/>
      </g>

      {/* Bolt rivets */}
      <g fill={Bd}>
        {[[310,365],[590,365],[306,420],[594,420],[300,490],[600,490],[315,565],[585,565]].map(([x,y], i) =>
          <circle key={'rv'+i} cx={x} cy={y} r="2.5"/>
        )}
      </g>

      {/* Reactor core in chest */}
      <circle cx="450" cy="420" r="18" fill="rgba(255,90,24,0.5)" stroke={B} strokeWidth="1.6"/>
      <circle cx="450" cy="420" r="9" fill={E}/>
      <circle cx="450" cy="420" r="4" fill="#ffe0c0"/>
      {/* Glow */}
      <circle cx="450" cy="420" r="32" fill={E} opacity="0.18" filter="url(#glowK)"/>

      {/* Spike pauldrons (small spikes on shoulders) */}
      <g fill="url(#kBone)" stroke={B} strokeWidth="0.8">
        <path d="M305 318 L295 290 L322 312 Z"/>
        <path d="M325 312 L320 282 L345 308 Z"/>
        <path d="M345 308 L348 280 L370 305 Z"/>
        <path d="M595 318 L605 290 L578 312 Z"/>
        <path d="M575 312 L580 282 L555 308 Z"/>
        <path d="M555 308 L552 280 L530 305 Z"/>
      </g>

      {/* ── BELLY HATCH (production bay, half-open) ─────── */}
      <g>
        <path d="M375 460 L525 460 L538 555 L362 555 Z" fill="rgba(0,0,0,0.7)" stroke={B} strokeWidth="1.4"/>
        {/* Hatch flap open */}
        <path d="M375 460 L525 460 L520 444 L380 444 Z" fill="rgba(38,30,30,0.92)" stroke={B} strokeWidth="1.2"/>
        <rect x="362" y="452" width="176" height="6" fill="url(#kHaz)" opacity="0.9"/>

        {/* Mini tank inside */}
        <g transform="translate(388 495)">
          <rect x="0" y="14" width="36" height="14" fill="rgba(216,204,168,0.85)" stroke="#000" strokeWidth="0.6"/>
          <rect x="-2" y="20" width="40" height="4" fill="rgba(20,15,15,0.7)"/>
          <rect x="10" y="6" width="14" height="10" fill="rgba(216,204,168,0.85)" stroke="#000" strokeWidth="0.6"/>
          <rect x="22" y="9" width="16" height="3" fill="rgba(216,204,168,0.85)" stroke="#000" strokeWidth="0.4"/>
          <path d="M16 -2 L13 6 L18 6 L14 14" stroke={E} strokeWidth="1.5" fill="none"/>
        </g>
        {/* Mini plane inside */}
        <g transform="translate(450 485)">
          <path d="M30 12 L62 16 L62 19 L30 17 Z" fill="rgba(216,204,168,0.85)"/>
          <path d="M30 12 L0 16 L0 19 L30 17 Z" fill="rgba(216,204,168,0.85)"/>
          <ellipse cx="32" cy="16" rx="8" ry="3" fill="rgba(201,62,28,0.85)"/>
          <path d="M50 16 L52 8 L54 16 Z" fill="rgba(216,204,168,0.85)"/>
        </g>

        <ellipse cx="450" cy="540" rx="55" ry="13" fill={E} opacity="0.25" filter="url(#glowK)"/>
        <text x="450" y="572" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9" fill={B} letterSpacing="2">⚡ PRODUKTIONS-BUCHT · PANZER + JÄGER</text>
      </g>

      {/* ── NECK ───────────────────────────────────────────── */}
      <path d="M410 290 L490 290 L500 320 L400 320 Z" fill="rgba(40,30,30,0.9)" stroke={B} strokeWidth="1.2"/>
      <line x1="410" y1="302" x2="490" y2="302" stroke={Bd} strokeWidth="0.5"/>
      <line x1="410" y1="312" x2="490" y2="312" stroke={Bd} strokeWidth="0.5"/>

      {/* ── HEAD (krampus-style menacing) ──────────────────── */}
      <path d="M380 195 L520 195 L545 240 L535 290 L490 305 L410 305 L365 290 L355 240 Z"
            fill="url(#kArmor)" stroke={B} strokeWidth="1.7"/>

      {/* Brow ridge */}
      <path d="M370 226 L530 226 L535 240 L365 240 Z" fill="rgba(15,10,12,0.85)" stroke={B} strokeWidth="1"/>

      {/* Glowing ember eyes */}
      <path d="M390 248 L435 244 L440 262 L390 266 Z" fill="rgba(0,0,0,0.9)" stroke={B} strokeWidth="0.7"/>
      <path d="M460 244 L505 248 L505 266 L460 262 Z" fill="rgba(0,0,0,0.9)" stroke={B} strokeWidth="0.7"/>
      <ellipse cx="415" cy="255" rx="20" ry="6" fill={E}/>
      <ellipse cx="485" cy="255" rx="20" ry="6" fill={E}/>
      <ellipse cx="415" cy="258" rx="22" ry="4" fill={E} opacity="0.5" filter="url(#glowK)"/>
      <ellipse cx="485" cy="258" rx="22" ry="4" fill={E} opacity="0.5" filter="url(#glowK)"/>
      <circle cx="415" cy="255" r="2.5" fill="#fff"/>
      <circle cx="485" cy="255" r="2.5" fill="#fff"/>

      {/* Snout / fangs */}
      <path d="M420 278 L480 278 L475 300 L425 300 Z" fill="rgba(15,10,12,0.9)" stroke={B} strokeWidth="0.9"/>
      <g fill="url(#kBone)" stroke="#000" strokeWidth="0.4">
        <path d="M428 300 L432 312 L436 300 Z"/>
        <path d="M442 300 L446 314 L450 300 Z"/>
        <path d="M454 300 L458 314 L462 300 Z"/>
        <path d="M468 300 L472 312 L475 300 Z"/>
      </g>
      {/* Tongue/inner mouth */}
      <path d="M438 285 L462 285 L458 297 L442 297 Z" fill={E} opacity="0.6"/>

      {/* ── SPIKE CROWN (forehead + top of head) ─────────── */}
      <g fill="url(#kBone)" stroke={B} strokeWidth="0.9">
        {/* Forehead spikes (between horns) */}
        <path d="M395 195 L388 165 L405 192 Z"/>
        <path d="M415 195 L412 152 L428 192 Z"/>
        <path d="M438 195 L442 144 L452 192 Z"/>
        <path d="M462 195 L458 144 L448 192 Z"/>
        <path d="M485 195 L488 152 L472 192 Z"/>
        <path d="M505 195 L512 165 L495 192 Z"/>
        {/* Side temple spikes */}
        <path d="M363 230 L348 215 L368 240 Z"/>
        <path d="M363 260 L342 250 L367 268 Z"/>
        <path d="M537 230 L552 215 L532 240 Z"/>
        <path d="M537 260 L558 250 L533 268 Z"/>
      </g>

      {/* ── HORNS (big curved bone horns sweeping out-up-back) */}
      <g>
        {/* Left horn — broad base curving out then sweeping up */}
        <path d="M380 200 Q 348 188 312 162 Q 270 130 232 80 Q 210 50 200 18 Q 215 18 232 32 Q 268 60 298 92 Q 332 130 358 168 Q 378 188 392 205 Z"
              fill="url(#kBone)" stroke={B} strokeWidth="1.8"/>
        {/* Inner ridges */}
        <path d="M236 36 Q 280 82 320 130 Q 350 165 380 198" stroke={B} strokeWidth="0.7" fill="none" opacity="0.7"/>
        <path d="M252 50 Q 295 95 335 142 Q 360 170 385 200" stroke={B} strokeWidth="0.5" fill="none" opacity="0.5"/>
        {/* Horn tip — sharpened */}
        <path d="M200 18 L196 6 L208 14 Z" fill="url(#kBone)" stroke={B} strokeWidth="1"/>
        {/* Hazard ring at base */}
        <ellipse cx="386" cy="200" rx="14" ry="5" fill="url(#kHaz)" transform="rotate(-30 386 200)"/>
        {/* Battle scar */}
        <line x1="300" y1="120" x2="320" y2="135" stroke="#000" strokeWidth="0.8" opacity="0.6"/>

        {/* Right horn — mirrored */}
        <path d="M520 200 Q 552 188 588 162 Q 630 130 668 80 Q 690 50 700 18 Q 685 18 668 32 Q 632 60 602 92 Q 568 130 542 168 Q 522 188 508 205 Z"
              fill="url(#kBone)" stroke={B} strokeWidth="1.8"/>
        <path d="M664 36 Q 620 82 580 130 Q 550 165 520 198" stroke={B} strokeWidth="0.7" fill="none" opacity="0.7"/>
        <path d="M648 50 Q 605 95 565 142 Q 540 170 515 200" stroke={B} strokeWidth="0.5" fill="none" opacity="0.5"/>
        <path d="M700 18 L704 6 L692 14 Z" fill="url(#kBone)" stroke={B} strokeWidth="1"/>
        <ellipse cx="514" cy="200" rx="14" ry="5" fill="url(#kHaz)" transform="rotate(30 514 200)"/>
        <line x1="600" y1="120" x2="580" y2="135" stroke="#000" strokeWidth="0.8" opacity="0.6"/>
      </g>

      {/* ── LEFT ARM: BOMB LAUNCHER (cannon tube) ─────────── */}
      <g>
        {/* Shoulder joint */}
        <circle cx="265" cy="385" r="24" fill="rgba(30,22,24,0.92)" stroke={B} strokeWidth="1.4"/>
        <circle cx="265" cy="385" r="9" fill={B}/>
        {/* Upper arm */}
        <path d="M245 405 L218 420 L200 490 L228 510 L266 498 L266 420 Z" fill="url(#kArmor)" stroke={B} strokeWidth="1.4"/>
        {/* Forearm */}
        <path d="M220 500 L200 520 L208 590 L246 588 L260 530 L258 500 Z" fill="url(#kArmor)" stroke={B} strokeWidth="1.4"/>

        {/* BOMB LAUNCHER (tube cannon) */}
        {/* Mounting bracket */}
        <rect x="200" y="558" width="36" height="28" fill="rgba(20,15,15,0.9)" stroke={B} strokeWidth="1.2"/>
        {/* Main tube */}
        <path d="M170 560 L130 562 L120 600 L168 598 Z" fill="rgba(30,22,24,0.92)" stroke={B} strokeWidth="1.4"/>
        {/* Cap (back end) */}
        <rect x="100" y="560" width="22" height="40" fill="url(#kArmor)" stroke={B} strokeWidth="1.4"/>
        {/* Bomb tip glowing in tube */}
        <circle cx="148" cy="578" r="9" fill={E} opacity="0.7"/>
        <circle cx="148" cy="578" r="4" fill="#fff"/>
        {/* Vent slits */}
        <g stroke={Bd} strokeWidth="0.6">
          <line x1="178" y1="568" x2="190" y2="568"/>
          <line x1="178" y1="576" x2="190" y2="576"/>
          <line x1="178" y1="584" x2="190" y2="584"/>
          <line x1="178" y1="592" x2="190" y2="592"/>
        </g>
        {/* Hazard band */}
        <rect x="125" y="592" width="50" height="6" fill="url(#kHaz)"/>
        {/* Three round bombs in feed magazine */}
        <g transform="translate(150 530)">
          <circle cx="0" cy="0" r="7" fill={E} opacity="0.4" stroke={B} strokeWidth="0.7"/>
          <circle cx="16" cy="0" r="7" fill={E} opacity="0.4" stroke={B} strokeWidth="0.7"/>
          <circle cx="32" cy="0" r="7" fill={E} opacity="0.4" stroke={B} strokeWidth="0.7"/>
          <line x1="-2" y1="2" x2="-2" y2="-2" stroke={B} strokeWidth="0.6"/>
          <line x1="14" y1="2" x2="14" y2="-2" stroke={B} strokeWidth="0.6"/>
          <line x1="30" y1="2" x2="30" y2="-2" stroke={B} strokeWidth="0.6"/>
        </g>
      </g>

      {/* ── RIGHT ARM: CHAINSAW + CHAIN LAUNCHER ─────────── */}
      <g>
        {/* Shoulder joint */}
        <circle cx="635" cy="385" r="24" fill="rgba(30,22,24,0.92)" stroke={B} strokeWidth="1.4"/>
        <circle cx="635" cy="385" r="9" fill={B}/>
        {/* Upper arm */}
        <path d="M655 405 L682 420 L700 490 L672 510 L634 498 L634 420 Z" fill="url(#kArmor)" stroke={B} strokeWidth="1.4"/>
        {/* Forearm */}
        <path d="M680 500 L700 520 L692 590 L654 588 L640 530 L642 500 Z" fill="url(#kArmor)" stroke={B} strokeWidth="1.4"/>

        {/* Chainsaw hilt/motor */}
        <rect x="654" y="588" width="48" height="32" fill="rgba(30,22,24,0.95)" stroke={B} strokeWidth="1.4"/>
        {/* Motor ridges */}
        <g stroke={Bd} strokeWidth="0.6">
          <line x1="660" y1="594" x2="696" y2="594"/>
          <line x1="660" y1="600" x2="696" y2="600"/>
          <line x1="660" y1="606" x2="696" y2="606"/>
          <line x1="660" y1="612" x2="696" y2="612"/>
        </g>
        {/* Ember exhaust */}
        <circle cx="700" cy="592" r="3" fill={E}/>

        {/* Chainsaw guide bar (the blade) */}
        <path d="M700 622 L840 622 L850 642 L840 662 L700 662 Z" fill="rgba(30,22,24,0.92)" stroke={B} strokeWidth="1.5"/>
        {/* Chain (running around the bar) */}
        <path d="M700 624 L840 624 L848 642 L840 660 L700 660 Z" fill="url(#kChain)"/>
        {/* Chain teeth — small triangles */}
        <g fill={B} stroke="#000" strokeWidth="0.3">
          {Array.from({length: 10}).map((_, i) => (
            <path key={'tt-'+i} d={`M${706 + i*14} 622 L${712 + i*14} 614 L${716 + i*14} 622 Z`}/>
          ))}
          {Array.from({length: 10}).map((_, i) => (
            <path key={'tb-'+i} d={`M${706 + i*14} 662 L${712 + i*14} 670 L${716 + i*14} 662 Z`}/>
          ))}
        </g>
        {/* Motion blur / sparks at tip */}
        <g stroke={E} strokeWidth="0.8" fill="none">
          <path d="M850 642 Q 868 632 880 638"/>
          <path d="M850 642 Q 868 652 880 646"/>
        </g>
        <circle cx="876" cy="642" r="3" fill={E}/>
        <circle cx="888" cy="638" r="2" fill="#fff"/>
        <circle cx="888" cy="650" r="2" fill="#fff"/>

        {/* CHAIN LAUNCHER muzzle — at base of chainsaw, pointing forward */}
        <rect x="688" y="638" width="14" height="10" fill="rgba(0,0,0,0.85)" stroke={B} strokeWidth="0.8"/>
        {/* A flying chain link (mid-flight) */}
        <g transform="translate(740 705) rotate(15)">
          <ellipse cx="0"  cy="0" rx="6" ry="3" fill="none" stroke={B} strokeWidth="1.5"/>
          <ellipse cx="11" cy="0" rx="6" ry="3" fill="none" stroke={B} strokeWidth="1.5"/>
          <ellipse cx="22" cy="0" rx="6" ry="3" fill="none" stroke={B} strokeWidth="1.5"/>
          {/* Hook */}
          <path d="M30 -2 L36 -6 L38 0 L34 2" stroke={E} strokeWidth="1.4" fill="none"/>
        </g>
      </g>

      {/* ── Center axis labels ────────────────────────────── */}
      <text x="450" y="890" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill="rgba(216,204,168,0.7)" letterSpacing="3">KMR-02-KRMP · ORTHO · FRONT · SCALE 1:18</text>

      {/* ── CALLOUT LINES + NUMBERS ───────────────────────── */}
      <g fontFamily="IBM Plex Mono, monospace" fontSize="11" fill={Bd} stroke={Bd} strokeWidth="0.6">
        {/* 01 — Bone horns */}
        <line x1="208" y1="14" x2="100" y2="14"/>
        <circle cx="208" cy="14" r="3" fill="none"/>
        <CalloutK n="01" x={74} y={18} right/>

        <line x1="692" y1="14" x2="800" y2="14"/>
        <circle cx="692" cy="14" r="3" fill="none"/>
        <CalloutK n="01" x={802} y={18}/>

        {/* 02 — Spike crown */}
        <line x1="450" y1="148" x2="800" y2="148"/>
        <circle cx="450" cy="148" r="3" fill="none"/>
        <CalloutK n="02" x={802} y={152}/>

        {/* 03 — Eyes */}
        <line x1="450" y1="252" x2="100" y2="252"/>
        <CalloutK n="03" x={74} y={256} right/>

        {/* 04 — Chainsaw bar */}
        <line x1="770" y1="622" x2="820" y2="592"/>
        <circle cx="770" cy="622" r="3" fill="none"/>
        <CalloutK n="04" x={802} y={596}/>

        {/* 05 — Chain launcher / flying chain */}
        <line x1="770" y1="703" x2="800" y2="720"/>
        <CalloutK n="05" x={802} y={724}/>

        {/* 06 — Bomb launcher */}
        <line x1="110" y1="580" x2="80" y2="580"/>
        <CalloutK n="06" x={54} y={584} right/>

        {/* 07 — Belly hatch / production */}
        <line x1="450" y1="558" x2="100" y2="608"/>
        <circle cx="450" cy="558" r="3" fill="none"/>
        <CalloutK n="07" x={74} y={612} right/>

        {/* 08 — Drill legs */}
        <line x1="360" y1="850" x2="100" y2="850"/>
        <circle cx="360" cy="850" r="3" fill="none"/>
        <CalloutK n="08" x={74} y={854} right/>

        {/* 09 — Earth-drill mode (mound) */}
        <line x1="450" y1="850" x2="800" y2="850"/>
        <CalloutK n="09" x={802} y={854}/>

        {/* 10 — Shield */}
        <line x1="850" y1="450" x2="800" y2="350"/>
        <CalloutK n="10" x={802} y={354}/>

        {/* 11 — Reactor (chest core) */}
        <line x1="450" y1="420" x2="100" y2="420"/>
        <CalloutK n="11" x={74} y={424} right/>

        {/* 12 — Ram horns label closer */}
        <line x1="265" y1="65" x2="100" y2="65"/>
        <CalloutK n="12" x={74} y={69} right/>
      </g>

      {/* Scale ticks left */}
      <g stroke={Bd} strokeWidth="0.5" fontFamily="IBM Plex Mono, monospace" fontSize="8" fill={Bd}>
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <g key={i}>
            <line x1="38" y1={50 + i*100} x2="58" y2={50 + i*100}/>
            <text x="22" y={53 + i*100} fontSize="8" letterSpacing="0.5">{(8-i).toString().padStart(2,'0')}M</text>
          </g>
        ))}
        <line x1="48" y1="50" x2="48" y2="850"/>
      </g>
    </svg>
  );
};

const CalloutK = ({ n, x, y, right }) => (
  <g>
    <rect x={x - 2} y={y - 11} width="26" height="14" fill="rgba(235,226,196,0.92)" stroke="none"/>
    <text x={x + 11} y={y} textAnchor="middle" fontFamily="Chakra Petch, sans-serif" fontWeight="700" fontSize="10" fill="#0a0808" letterSpacing="1">{n}</text>
  </g>
);

// ── Dossier card ─────────────────────────────────────────────
const FeatureCardK = ({ n, title, code, severity, body, dps, cd, range }) => {
  const sevColor = severity === 'crit' ? 'var(--red-bright)' : severity === 'warn' ? 'var(--amber)' : 'var(--cyan-soft)';
  const sevLabel = severity === 'crit' ? 'KRITISCH' : severity === 'warn' ? 'GEFAHRGUT' : 'STANDARD';
  return (
    <div style={{
      padding: 14, background: 'rgba(20,15,15,0.65)',
      border: '1px solid var(--line)', position: 'relative',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 32, height: 32, display: 'grid', placeItems: 'center',
          background: 'var(--cyan-soft)', color: '#0a0808',
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
          {dps && <StatK k="DPS" v={dps}/>}
          {cd && <StatK k="ABK" v={cd}/>}
          {range && <StatK k="RW" v={range}/>}
        </div>
      )}
    </div>
  );
};

const StatK = ({ k, v }) => (
  <div>
    <div className="mono" style={{ fontSize: 8, color: 'var(--bone-dim)', letterSpacing: '0.2em' }}>{k}</div>
    <div className="mono tnum" style={{ fontSize: 13, color: 'var(--bone)', marginTop: 1 }}>{v}</div>
  </div>
);

// ── Top dossier header ──────────────────────────────────────
const DossierHeaderK = () => (
  <div style={{
    position: 'absolute', top: 0, left: 0, right: 0, height: 80,
    borderBottom: '1px solid var(--line)',
    background: 'linear-gradient(180deg, rgba(40,25,28,0.95), rgba(15,10,12,0.85))',
    display: 'flex', alignItems: 'center', padding: '0 24px', gap: 24, zIndex: 100,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <svg width="48" height="48" viewBox="0 0 48 48">
        <path d="M24 4 L42 14 L42 34 L24 44 L6 34 L6 14 Z" fill="none" stroke="var(--cyan-soft)" strokeWidth="2"/>
        <path d="M24 12 L36 18 L36 30 L24 36 L12 30 L12 18 Z" fill="rgba(216,204,168,0.2)" stroke="var(--cyan-soft)" strokeWidth="1.2"/>
        <circle cx="24" cy="24" r="3" fill="var(--cyan-soft)"/>
      </svg>
      <div>
        <div className="disp" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--cyan-soft)' }}>OMNI-FORGE</div>
        <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.28em', marginTop: 1 }}>UNIT DOSSIER · KMR-SERIE</div>
      </div>
    </div>
    <div style={{ width: 1, height: 44, background: 'var(--line)' }}/>

    <div style={{ flex: 1 }}>
      <div className="mono" style={{ fontSize: 9, color: 'var(--cyan-dim)', letterSpacing: '0.32em' }}>CLASS-02 · SUBTERRANEAN ASSAULT · DRILL-MORPH</div>
      <div className="disp" style={{ fontSize: 28, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--bone)', marginTop: 2 }}>
        KMR-02 «KRAMPUS»
      </div>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ textAlign: 'right' }}>
        <div className="mono" style={{ fontSize: 9, color: 'var(--red-bright)', letterSpacing: '0.22em', whiteSpace: 'nowrap' }}>● KINETIC · INCENDIARY · SUBSURFACE</div>
        <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.22em', marginTop: 2, whiteSpace: 'nowrap' }}>BEDROHUNG · SCHWARZ</div>
      </div>
      <div style={{
        padding: '10px 14px', border: '2px solid var(--red-bright)',
        background: 'rgba(201,62,28,0.18)', color: 'var(--red-bright)',
        fontFamily: 'var(--f-display)', fontWeight: 700, letterSpacing: '0.18em', fontSize: 16,
        whiteSpace: 'nowrap',
      }}>STUFE VI</div>
    </div>
  </div>
);

// ── Stat bar ────────────────────────────────────────────────
const BarK = ({ label, code, value, pct, tone }) => (
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

// Production row
const ProduceRowK = ({ icon, name, code, eta, hp, building }) => (
  <div style={{
    display: 'grid', gridTemplateColumns: '28px 1fr 50px', gap: 8, alignItems: 'center',
    padding: '8px 10px', background: 'rgba(15,10,12,0.6)', border: '1px solid var(--line-soft)',
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

// ── Main view ───────────────────────────────────────────────
const KrampusDossier = () => {
  return (
    <div className="stage-host">
      <ScalingStageK>
        <div className="stage" style={{
          ...krampusVars,
          background: `
            radial-gradient(ellipse at 30% 0%, rgba(100,30,18,0.18), transparent 60%),
            radial-gradient(ellipse at 70% 100%, rgba(60,20,30,0.18), transparent 55%),
            #08070a
          `,
        }}>
          <DossierHeaderK/>

          <div style={{
            position: 'absolute', inset: '80px 0 0 0',
            display: 'grid',
            gridTemplateColumns: '300px 1fr 460px',
            gap: 14, padding: 14,
          }}>
            {/* LEFT — Stats column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="panel bracket-corners">
                <span className="bc-bl"></span><span className="bc-br"></span>
                <div className="panel-hd">
                  <span className="dot" style={{ background: 'var(--cyan-soft)', boxShadow: '0 0 6px var(--cyan-soft)' }}></span>
                  <span className="title">Vitalwerte</span>
                  <span className="id">TLM-001</span>
                </div>
                <div style={{ padding: '14px 14px 16px', display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <BarK label="Panzerung HP" code="ARM" value="17.200 / 18.000" pct={0.955}/>
                  <BarK label="Schutzschild" code="SHD" value="100% · 4.6 GJ" pct={1.0}/>
                  <BarK label="Reaktor-Output" code="PWR" value="4.8 / 5.0 GW" pct={0.96} tone="warn"/>
                  <BarK label="Hitze" code="HET" value="62°C" pct={0.62} tone="warn"/>
                  <BarK label="Gewicht" code="MAS" value="11.4 / 14 T" pct={0.81}/>
                </div>
              </div>

              <div className="panel bracket-corners">
                <span className="bc-bl"></span><span className="bc-br"></span>
                <div className="panel-hd">
                  <span className="dot" style={{ background: 'var(--cyan-soft)', boxShadow: '0 0 6px var(--cyan-soft)' }}></span>
                  <span className="title">Produktions-Bucht</span>
                  <span className="id">SPC-07</span>
                </div>
                <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <ProduceRowK icon="⚔" name="Sturm-Panzer SP-4" code="GND" eta="16" hp="950"/>
                  <ProduceRowK icon="✈" name="Höllen-Jäger HJ-3"  code="AIR" eta="24" hp="600" building/>
                  <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.18em', marginTop: 6, padding: '0 4px' }}>
                    KAPAZITÄT 4 EINHEITEN · METALL 528 / 700 KG
                  </div>
                </div>
              </div>

              <div className="panel bracket-corners" style={{ borderColor: 'var(--red)' }}>
                <span className="bc-bl"></span><span className="bc-br"></span>
                <div className="panel-hd" style={{ background: 'linear-gradient(180deg, rgba(201,62,28,0.35), transparent)' }}>
                  <span className="dot red blink"></span>
                  <span className="title" style={{ color: 'var(--red-bright)' }}>Gefährdungs-Profil</span>
                  <span className="id">THR-13</span>
                </div>
                <div style={{ padding: '12px 14px', fontSize: 11, color: 'var(--bone-mute)', lineHeight: 1.6 }}>
                  Bei Konfrontation: <span style={{ color: 'var(--red-bright)' }}>Boden vermeiden</span> — kann sich eingraben und überall hervorbrechen. 
                  Ramm-Stoß durchbricht selbst aktivierte Schilde. Empfohlene Taktik: 
                  Aus der Luft beschießen, dann Drohnen ablenken während offener Bauchklappe.
                </div>
              </div>
            </div>

            {/* CENTER — Mech blueprint */}
            <div className="panel bracket-corners" style={{ position: 'relative', overflow: 'hidden' }}>
              <span className="bc-bl"></span><span className="bc-br"></span>

              <div style={{
                position: 'absolute', top: 12, left: 14, right: 14, zIndex: 5,
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
              }}>
                <div>
                  <div className="label" style={{ color: 'var(--cyan-dim)' }}>HOLO-PROJEKTION · HALL 04 · BUNKER</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--bone-mute)', letterSpacing: '0.16em', marginTop: 2 }}>FRONT-ANSICHT · 12 SYSTEME · KOMPLETTANSICHT</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div className="label" style={{ color: 'var(--cyan-dim)' }}>SCAN-MODUS</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--cyan-soft)', letterSpacing: '0.16em', marginTop: 2 }}>SEISMIK · INFRAROT</div>
                </div>
              </div>

              <div style={{ position: 'absolute', inset: '50px 0 30px 0' }}>
                <KrampusBlueprint/>
              </div>

              <div style={{
                position: 'absolute', bottom: 10, left: 14, right: 14, zIndex: 5,
                display: 'flex', justifyContent: 'space-between',
                fontFamily: 'var(--f-mono)', fontSize: 9, color: 'var(--bone-faint)', letterSpacing: '0.22em',
              }}>
                <span>● LIVE TELEMETRY</span>
                <span>POLY 32.1K · 0.9MS</span>
                <span>KMR-02-KRMP · R-04</span>
              </div>

              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                <div style={{
                  position: 'absolute', left: 0, right: 0, height: 160,
                  background: 'linear-gradient(180deg, transparent, rgba(216,204,168,0.10) 50%, transparent)',
                  animation: 'scan-sweep 8s linear infinite',
                }}/>
              </div>
            </div>

            {/* RIGHT — Feature dossier */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto' }}>
              <div className="panel-hd" style={{
                border: '1px solid var(--line)', background: 'linear-gradient(180deg, rgba(60,30,30,0.6), rgba(15,10,12,0.6))',
              }}>
                <span className="dot" style={{ background: 'var(--cyan-soft)', boxShadow: '0 0 6px var(--cyan-soft)' }}></span>
                <span className="title">Waffen- & System-Dossier</span>
                <span className="id">12 EINHEITEN</span>
              </div>

              <FeatureCardK
                n="01"
                title="Knochen-Hörner · Ramm-Stoß"
                code="MEL-001 · SCHILD-BRECHER"
                severity="crit"
                body="Massive Hörner aus Verbund-Knochen. Beim Sturm-Angriff (≥ 10 m/s) durchschlagen sie aktive Schutzschilde — auch eigene Klassen-V-Schilde. Setzt das Schild des Ziels für 8 s offline."
                dps="320 + SCHILD-BRUCH"
                cd="9.0s"
                range="Berührung"
              />
              <FeatureCardK
                n="02"
                title="Stachel-Krone"
                code="DEF-002 · NAHKAMPF-ABWEHR"
                severity="warn"
                body="Kranz aus 14 Knochen-Stacheln um den Helm. Verursacht Schaden bei jedem Versuch, den Krampus im Nahkampf zu greifen oder zu reiten. Reflektor für eingehende Klingen-Angriffe."
                dps="60 / Berührung"
                cd="—"
              />
              <FeatureCardK
                n="03"
                title="Glüh-Augen · Wärme-Optik"
                code="SNS-003"
                severity=""
                body="Doppel-Sensor mit Wärmebild und Strukturscan. Sieht durch Wände und 4 m durch festes Erdreich — perfekt für den Erd-Bohr-Modus."
                range="2 km · Erde 4 m"
              />
              <FeatureCardK
                n="04"
                title="Plasma-Kettensäge · K-SAW"
                code="WPN-004 · NAH"
                severity="crit"
                body="40 cm Schwert-Klinge mit Hochgeschwindigkeits-Kette, plasma-versiegelt. Sägt durch Verbund-Panzerung in 1.2 s. Reflektion gegnerischer Klingen möglich."
                dps="460"
                cd="1.8s"
                range="4 m"
              />
              <FeatureCardK
                n="05"
                title="Ketten-Werfer · Sekundär"
                code="WPN-005 · MITTELDISTANZ"
                severity="crit"
                body="Aus dem Motorgehäuse der Kettensäge wird eine spitze Wurfkette mit Haken abgeschossen. Trifft das Ziel: 14 s Blutungs-DOT plus Zug-Effekt — das Ziel wird zum Krampus gerissen."
                dps="180 + 14s DOT"
                cd="6.0s"
                range="28m"
              />
              <FeatureCardK
                n="06"
                title="Bomben-Werfer · B-Stoss"
                code="WPN-006 · STREU"
                severity="crit"
                body="Tubus-Werfer, drei Bomben-Magazin. Streuschaden-Sprengköpfe mit Splitter-Effekt. Auch als Mörser im Erd-Bohr-Modus einsetzbar (indirekter Beschuss aus dem Boden)."
                dps="280"
                cd="2.8s"
                range="120m"
              />
              <FeatureCardK
                n="07"
                title="Produktions-Bucht · Bauch"
                code="SPC-007 · MATROSCHKA"
                severity="warn"
                body="Bauchklappe öffnet sich, produziert Sturm-Panzer (Boden) und Höllen-Jäger (Luft). Während offen ist der Reaktorkern exponiert — Schwachstelle."
                cd="16–24s"
              />
              <FeatureCardK
                n="08"
                title="Bohr-Beine · Doppel-Drill"
                code="PRP-008"
                severity=""
                body="Beide Beine enden in 1.4 m langen Diamant-Bohrern mit Plasma-Spitze. Im Lauf-Modus rotieren sie langsam für Bodenhaftung, in Bohr-Modus 6800 U/min."
                dps="220 / Stand"
                cd="—"
                range="Berührung"
              />
              <FeatureCardK
                n="09"
                title="Erd-Bohr-Modus · Subsurface"
                code="SPC-009 · TARNUNG"
                severity="crit"
                body="Bohrt sich vertikal in den Boden ein. Maximaltiefe 22 m. Bewegungsgeschwindigkeit unter der Erde 8 m/s. Auftauchen an gewähltem Punkt mit Ramm-Effekt (Sturm-Schaden gilt)."
                cd="12s Eintauchen · 4s Auftauchen"
              />
              <FeatureCardK
                n="10"
                title="Elektro-Schutzschild"
                code="DEF-010 · OMNIDIREKTIONAL"
                severity="crit"
                body="Identisches Schild-Modul wie KMR-01 «Stier». Blockt alle Fernattacken. Schutz fällt bei offener Bauchklappe oder direktem Treffer auf den Reaktorkern."
                cd="REGEN 14s"
              />
              <FeatureCardK
                n="11"
                title="Reaktorkern · Brust"
                code="PWR-011 · SCHWACHSTELLE"
                severity="warn"
                body="Glühend exponierter Plasma-Reaktor in der Brust. Liefert 5 GW. Direkt-Treffer mit panzerbrechender Munition reduziert Schild & Output um 40 % pro Sekunde."
              />
              <FeatureCardK
                n="12"
                title="Hörner · Sekundär-Funktion"
                code="REF-012"
                severity=""
                body="Die Knochen-Hörner dienen auch als Auftrieb-Stabilisator beim Auftauchen aus dem Boden. Magnetfeld-Sensor in den Spitzen erfasst gegnerische Schild-Frequenzen — Voraussetzung für den Schild-Bruch in 01."
              />

              <div className="mono" style={{ fontSize: 9, color: 'var(--bone-faint)', letterSpacing: '0.2em', padding: '10px 14px', textAlign: 'center', borderTop: '1px solid var(--line)' }}>
                DOSSIER R-04 · LETZTES UPDATE 17.05.2026 · KMR-LABS
              </div>
            </div>
          </div>

          {/* Classification stamp */}
          <div style={{
            position: 'absolute', bottom: 6, left: 14, zIndex: 60,
            display: 'flex', gap: 10, alignItems: 'center',
            fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.22em',
          }}>
            <span style={{ color: 'rgba(201,62,28,0.85)' }}>● VERTRAULICH</span>
            <span style={{ color: 'var(--bone-faint)' }}>·</span>
            <span style={{ color: 'var(--bone-dim)' }}>KMR-02-KRAMPUS · R-04</span>
            <span style={{ color: 'var(--bone-faint)' }}>·</span>
            <span style={{ color: 'rgba(201,62,28,0.85)' }}>NUR FÜR BERECHTIGTE</span>
          </div>
        </div>
      </ScalingStageK>
    </div>
  );
};

const ScalingStageK = ({ children }) => {
  const [scale, setScale] = useStateK(1);
  useEffectK(() => {
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

ReactDOM.createRoot(document.getElementById('root')).render(<KrampusDossier/>);
