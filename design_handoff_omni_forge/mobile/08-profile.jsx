// mobile/08-profile.jsx — Profile / Stats / Match history

const Screen_Profile = () => (
  <div className="mob">
    <StatusBar/>
    <AppBar
      title="Profil"
      sub="OPERATOR · CPT.J"
      left={<button className="cta ghost sm" style={{ width: 'auto', minHeight: 32, padding: '6px 10px' }}><IcBack/></button>}
      right={<button className="cta ghost sm" style={{ width: 'auto', minHeight: 32, padding: '6px 10px' }}><IcMore/></button>}
    />

    <div style={{ flex: 1, overflowY: 'auto' }}>
      {/* Identity card */}
      <div style={{ padding: 16, display: 'flex', gap: 14, alignItems: 'flex-start', borderBottom: '1px solid var(--line)', background: 'radial-gradient(ellipse at top right, rgba(111,200,216,0.08), transparent)' }}>
        {/* Avatar — stenciled hex */}
        <div style={{
          width: 76, height: 76, position: 'relative',
          border: '1px solid var(--cyan-dim)', background: 'var(--cyan-ink)',
          display: 'grid', placeItems: 'center',
        }}>
          <span className="disp" style={{ fontSize: 30, fontWeight: 700, color: 'var(--cyan-soft)', letterSpacing: '0.04em' }}>J4</span>
          <div style={{ position: 'absolute', top: -5, right: -5, background: 'var(--bg-deep)', border: '1px solid var(--amber)', color: 'var(--amber)', fontFamily: 'var(--f-mono)', fontSize: 9, padding: '1px 5px', letterSpacing: '0.12em' }}>14</div>
        </div>
        <div style={{ flex: 1 }}>
          <div className="disp" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.04em' }}>CPT.J</div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--bone-dim)', letterSpacing: '0.16em', marginTop: 1 }}>4-FOXTROT · LEUTNANT</div>
          <div className="mono" style={{ fontSize: 10, color: 'var(--bone-mute)', letterSpacing: '0.06em', marginTop: 6 }}>BEITRITT 14.05.2026 · 218 EINSÄTZE</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <span className="chip"><span className="ico" style={{ color: 'var(--amber)' }}>★</span><span className="v">ELO 1420</span></span>
            <span className="chip"><span className="ico" style={{ color: 'var(--green)' }}>▲</span><span className="v">+24</span></span>
          </div>
        </div>
      </div>

      {/* Stat grid */}
      <div style={{ padding: '12px 16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        <StatBig k="Siege" v="142" sub="65% Quote" tone="var(--green)"/>
        <StatBig k="KDR"   v="2.14" sub="Top 8%"   tone="var(--cyan-soft)"/>
        <StatBig k="Drohnen" v="831" sub="2.8 / Match" tone="var(--amber)"/>
      </div>

      {/* Recent matches */}
      <div style={{ padding: '12px 16px' }}>
        <div className="label" style={{ marginBottom: 8 }}>Letzte 5 Einsätze</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <MatchRow win mode="3v3 STD" time="04:18" kda="7/2/3"/>
          <MatchRow mode="1v1 RNK"  time="03:42" kda="2/4/0" loss/>
          <MatchRow win mode="3v3 STD" time="05:01" kda="9/1/4"/>
          <MatchRow win mode="FFA"     time="06:24" kda="11/3/0"/>
          <MatchRow mode="3v3 STD" time="04:55" kda="3/5/2" loss/>
        </div>
      </div>

      {/* Loadouts */}
      <div style={{ padding: '12px 16px' }}>
        <div className="label" style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
          <span>Gespeicherte Loadouts</span>
          <span className="mono" style={{ color: 'var(--cyan-soft)', cursor: 'pointer' }}>+ Neu</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <LoadoutCard active name="«Kleio»" sub="Hybrid · 7 Mod" pwr="62%" mass="61%"/>
          <LoadoutCard name="«Brutus»" sub="Festung · 9 Mod" pwr="89%" mass="94%"/>
          <LoadoutCard name="«Vega»" sub="Späher · 4 Mod" pwr="32%" mass="28%"/>
          <LoadoutCard name="«Ragna»" sub="Kamikaze · 3 Mod" pwr="48%" mass="22%"/>
        </div>
      </div>

      {/* Achievements teaser */}
      <div style={{ padding: '12px 16px 24px' }}>
        <div className="label" style={{ marginBottom: 8 }}>Auszeichnungen · 14 / 80</div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 6 }}>
          {[
            { ico: '◆', col: 'var(--amber)' },
            { ico: '✦', col: 'var(--cyan-soft)' },
            { ico: '⚔', col: 'var(--red-bright)' },
            { ico: '★', col: 'var(--green)' },
            { ico: '◉', col: 'var(--bone-faint)' },
            { ico: '◯', col: 'var(--bone-faint)' },
          ].map((a, i) => (
            <div key={i} style={{
              minWidth: 56, height: 56,
              border: `1px solid ${a.col === 'var(--bone-faint)' ? 'var(--line)' : a.col}`,
              background: 'rgba(0,0,0,0.4)',
              display: 'grid', placeItems: 'center',
              color: a.col, fontSize: 22,
            }}>{a.ico}</div>
          ))}
        </div>
      </div>
    </div>

    <TabBar active="profil"/>
    <HomeBar/>
  </div>
);

const StatBig = ({ k, v, sub, tone }) => (
  <div className="tile" style={{ padding: 10 }}>
    <div className="k">{k}</div>
    <div className="v" style={{ fontSize: 24, color: tone || 'var(--bone)' }}>{v}</div>
    <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.1em' }}>{sub}</div>
  </div>
);

const MatchRow = ({ win, loss, mode, time, kda }) => {
  const col = win ? 'var(--green)' : 'var(--red-bright)';
  const tag = win ? 'SIEG' : 'NDLG';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr auto auto', gap: 10, alignItems: 'center', padding: '8px 10px', border: '1px solid var(--line-soft)', background: 'rgba(20,22,16,0.5)' }}>
      <span className="disp" style={{ fontSize: 11, fontWeight: 700, color: col, letterSpacing: '0.12em' }}>{tag}</span>
      <span style={{ fontSize: 12, color: 'var(--bone-mute)' }}>{mode}</span>
      <span className="mono" style={{ fontSize: 10, color: 'var(--bone-dim)', letterSpacing: '0.1em' }}>{kda}</span>
      <span className="mono" style={{ fontSize: 10, color: 'var(--bone-faint)' }}>{time}</span>
    </div>
  );
};

const LoadoutCard = ({ active, name, sub, pwr, mass }) => (
  <div style={{
    padding: 12,
    border: `1px solid ${active ? 'var(--cyan-dim)' : 'var(--line)'}`,
    background: active ? 'var(--cyan-ink)' : 'rgba(20,22,16,0.5)',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span className="disp" style={{ fontSize: 14, fontWeight: 700 }}>{name}</span>
      {active && <span className="mono" style={{ fontSize: 9, color: 'var(--cyan-soft)', letterSpacing: '0.18em' }}>● AKTIV</span>}
    </div>
    <div className="mono" style={{ fontSize: 10, color: 'var(--bone-dim)', letterSpacing: '0.08em', marginTop: 2 }}>{sub}</div>
    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
      <div style={{ flex: 1 }}>
        <div className="mono" style={{ fontSize: 8, color: 'var(--bone-dim)', letterSpacing: '0.2em' }}>PWR</div>
        <div className="bar" style={{ height: 3, marginTop: 2 }}><i style={{ width: pwr }}/></div>
      </div>
      <div style={{ flex: 1 }}>
        <div className="mono" style={{ fontSize: 8, color: 'var(--bone-dim)', letterSpacing: '0.2em' }}>MAS</div>
        <div className="bar warn" style={{ height: 3, marginTop: 2 }}><i style={{ width: mass }}/></div>
      </div>
    </div>
  </div>
);

window.Screen_Profile = Screen_Profile;
