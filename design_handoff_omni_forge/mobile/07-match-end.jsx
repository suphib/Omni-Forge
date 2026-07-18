// mobile/07-match-end.jsx — Victory / Match end screen

const Screen_MatchEnd = () => (
  <div className="mob" style={{ background: 'radial-gradient(ellipse at 50% 20%, rgba(60,120,80,0.25), #0a0c08 70%)' }}>
    <StatusBar/>

    {/* Hero banner */}
    <div style={{ position: 'relative', padding: '24px 24px 12px', textAlign: 'center' }}>
      <div className="mono" style={{ fontSize: 10, color: 'var(--green)', letterSpacing: '0.32em', marginBottom: 4 }}>● OBJEKTIV ABGESCHLOSSEN</div>
      <div className="disp" style={{ fontSize: 56, fontWeight: 700, letterSpacing: '0.16em', color: 'var(--green)', textShadow: '0 0 24px rgba(127,176,74,0.4)' }}>SIEG</div>
      <div className="mono" style={{ fontSize: 10, color: 'var(--bone-mute)', letterSpacing: '0.2em', marginTop: 4 }}>OP-FERROUS · SEKTOR 7 OST · 04:18</div>

      {/* Decorative scan brackets */}
      <svg style={{ position: 'absolute', top: 60, left: 24, right: 24, width: 'auto', height: 70, opacity: 0.4, pointerEvents: 'none' }} viewBox="0 0 340 70" preserveAspectRatio="none">
        <path d="M0 0 L20 0 M0 0 L0 20 M340 0 L320 0 M340 0 L340 20 M0 70 L20 70 M0 70 L0 50 M340 70 L320 70 M340 70 L340 50" stroke="var(--green)" strokeWidth="1"/>
      </svg>
    </div>

    {/* Score */}
    <div style={{ display: 'flex', justifyContent: 'center', gap: 24, padding: '0 24px 20px', alignItems: 'center' }}>
      <div style={{ textAlign: 'right' }}>
        <div className="mono" style={{ fontSize: 9, color: 'var(--green)', letterSpacing: '0.22em' }}>VERBÜNDETE</div>
        <div className="disp" style={{ fontSize: 42, fontWeight: 700, color: 'var(--green)', fontVariantNumeric: 'tabular-nums' }}>3</div>
      </div>
      <div style={{ width: 1, height: 40, background: 'var(--line)' }}/>
      <div style={{ textAlign: 'left' }}>
        <div className="mono" style={{ fontSize: 9, color: 'var(--red-bright)', letterSpacing: '0.22em' }}>FEINDE</div>
        <div className="disp" style={{ fontSize: 42, fontWeight: 700, color: 'var(--red-bright)', fontVariantNumeric: 'tabular-nums' }}>1</div>
      </div>
    </div>

    {/* Rewards card */}
    <div style={{ padding: '0 16px 12px' }}>
      <div className="card">
        <div className="card-hd">
          <span style={{ color: 'var(--amber)' }}>★</span> Belohnungen
        </div>

        <RewardRow icon="◆" iconColor="var(--amber)" label="Schrott" value="+437" sub="120 Basis + 217 Bonus + 100 Sieg"/>
        <RewardRow icon="◇" iconColor="var(--cyan)"  label="Gems"    value="+12"  sub="Erste Mission heute"/>
        <RewardRow icon="✦" iconColor="var(--green)" label="Erfahrung" value="+850 XP" sub=""/>

        <div style={{ marginTop: 12, padding: 12, background: 'rgba(0,0,0,0.4)', border: '1px solid var(--line-soft)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.2em' }}>LVL 14 → LVL 15</span>
            <span className="mono" style={{ fontSize: 9, color: 'var(--cyan-soft)' }}>2840 / 4000</span>
          </div>
          <div className="bar" style={{ height: 5 }}>
            <i style={{ width: '71%' }}/>
          </div>
          <div className="mono" style={{ fontSize: 9, color: 'var(--bone-mute)', letterSpacing: '0.16em', marginTop: 6 }}>
            FREISCHALTUNG BEI LVL 15: <span style={{ color: 'var(--amber)' }}>Reaktive Hülle RH-9</span>
          </div>
        </div>
      </div>
    </div>

    {/* Performance stats */}
    <div style={{ padding: '0 16px 12px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
      <PerfTile k="Abschüsse" v="7"/>
      <PerfTile k="Schaden"   v="14K"/>
      <PerfTile k="Drohnen"   v="4"/>
      <PerfTile k="Genauigk." v="63%"/>
    </div>

    {/* Daily mission progress */}
    <div style={{ padding: '0 16px 12px' }}>
      <div style={{ padding: '10px 12px', border: '1px solid var(--amber)', background: 'rgba(212,168,44,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, display: 'grid', placeItems: 'center', background: 'rgba(212,168,44,0.18)', color: 'var(--amber)', fontFamily: 'var(--f-display)', fontWeight: 700 }}>★</div>
        <div style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 9, color: 'var(--amber)', letterSpacing: '0.22em' }}>TAGESMISSION · 3 / 3 ✓</div>
          <div style={{ fontSize: 12, color: 'var(--bone)' }}>3 Siege mit Drohnen-Hangar</div>
        </div>
        <span className="mono" style={{ fontSize: 11, color: 'var(--amber)' }}>+200 ◆</span>
      </div>
    </div>

    <div style={{ flex: 1 }}/>

    {/* Actions */}
    <div style={{ padding: '12px 16px 8px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button className="cta">⟳ Erneut spielen</button>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button className="cta ghost sm">Maschine ändern</button>
        <button className="cta ghost sm">Zum Hangar</button>
      </div>
    </div>

    <HomeBar/>
  </div>
);

const RewardRow = ({ icon, iconColor, label, value, sub }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px dashed var(--line-soft)' }}>
    <div style={{ width: 26, height: 26, display: 'grid', placeItems: 'center', background: 'var(--bg-deep)', border: '1px solid var(--line)', color: iconColor, fontSize: 14 }}>{icon}</div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 13, color: 'var(--bone)', fontWeight: 600 }}>{label}</div>
      {sub && <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.12em', marginTop: 1 }}>{sub}</div>}
    </div>
    <div className="disp tnum" style={{ fontSize: 18, fontWeight: 700, color: iconColor, letterSpacing: '0.02em' }}>{value}</div>
  </div>
);

const PerfTile = ({ k, v }) => (
  <div className="tile" style={{ padding: 8, textAlign: 'center' }}>
    <div className="k">{k}</div>
    <div className="v" style={{ fontSize: 18 }}>{v}</div>
  </div>
);

window.Screen_MatchEnd = Screen_MatchEnd;
