// mobile/03-hub.jsx — Hangar / Main menu

const Screen_Hub = () => (
  <div className="mob">
    <StatusBar/>

    {/* Top header: player + currencies */}
    <div className="mob-appbar" style={{ borderBottom: '1px solid var(--line)', padding: '6px 16px 12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, border: '1px solid var(--cyan-dim)', background: 'var(--cyan-ink)', display: 'grid', placeItems: 'center', fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 14, color: 'var(--cyan-soft)' }}>J4</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="disp" style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.04em' }}>CPT.J</span>
            <span className="mono" style={{ fontSize: 9, color: 'var(--amber)', letterSpacing: '0.18em', padding: '1px 5px', border: '1px solid var(--amber)' }}>LVL 14</span>
          </div>
          <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.16em', marginTop: 1 }}>RANG · LEUTNANT · 4-FOXTROT</div>
        </div>
      </div>
      <div className="right">
        <CurrencyStrip/>
      </div>
    </div>

    {/* XP bar */}
    <div style={{ padding: '8px 16px 10px', borderBottom: '1px solid var(--line)', background: 'rgba(0,0,0,0.3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <span className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.18em' }}>FORTSCHRITT · LVL 15</span>
        <span className="mono" style={{ fontSize: 9, color: 'var(--cyan-soft)', letterSpacing: '0.16em' }}>2840 / 4000 XP</span>
      </div>
      <div className="bar" style={{ height: 4 }}>
        <i style={{ width: '71%' }}/>
      </div>
    </div>

    {/* Main: mech in hangar */}
    <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 50% 70%, rgba(60,80,55,0.18), transparent 60%)' }}>
      {/* Hangar floor grid */}
      <svg style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '60%', opacity: 0.4 }} viewBox="0 0 390 240" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="hubfade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(143,210,222,0)"/>
            <stop offset="100%" stopColor="rgba(143,210,222,0.55)"/>
          </linearGradient>
          <pattern id="hubg" width="30" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 0 L30 0 M0 0 L0 20" stroke="url(#hubfade)" strokeWidth="0.5" fill="none"/>
          </pattern>
        </defs>
        <rect width="390" height="240" fill="url(#hubg)"/>
      </svg>

      {/* Hangar arch frame */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18 }} viewBox="0 0 390 460" preserveAspectRatio="xMidYMid meet">
        <path d="M30 30 L30 60 M30 30 L60 30 M360 30 L330 30 M360 30 L360 60 M30 430 L60 430 M30 430 L30 400 M360 430 L330 430 M360 430 L360 400" stroke="var(--cyan-soft)" strokeWidth="1.5" fill="none"/>
      </svg>

      {/* The machine */}
      <div style={{ position: 'absolute', top: 30, left: '50%', transform: 'translateX(-50%)' }}>
        <MechMiniSilhouette size={300}/>
      </div>

      {/* Machine name */}
      <div style={{ position: 'absolute', bottom: 200, left: 24, right: 24 }}>
        <div className="mono" style={{ fontSize: 9, color: 'var(--cyan-dim)', letterSpacing: '0.32em' }}>AKTIVE MASCHINE · CHS-7041</div>
        <div className="disp" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.04em', marginTop: 2 }}>OMNI-FORGE T-7 «KLEIO»</div>
        <div className="mono" style={{ fontSize: 10, color: 'var(--bone-mute)', letterSpacing: '0.08em', marginTop: 2 }}>HYBRID-TRÄGER · 7/12 SLOTS · 7.290 KG</div>
      </div>

      {/* Quick stats strip — bottom of hangar */}
      <div style={{ position: 'absolute', bottom: 130, left: 16, right: 16, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
        {[
          { k: 'PWR', v: '1490', tone: 'var(--cyan-soft)' },
          { k: 'HP',  v: '1.4K', tone: 'var(--green)' },
          { k: 'DPS', v: '610',  tone: 'var(--amber)' },
          { k: 'CG',  v: '0.5m', tone: 'var(--bone)' },
        ].map(s => (
          <div key={s.k} style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid var(--line-soft)', padding: '6px 8px' }}>
            <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.18em' }}>{s.k}</div>
            <div className="mono tnum" style={{ fontSize: 14, color: s.tone, letterSpacing: '0.02em' }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Daily mission banner */}
      <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: '1px solid var(--amber)', background: 'rgba(212,168,44,0.08)' }}>
        <div style={{ width: 36, height: 36, display: 'grid', placeItems: 'center', background: 'rgba(212,168,44,0.18)', color: 'var(--amber)', fontFamily: 'var(--f-display)', fontSize: 18, fontWeight: 700 }}>★</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="mono" style={{ fontSize: 9, color: 'var(--amber)', letterSpacing: '0.22em' }}>TAGESMISSION · 02:14:38</div>
          <div style={{ fontSize: 13, color: 'var(--bone)', fontWeight: 600 }}>3 Siege mit aktivem Drohnen-Hangar</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <div className="bar warn" style={{ height: 3, flex: 1 }}><i style={{ width: '66%' }}/></div>
            <span className="mono" style={{ fontSize: 9, color: 'var(--bone-mute)' }}>2 / 3</span>
          </div>
        </div>
        <div style={{ color: 'var(--bone-faint)' }}><IcChevron/></div>
      </div>
    </div>

    {/* Primary CTA */}
    <div style={{ padding: '14px 16px 8px', borderTop: '1px solid var(--line)', background: 'rgba(0,0,0,0.3)' }}>
      <button className="cta" style={{ minHeight: 64, fontSize: 16, letterSpacing: '0.22em' }}>
        ⌖ GEFECHT STARTEN
      </button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, marginTop: 8 }}>
        <button className="cta ghost sm">Werkstatt</button>
        <button className="cta ghost sm">Shop</button>
        <button className="cta ghost sm">Squad</button>
      </div>
    </div>

    <TabBar active="hub"/>

    <HomeBar/>
  </div>
);

window.Screen_Hub = Screen_Hub;
