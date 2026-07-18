// mobile/01-icon-splash.jsx — App icon + Splash

const AppIcon = () => (
  <div style={{
    width: 200, height: 200, position: 'relative',
    background: 'radial-gradient(ellipse at 35% 25%, #2a3328 0%, #14160e 65%, #06070a 100%)',
    borderRadius: 44, overflow: 'hidden',
    boxShadow: '0 12px 40px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(143,210,222,0.18)',
  }}>
    {/* Subtle scanlines */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 1px, transparent 1px 3px)',
      opacity: 0.4,
    }}/>
    {/* Tactical hex frame */}
    <svg width="200" height="200" viewBox="0 0 200 200" style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <linearGradient id="ai-hex" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9fdde8"/>
          <stop offset="100%" stopColor="#3e7c89"/>
        </linearGradient>
      </defs>
      <path d="M100 28 L160 60 L160 140 L100 172 L40 140 L40 60 Z" fill="none" stroke="url(#ai-hex)" strokeWidth="2"/>
      <path d="M100 50 L142 72 L142 128 L100 150 L58 128 L58 72 Z" fill="rgba(143,210,222,0.10)" stroke="rgba(143,210,222,0.4)" strokeWidth="1"/>
      {/* Inner mech glyph — abstracted */}
      <g transform="translate(70 65)">
        <rect x="14" y="10" width="32" height="14" fill="rgba(143,210,222,0.6)"/>
        <rect x="10" y="24" width="40" height="22" fill="rgba(143,210,222,0.4)"/>
        <line x1="18" y1="15" x2="42" y2="15" stroke="var(--amber)" strokeWidth="2.5"/>
        <rect x="6"  y="28" width="6" height="18" fill="rgba(143,210,222,0.5)"/>
        <rect x="48" y="28" width="6" height="18" fill="rgba(143,210,222,0.5)"/>
        <line x1="58" y1="46" x2="68" y2="22" stroke="#ff5a44" strokeWidth="2.5"/>
        <rect x="16" y="50" width="12" height="14" fill="rgba(0,0,0,0.5)" stroke="rgba(143,210,222,0.5)"/>
        <rect x="32" y="50" width="12" height="14" fill="rgba(0,0,0,0.5)" stroke="rgba(143,210,222,0.5)"/>
      </g>
      {/* Brand wordmark band */}
      <rect x="38" y="158" width="124" height="2" fill="rgba(143,210,222,0.6)"/>
    </svg>
    <div style={{
      position: 'absolute', bottom: 16, left: 0, right: 0, textAlign: 'center',
      fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 13,
      letterSpacing: '0.22em', color: 'var(--cyan-soft)',
    }}>OMNI-FORGE</div>
  </div>
);

const Screen_IconSplash = () => (
  <div className="mob" style={{
    background: 'radial-gradient(ellipse at center top, #1a1f15 0%, #0a0b07 70%)',
  }}>
    <StatusBar/>

    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>

      {/* Faint hex grid background */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }} viewBox="0 0 390 800">
        <defs>
          <pattern id="hexp" width="60" height="52" patternUnits="userSpaceOnUse">
            <path d="M30 0 L60 17 L60 52 M30 0 L0 17 L0 52 M30 52 L60 52 L30 78 L0 52" stroke="rgba(143,210,222,0.7)" strokeWidth="0.5" fill="none"/>
          </pattern>
        </defs>
        <rect width="390" height="800" fill="url(#hexp)"/>
      </svg>

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
        {/* Icon preview */}
        <AppIcon/>

        <div style={{ textAlign: 'center' }}>
          <div className="disp" style={{ fontSize: 44, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--bone)' }}>OMNI-FORGE</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--cyan-soft)', letterSpacing: '0.32em', marginTop: 4 }}>FIELD COMMAND</div>
        </div>

        {/* Loading bar */}
        <div style={{ width: 220, marginTop: 24 }}>
          <div style={{ height: 2, background: 'rgba(143,210,222,0.18)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '68%', background: 'var(--cyan-soft)', boxShadow: '0 0 8px var(--cyan)' }}/>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: 'var(--f-mono)', fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.18em' }}>
            <span>LADE ARSENAL</span>
            <span className="blink">●</span>
            <span>68%</span>
          </div>
        </div>
      </div>

      {/* Bottom: build info */}
      <div style={{ position: 'absolute', bottom: 56, left: 0, right: 0, textAlign: 'center' }}>
        <div className="mono" style={{ fontSize: 9, color: 'var(--bone-faint)', letterSpacing: '0.22em' }}>BUILD 2.4.1 · DE</div>
        <div className="mono" style={{ fontSize: 9, color: 'var(--bone-faint)', letterSpacing: '0.22em', marginTop: 2 }}>© LOCH·LABS 2026</div>
      </div>
    </div>

    <HomeBar/>
  </div>
);

window.Screen_IconSplash = Screen_IconSplash;
window.AppIcon = AppIcon;
