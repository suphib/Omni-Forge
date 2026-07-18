// mobile/04-werkstatt.jsx — Mobile build mode

const Screen_Werkstatt = () => {
  const equipped = ['tx-mk4', 'kn-88', 'lcs-3', 'rkt-12', 'arm-a', 'hgr-6', 'rep-1'];
  return (
    <div className="mob">
      <StatusBar/>
      <AppBar
        title="Werkstatt"
        sub="HALTERUNG 03 · ARSENAL 7B"
        left={<button className="cta ghost sm" style={{ width: 'auto', minHeight: 32, padding: '6px 10px' }}><IcBack/></button>}
        right={<button className="cta sm" style={{ width: 'auto', minHeight: 32, padding: '6px 14px', letterSpacing: '0.18em' }}>Bereit ▸</button>}
      />

      {/* Mech preview */}
      <div style={{ position: 'relative', height: 240, borderBottom: '1px solid var(--line)', background: 'radial-gradient(ellipse at center, rgba(60,80,55,0.18), transparent 70%)', overflow: 'hidden' }}>
        {/* Floor grid */}
        <svg style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: 80, opacity: 0.4 }} viewBox="0 0 390 80" preserveAspectRatio="xMidYMax slice">
          <defs>
            <linearGradient id="wmfade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(143,210,222,0)"/>
              <stop offset="100%" stopColor="rgba(143,210,222,0.5)"/>
            </linearGradient>
            <pattern id="wmg" width="30" height="15" patternUnits="userSpaceOnUse">
              <path d="M0 0 L30 0 M0 0 L0 15" stroke="url(#wmfade)" strokeWidth="0.5" fill="none"/>
            </pattern>
          </defs>
          <rect width="390" height="80" fill="url(#wmg)"/>
        </svg>

        <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)' }}>
          <MechMiniSilhouette size={220}/>
        </div>

        {/* Top callout: name */}
        <div style={{ position: 'absolute', top: 12, left: 12 }}>
          <div className="mono" style={{ fontSize: 9, color: 'var(--cyan-dim)', letterSpacing: '0.22em' }}>CHS-7041-MATR</div>
          <div className="disp" style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.04em' }}>T-7 «KLEIO»</div>
        </div>

        {/* Rotation control */}
        <div style={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.6)', border: '1px solid var(--line)', padding: '4px 8px' }}>
          <span style={{ color: 'var(--bone-dim)' }}>◀</span>
          <span className="mono" style={{ fontSize: 10, color: 'var(--cyan-soft)', letterSpacing: '0.12em' }}>FRONT</span>
          <span style={{ color: 'var(--bone-dim)' }}>▶</span>
        </div>

        {/* Live stats overlay (left) */}
        <div style={{ position: 'absolute', left: 12, bottom: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {[
            { k: 'PWR', v: '1490 / 2400', tone: '' },
            { k: 'MAS', v: '7.290 / 12K', tone: '' },
            { k: 'DPS', v: '610',         tone: 'var(--amber)' },
          ].map(s => (
            <div key={s.k} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 10 }}>
              <span className="mono" style={{ color: 'var(--bone-dim)', letterSpacing: '0.18em', width: 30 }}>{s.k}</span>
              <span className="mono tnum" style={{ color: s.tone || 'var(--bone)', fontSize: 11 }}>{s.v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid var(--line)' }}>
        {[
          { id: 'antrieb', n: 'Antrieb',  c: 'PRP', a: true },
          { id: 'waffen',  n: 'Waffen',   c: 'WPN', a: false },
          { id: 'panz',    n: 'Panzerung',c: 'ARM', a: false },
          { id: 'spez',    n: 'Spezial',  c: 'SPC', a: false },
        ].map(t => (
          <div key={t.id} style={{
            padding: '12px 4px', textAlign: 'center', cursor: 'pointer',
            color: t.a ? 'var(--cyan-soft)' : 'var(--bone-dim)',
            background: t.a ? 'var(--cyan-ink)' : 'transparent',
            borderRight: '1px solid var(--line-soft)',
            position: 'relative',
          }}>
            <div className="disp" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{t.n}</div>
            <div className="mono" style={{ fontSize: 8, letterSpacing: '0.22em', marginTop: 2, opacity: 0.7 }}>{t.c}</div>
            {t.a && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'var(--cyan-soft)' }}/>}
          </div>
        ))}
      </div>

      {/* Modules list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 8, background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0 8px' }}>
          <span className="label">Antrieb · 3 verfügbar</span>
          <div style={{ flex: 1 }}/>
          <span className="mono" style={{ fontSize: 10, color: 'var(--bone-mute)', letterSpacing: '0.12em' }}>Sortiert: Gewicht</span>
        </div>

        <ModuleRow
          eq={true}
          name="Kettenlauf TX-MK4"
          code="PRP-041"
          note="Doppelketten · Allgelände"
          mass="1.850 KG"
          pwr="-280 kW"
          glyph="track"
        />
        <ModuleRow
          name="Servo-Bein MECH-7"
          code="PRP-072"
          note="Hexapod · Klettertauglich"
          mass="1.420 KG"
          pwr="-340 kW"
          glyph="leg"
        />
        <ModuleRow
          name="Hover-Rotor R-II"
          code="PRP-118"
          note="Antigrav · 4m Bodenfrei"
          mass="0.980 KG"
          pwr="-520 kW"
          glyph="rotor"
        />

        {/* Logic mini card */}
        <div className="card" style={{ marginTop: 8 }}>
          <div className="card-hd">
            <span style={{ color: 'var(--amber)' }}>●</span> Logik-Editor <span style={{ marginLeft: 'auto', color: 'var(--bone-faint)', fontSize: 10 }}>4 REGELN</span>
          </div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--bone-mute)', lineHeight: 1.6 }}>
            <span style={{ color: 'var(--amber)' }}>WENN</span> HP &lt; 10% <span style={{ color: 'var(--cyan-soft)' }}>↦ DANN</span> Selbstzerstörung<br/>
            <span style={{ color: 'var(--amber)' }}>WENN</span> Schrott ≥ 80kg <span style={{ color: 'var(--cyan-soft)' }}>↦ DANN</span> baue Boden-Bot<br/>
            <span style={{ color: 'var(--bone-faint)' }}>+ 2 weitere Regeln</span>
          </div>
        </div>
      </div>

      {/* Bottom action sheet preview */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--line)', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1 }}>
          <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.2em' }}>BILANZ</div>
          <div className="mono" style={{ fontSize: 12, color: 'var(--cyan-soft)', letterSpacing: '0.04em' }}>62% Energie · 61% Gewicht</div>
        </div>
        <button className="cta ghost sm" style={{ width: 'auto', minHeight: 40, padding: '8px 14px' }}>Speichern</button>
        <button className="cta sm" style={{ width: 'auto', minHeight: 40, padding: '8px 18px' }}>Deploy ▸</button>
      </div>

      <HomeBar/>
    </div>
  );
};

const ModuleRow = ({ eq, name, code, note, mass, pwr, glyph }) => (
  <div className={`mchip ${eq ? 'eq' : ''}`}>
    <div className="ico"><ModGlyph kind={glyph}/></div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div className="nm">{name}</div>
      <div className="sm">{code} · {note}</div>
    </div>
    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 1 }}>
      <span className="mono" style={{ fontSize: 10, color: 'var(--bone)' }}>{mass}</span>
      <span className="mono" style={{ fontSize: 10, color: 'var(--red-bright)' }}>{pwr}</span>
    </div>
  </div>
);

const ModGlyph = ({ kind }) => {
  const g = {
    track: <g><rect x="4" y="11" width="16" height="6" rx="3" stroke="currentColor" fill="none" strokeWidth="1.3"/><circle cx="9" cy="14" r="1.3" fill="currentColor"/><circle cx="15" cy="14" r="1.3" fill="currentColor"/></g>,
    leg:   <g stroke="currentColor" strokeWidth="1.3" fill="none"><path d="M6 4 L9 12 L8 20 M18 4 L15 12 L16 20"/></g>,
    rotor: <g stroke="currentColor" strokeWidth="1.3" fill="none"><circle cx="12" cy="12" r="3.5"/><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/></g>,
  };
  return <svg viewBox="0 0 24 24" width="22" height="22">{g[kind] || <rect x="6" y="6" width="12" height="12" stroke="currentColor" fill="none" strokeWidth="1.3"/>}</svg>;
};

window.Screen_Werkstatt = Screen_Werkstatt;
