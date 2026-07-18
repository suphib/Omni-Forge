// mobile/05-matchmaking.jsx — Mode select + Searching

const Screen_Matchmaking = () => (
  <div className="mob" style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(60,80,55,0.12), #0a0b07 70%)' }}>
    <StatusBar/>
    <AppBar
      title="Matchmaking"
      sub="GEEIGNETER GEGNER WIRD GESUCHT"
      left={<button className="cta ghost sm" style={{ width: 'auto', minHeight: 32, padding: '6px 10px' }}><IcBack/></button>}
    />

    {/* Mode pill */}
    <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'center' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '8px 18px', border: '1px solid var(--cyan-dim)',
        background: 'var(--cyan-ink)', color: 'var(--cyan-soft)',
      }}>
        <span style={{ fontSize: 14 }}>⚔</span>
        <span className="disp" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.16em' }}>STANDARD · 3v3</span>
        <span className="mono" style={{ fontSize: 10, color: 'var(--bone-mute)' }}>· SEKTOR 7 OST</span>
      </div>
    </div>

    {/* Searching animation */}
    <div style={{ flex: 1, position: 'relative', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'relative', width: 240, height: 240 }}>
        {/* Pulse rings */}
        {[0,1,2].map(i => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            border: '1px solid var(--cyan-soft)', borderRadius: '50%',
            animation: `search-pulse 2.4s ease-out ${i*0.8}s infinite`,
          }}/>
        ))}
        {/* Rotating outer ring */}
        <svg viewBox="0 0 240 240" style={{ position: 'absolute', inset: 0, animation: 'ring-rotate 8s linear infinite' }}>
          <circle cx="120" cy="120" r="110" fill="none" stroke="rgba(143,210,222,0.25)" strokeWidth="1" strokeDasharray="3 8"/>
          <circle cx="120" cy="10" r="3" fill="var(--cyan-soft)"/>
          <circle cx="230" cy="120" r="2" fill="var(--cyan-soft)" opacity="0.5"/>
        </svg>
        {/* Static rings */}
        <svg viewBox="0 0 240 240" style={{ position: 'absolute', inset: 0 }}>
          <circle cx="120" cy="120" r="88" fill="none" stroke="rgba(143,210,222,0.18)" strokeWidth="0.5"/>
          <circle cx="120" cy="120" r="60" fill="none" stroke="rgba(143,210,222,0.25)" strokeWidth="0.6"/>
          <circle cx="120" cy="120" r="38" fill="none" stroke="rgba(143,210,222,0.4)" strokeWidth="0.8"/>
        </svg>
        {/* Center logo */}
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          <BrandMarkSmall size={56}/>
        </div>
        {/* Tactical readout */}
        <div style={{ position: 'absolute', top: -28, left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
          <div className="mono" style={{ fontSize: 9, color: 'var(--cyan-dim)', letterSpacing: '0.32em' }}>SCAN</div>
        </div>
      </div>
    </div>

    {/* Timer + region */}
    <div style={{ padding: '12px 16px 0', textAlign: 'center' }}>
      <div className="disp" style={{ fontSize: 32, fontWeight: 700, color: 'var(--cyan-soft)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em' }}>00:14</div>
      <div className="mono" style={{ fontSize: 10, color: 'var(--bone-dim)', letterSpacing: '0.22em', marginTop: 2 }}>SUCHE · REGION EU-WEST · PING 18MS</div>
    </div>

    {/* Player slot strip */}
    <div style={{ padding: 16 }}>
      <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.22em', marginBottom: 8 }}>OPERATOREN · 2 / 6</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
        <PlayerSlot ok name="CPT.J" tag="ME"/>
        <PlayerSlot ok name="VOLT" tag="ALLY"/>
        <PlayerSlot pending/>
        <PlayerSlot pending/>
        <PlayerSlot enemy/>
        <PlayerSlot enemy/>
      </div>

      {/* Skill range */}
      <div style={{ marginTop: 14, padding: '10px 12px', border: '1px solid var(--line)', background: 'rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.2em' }}>SKILL-FENSTER · ELO 1420 ± 80</span>
          <span className="mono" style={{ fontSize: 9, color: 'var(--amber)', letterSpacing: '0.16em' }}>ERWEITERUNG IN 14s</span>
        </div>
        <div className="bar" style={{ height: 4 }}>
          <i style={{ width: '34%' }}/>
        </div>
      </div>
    </div>

    {/* Cancel */}
    <div style={{ padding: '0 16px 12px' }}>
      <button className="cta ghost">Abbrechen</button>
    </div>

    <HomeBar/>
  </div>
);

const PlayerSlot = ({ ok, pending, enemy, name, tag }) => {
  const color = ok ? 'var(--green)' : enemy ? 'var(--red-bright)' : 'var(--bone-faint)';
  const bg = ok ? 'rgba(127,176,74,0.08)' : enemy ? 'rgba(217,72,56,0.08)' : 'rgba(0,0,0,0.3)';
  return (
    <div style={{
      aspectRatio: '1', border: `1px solid ${color}`, background: bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
      position: 'relative',
    }}>
      {pending ? (
        <span style={{ fontSize: 14, color: 'var(--bone-faint)' }} className="blink">…</span>
      ) : (
        <>
          <span className="disp" style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color }}>{name}</span>
          <span className="mono" style={{ fontSize: 7, color: 'var(--bone-dim)', letterSpacing: '0.18em' }}>{tag}</span>
        </>
      )}
    </div>
  );
};

window.Screen_Matchmaking = Screen_Matchmaking;
