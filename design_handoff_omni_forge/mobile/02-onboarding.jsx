// mobile/02-onboarding.jsx — Welcome + Tutorial step

const Screen_OnboardingWelcome = () => (
  <div className="mob" style={{
    background: `
      radial-gradient(ellipse at 50% 20%, rgba(60,80,55,0.18), transparent 60%),
      linear-gradient(180deg, #0c0e0a 0%, #050605 100%)
    `,
  }}>
    <StatusBar/>

    {/* Background mech */}
    <div style={{ position: 'absolute', top: 100, left: '50%', transform: 'translateX(-50%)', opacity: 0.55 }}>
      <MechMiniSilhouette size={280} color="rgba(143,210,222,0.65)"/>
    </div>

    {/* Atmospheric horizon */}
    <svg style={{ position: 'absolute', left: 0, right: 0, bottom: 360, width: '100%', height: 140, opacity: 0.5 }} viewBox="0 0 390 140" preserveAspectRatio="xMidYMax slice">
      <path d="M0 140 L0 100 L40 95 L80 105 L120 88 L160 95 L200 80 L240 92 L280 75 L320 88 L360 78 L390 90 L390 140 Z" fill="#1a1410"/>
      <rect x="120" y="75" width="3" height="20" fill="#0a0806"/>
      <rect x="280" y="60" width="2" height="15" fill="#0a0806"/>
    </svg>

    {/* Floor grid */}
    <svg style={{ position: 'absolute', left: 0, right: 0, bottom: 200, width: '100%', height: 160, opacity: 0.35 }} viewBox="0 0 390 160" preserveAspectRatio="xMidYMax slice">
      <defs>
        <linearGradient id="ow-grid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(143,210,222,0)"/>
          <stop offset="100%" stopColor="rgba(143,210,222,0.5)"/>
        </linearGradient>
        <pattern id="ow-g" width="40" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 0 L40 0 M0 0 L0 20" stroke="url(#ow-grid)" strokeWidth="0.5" fill="none"/>
        </pattern>
      </defs>
      <rect width="390" height="160" fill="url(#ow-g)"/>
    </svg>

    <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 24, paddingBottom: 32 }}>

      {/* Classification stamp top */}
      <div style={{ position: 'absolute', top: 24, left: 24, right: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <BrandMarkSmall size={28}/>
          <div>
            <div className="disp" style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.14em' }}>OMNI-FORGE</div>
            <div className="mono" style={{ fontSize: 8, color: 'var(--bone-dim)', letterSpacing: '0.22em' }}>FIELD COMMAND</div>
          </div>
        </div>
        <div className="mono" style={{ fontSize: 9, color: 'rgba(217,72,56,0.7)', letterSpacing: '0.22em', textAlign: 'right' }}>
          ● VERTRAULICH<br/>
          <span style={{ color: 'var(--bone-faint)' }}>R-04</span>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="mono" style={{ fontSize: 10, color: 'var(--cyan-soft)', letterSpacing: '0.32em', marginBottom: 12 }}>ARSENAL 7B · WILLKOMMEN</div>
        <div className="disp" style={{ fontSize: 38, fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.05, textWrap: 'balance' }}>
          Baue. Kämpfe.<br/>
          <span style={{ color: 'var(--cyan-soft)' }}>Repliziere.</span>
        </div>
        <div style={{ fontSize: 14, color: 'var(--bone-mute)', lineHeight: 1.5, marginTop: 16, maxWidth: 320 }}>
          Konstruiere deine eigene Kampfmaschine aus Modulen — von der Aufklärungsdrohne bis zur sich selbst replizierenden Festung. Trete gegen andere Operatoren im Live-Gefecht an.
        </div>

        <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="cta">▸ Konto erstellen</button>
          <button className="cta ghost sm">Anmelden</button>
        </div>

        <div className="mono" style={{ fontSize: 9, color: 'var(--bone-faint)', letterSpacing: '0.18em', textAlign: 'center', marginTop: 18 }}>
          AGB · DATENSCHUTZ · ALTERSEINSTUFUNG 12+
        </div>
      </div>
    </div>

    <HomeBar/>
  </div>
);

// Tutorial step — 3 dots + skip
const Screen_OnboardingTutorial = () => (
  <div className="mob" style={{ background: 'var(--bg-deep)' }}>
    <StatusBar/>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 20px 6px' }}>
      <div className="mono" style={{ fontSize: 10, color: 'var(--bone-dim)', letterSpacing: '0.22em' }}>02 / 03 · KAMPF</div>
      <button className="cta ghost sm" style={{ width: 'auto', minHeight: 32, padding: '6px 14px' }}>Überspringen</button>
    </div>

    {/* Hero visual — combat scene */}
    <div style={{ height: 320, position: 'relative', overflow: 'hidden', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <BattlefieldThumb/>
    </div>

    <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column' }}>
      <div className="mono" style={{ fontSize: 10, color: 'var(--cyan-soft)', letterSpacing: '0.32em', marginBottom: 8 }}>SCHRITT 2 · GEFECHT</div>
      <div className="disp" style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.1 }}>
        Linker Daumen bewegt,<br/>rechter Daumen feuert.
      </div>
      <div style={{ fontSize: 14, color: 'var(--bone-mute)', lineHeight: 1.5, marginTop: 14 }}>
        Drei Waffen-Slots in Daumen-Reichweite. Drohnen rufst du über die Seitenleiste. Bei kritischem Schaden steht dir die <span style={{ color: 'var(--red-bright)' }}>Selbstzerstörung</span> als letzte Option zur Verfügung.
      </div>

      {/* Tip strip */}
      <div className="card" style={{ marginTop: 18, padding: 12, display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(212,168,44,0.08)', borderColor: 'rgba(212,168,44,0.4)' }}>
        <div style={{ width: 32, height: 32, display: 'grid', placeItems: 'center', background: 'rgba(212,168,44,0.12)', border: '1px solid var(--amber)', color: 'var(--amber)', fontFamily: 'var(--f-display)', fontWeight: 700 }}>!</div>
        <div>
          <div className="mono" style={{ fontSize: 9, color: 'var(--amber)', letterSpacing: '0.2em' }}>TIPP</div>
          <div style={{ fontSize: 13, color: 'var(--bone)', marginTop: 1 }}>Hover über dem Selbstzerstörungs-Knopf reicht nicht — Doppeltap zur Auslösung.</div>
        </div>
      </div>

      <div style={{ flex: 1 }}/>

      {/* Pagination dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        <div style={{ width: 24, height: 3, background: 'var(--bone-faint)' }}/>
        <div style={{ width: 24, height: 3, background: 'var(--cyan-soft)' }}/>
        <div style={{ width: 24, height: 3, background: 'var(--bone-faint)' }}/>
      </div>
      <button className="cta">Weiter ▸</button>
    </div>

    <HomeBar/>
  </div>
);

// Small battlefield thumbnail for tutorial hero
const BattlefieldThumb = () => (
  <div style={{ position: 'absolute', inset: 0 }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #5c4a35 0%, #74604a 40%, #2a2418 70%, #181410 100%)' }}/>
    <svg viewBox="0 0 390 320" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <path fill="#1a1410" d="M0 320 L0 200 L40 195 L80 210 L120 185 L160 200 L200 175 L240 195 L280 170 L320 190 L360 175 L390 195 L390 320 Z"/>
      <rect x="200" y="170" width="3" height="20" fill="#0a0806"/>
      <rect x="120" y="180" width="2" height="15" fill="#0a0806"/>
    </svg>
    {/* Crosshair */}
    <div style={{
      position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
    }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="32" fill="none" stroke="var(--cyan-soft)" strokeWidth="1.2" opacity="0.7"/>
        <line x1="50" y1="36" x2="50" y2="44" stroke="var(--cyan-soft)" strokeWidth="1.5"/>
        <line x1="50" y1="56" x2="50" y2="64" stroke="var(--cyan-soft)" strokeWidth="1.5"/>
        <line x1="36" y1="50" x2="44" y2="50" stroke="var(--cyan-soft)" strokeWidth="1.5"/>
        <line x1="56" y1="50" x2="64" y2="50" stroke="var(--cyan-soft)" strokeWidth="1.5"/>
      </svg>
    </div>
    {/* Mock joystick */}
    <div style={{ position: 'absolute', bottom: 20, left: 20 }}>
      <div className="touch-pad" style={{ width: 70, height: 70 }}>
        <div className="nub" style={{ width: 32, height: 32 }}/>
      </div>
    </div>
    {/* Mock fire button */}
    <div style={{ position: 'absolute', bottom: 28, right: 28 }}>
      <div className="touch-btn fire" style={{ width: 50, height: 50 }}>FIRE</div>
    </div>
  </div>
);

Object.assign(window, { Screen_OnboardingWelcome, Screen_OnboardingTutorial });
