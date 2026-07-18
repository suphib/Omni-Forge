// mobile/06-match-hud.jsx — Mobile combat HUD

const Screen_MatchHud = () => (
  <div className="mob" style={{ position: 'relative', overflow: 'hidden' }}>
    {/* Battlefield backdrop */}
    <BattlefieldMobileBackdrop/>

    {/* Top status bar (custom, transparent) */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 24px 6px', zIndex: 20 }}>
      <span style={{ fontFamily: 'var(--f-display)', fontSize: 13, fontWeight: 600, color: 'var(--bone)' }}>21:47</span>
      <span className="mono" style={{ fontSize: 9, color: 'var(--bone-mute)', letterSpacing: '0.2em', textShadow: '0 0 4px black' }}>OP-FERROUS · 04:18</span>
      <span style={{ fontSize: 12, color: 'var(--bone)' }}>●●● 89%</span>
    </div>

    {/* Top HUD strip */}
    <div style={{ position: 'absolute', top: 44, left: 12, right: 12, display: 'grid', gridTemplateColumns: '1fr 86px', gap: 8, zIndex: 15 }}>
      {/* Vital bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '8px 10px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--line)', backdropFilter: 'blur(4px)' }}>
        <VBar label="PANZ" value="78%" pct={0.78} tone=""/>
        <VBar label="PWR"  value="64%" pct={0.64} tone=""/>
        <VBar label="HITZ" value="42%" pct={0.42} tone="warn"/>
      </div>
      {/* Mini radar */}
      <div style={{ aspectRatio: '1', border: '1px solid var(--cyan-dim)', background: 'radial-gradient(circle at center, rgba(111,200,216,0.10), rgba(0,0,0,0.6) 70%)', position: 'relative', overflow: 'hidden' }}>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
          <circle cx="50" cy="50" r="42" stroke="rgba(143,210,222,0.18)" strokeWidth="0.5" fill="none"/>
          <circle cx="50" cy="50" r="28" stroke="rgba(143,210,222,0.18)" strokeWidth="0.5" fill="none"/>
          <circle cx="50" cy="50" r="14" stroke="rgba(143,210,222,0.18)" strokeWidth="0.5" fill="none"/>
          <line x1="50" y1="8" x2="50" y2="92" stroke="rgba(143,210,222,0.12)"/>
          <line x1="8" y1="50" x2="92" y2="50" stroke="rgba(143,210,222,0.12)"/>
          <circle cx="65" cy="32" r="2" fill="var(--red-bright)"/>
          <circle cx="72" cy="46" r="2" fill="var(--red-bright)"/>
          <circle cx="32" cy="62" r="2" fill="var(--red-bright)"/>
          <circle cx="42" cy="40" r="2" fill="var(--green)"/>
          <circle cx="50" cy="50" r="2.5" fill="var(--cyan-soft)"/>
          <g style={{ transformOrigin: '50px 50px', animation: 'radar-sweep 3s linear infinite' }}>
            <line x1="50" y1="50" x2="50" y2="8" stroke="var(--cyan)" strokeWidth="0.8" opacity="0.6"/>
            <path d="M50 50 L50 8 A42 42 0 0 1 80 22 Z" fill="var(--cyan)" opacity="0.15"/>
          </g>
        </svg>
        <div style={{ position: 'absolute', top: 3, left: 4 }}>
          <span className="mono" style={{ fontSize: 7, color: 'var(--cyan-soft)', letterSpacing: '0.18em' }}>RADAR</span>
        </div>
      </div>
    </div>

    {/* Side: drone command (left) */}
    <div style={{ position: 'absolute', left: 8, top: 200, zIndex: 15, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <DroneSlot ready code="A" label="SCT"/>
      <DroneSlot ready code="B" label="RK"/>
      <DroneSlot building eta="18" code="C" label="MD"/>
      <DroneSlot queued code="D" label="BB"/>
    </div>

    {/* Side: alerts (right) */}
    <div style={{ position: 'absolute', right: 8, top: 200, zIndex: 15, display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
      {/* Self-destruct */}
      <button className="touch-btn fire sm" style={{ width: 60, height: 60 }} title="Selbstzerstörung">
        <div style={{ fontSize: 18 }}>⚠</div>
        <div style={{ fontSize: 8, marginTop: -2, letterSpacing: '0.14em' }}>SD</div>
      </button>
      {/* Pause */}
      <button className="touch-btn sm">
        <div style={{ fontSize: 16 }}>❘❘</div>
      </button>
      {/* Squad ping */}
      <button className="touch-btn sm" style={{ borderColor: 'var(--amber)', color: 'var(--amber)' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.1em' }}>PING</div>
      </button>
    </div>

    {/* Center crosshair */}
    <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 12, pointerEvents: 'none' }}>
      <svg width="160" height="160" viewBox="0 0 160 160" style={{ filter: 'drop-shadow(0 0 6px rgba(111,200,216,0.5))' }}>
        <circle cx="80" cy="80" r="68" fill="none" stroke="var(--cyan-soft)" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.5"/>
        <circle cx="80" cy="80" r="42" fill="none" stroke="var(--cyan-soft)" strokeWidth="1" opacity="0.7"/>
        <line x1="80" y1="50" x2="80" y2="65" stroke="var(--cyan-soft)" strokeWidth="1.5"/>
        <line x1="80" y1="95" x2="80" y2="110" stroke="var(--cyan-soft)" strokeWidth="1.5"/>
        <line x1="50" y1="80" x2="65" y2="80" stroke="var(--cyan-soft)" strokeWidth="1.5"/>
        <line x1="95" y1="80" x2="110" y2="80" stroke="var(--cyan-soft)" strokeWidth="1.5"/>
        <circle cx="80" cy="80" r="2" fill="var(--cyan-soft)"/>
        {[[14,14,0],[146,14,90],[146,146,180],[14,146,270]].map(([x,y,r], i) => (
          <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
            <path d="M0 0 L10 0 M0 0 L0 10" stroke="var(--cyan-soft)" strokeWidth="1.5" fill="none"/>
          </g>
        ))}
        <text x="80" y="34" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="var(--cyan-dim)" letterSpacing="1.2">418M</text>
        <text x="80" y="138" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="var(--bone-dim)" letterSpacing="1">ZIEL · ZWERG-MK2</text>
      </svg>
    </div>

    {/* Threat marker overlay */}
    <div style={{ position: 'absolute', left: '20%', top: '32%', zIndex: 11, color: 'var(--red-bright)', fontFamily: 'var(--f-mono)', textShadow: '0 0 4px black' }}>
      <svg width="20" height="20"><path d="M3 3 L17 3 L17 7 M3 3 L3 7 M3 17 L3 13 M17 17 L17 13 M3 17 L17 17" stroke="currentColor" strokeWidth="1.3" fill="none"/></svg>
      <div style={{ fontSize: 8, letterSpacing: '0.14em', textAlign: 'center' }}>518M</div>
    </div>
    <div style={{ position: 'absolute', right: '18%', top: '38%', zIndex: 11, color: 'var(--red-bright)', fontFamily: 'var(--f-mono)', textShadow: '0 0 4px black' }}>
      <svg width="20" height="20"><path d="M3 3 L17 3 L17 7 M3 3 L3 7 M3 17 L3 13 M17 17 L17 13 M3 17 L17 17" stroke="currentColor" strokeWidth="1.3" fill="none"/></svg>
      <div style={{ fontSize: 8, letterSpacing: '0.14em', textAlign: 'center' }}>710M</div>
    </div>

    {/* Bottom: joystick + weapon buttons */}
    <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 20px', zIndex: 16 }}>
      {/* Joystick */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <div className="touch-pad">
          <div className="nub"/>
        </div>
        <span className="mono" style={{ fontSize: 9, color: 'var(--cyan-dim)', letterSpacing: '0.2em' }}>BEWEGEN</span>
      </div>

      {/* Weapon trio — arc layout */}
      <div style={{ position: 'relative', width: 160, height: 140 }}>
        {/* Rocket (top-left of arc) */}
        <div style={{ position: 'absolute', top: 0, left: 0 }}>
          <WeaponButton code="WPN-126" name="RKT" ammo="8" cd={0}/>
        </div>
        {/* Plasma blade (top-right) */}
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <WeaponButton code="WPN-203" name="LCS" ammo="∞" cd={0} cyan/>
        </div>
        {/* Kinetic (bottom — primary, biggest) */}
        <div style={{ position: 'absolute', bottom: -4, right: 22 }}>
          <WeaponButton primary code="WPN-088" name="KN-88" ammo="18" cd={0.4}/>
        </div>
      </div>
    </div>

    {/* Tactical feed strip (bottom) */}
    <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, zIndex: 14, padding: '6px 10px', background: 'rgba(0,0,0,0.55)', border: '1px solid var(--line-soft)', display: 'flex', alignItems: 'center', gap: 8 }}>
      <span className="mono" style={{ fontSize: 8, color: 'var(--green)', letterSpacing: '0.2em' }}>KILL</span>
      <span style={{ fontSize: 11, color: 'var(--bone)' }}>ZWERG-4 zerstört</span>
      <span style={{ marginLeft: 'auto', fontFamily: 'var(--f-mono)', fontSize: 9, color: 'var(--amber)' }}>+120 ◆</span>
    </div>

    <HomeBar/>
  </div>
);

const VBar = ({ label, value, pct, tone }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    <span className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.18em', width: 28 }}>{label}</span>
    <div className={`bar ${tone}`} style={{ flex: 1, height: 4 }}>
      <i style={{ width: `${pct * 100}%` }}/>
    </div>
    <span className="mono tnum" style={{ fontSize: 10, color: tone === 'warn' ? 'var(--amber)' : 'var(--bone)', width: 32, textAlign: 'right' }}>{value}</span>
  </div>
);

const DroneSlot = ({ ready, building, queued, eta, code, label }) => {
  const col = ready ? 'var(--cyan-soft)' : building ? 'var(--amber)' : 'var(--bone-faint)';
  const bg = ready ? 'rgba(111,200,216,0.10)' : building ? 'rgba(212,168,44,0.10)' : 'rgba(0,0,0,0.4)';
  return (
    <div style={{
      width: 48, padding: '6px 4px',
      border: `1px solid ${col}`, background: bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
      backdropFilter: 'blur(4px)',
    }}>
      <span style={{ fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 14, color: col, letterSpacing: '0.04em' }}>{code}</span>
      <span className="mono" style={{ fontSize: 8, color: 'var(--bone-mute)', letterSpacing: '0.16em' }}>{label}</span>
      {building && <span className="mono" style={{ fontSize: 8, color: col, marginTop: 1 }}>{eta}s</span>}
      {queued && <span className="mono blink" style={{ fontSize: 8, color: 'var(--bone-faint)' }}>...</span>}
    </div>
  );
};

const WeaponButton = ({ primary, code, name, ammo, cd, cyan }) => {
  const size = primary ? 92 : 72;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <div className={`touch-btn ${cyan ? 'cyan' : 'fire'}`} style={{ width: size, height: size, position: 'relative', flexDirection: 'column' }}>
        <span className="mono" style={{ fontSize: 7, color: 'var(--bone-mute)', letterSpacing: '0.18em', position: 'absolute', top: 6 }}>{code}</span>
        <span className="disp" style={{ fontSize: primary ? 18 : 14, fontWeight: 700, letterSpacing: '0.08em', marginTop: primary ? 4 : 2 }}>{name}</span>
        <span className="mono tnum" style={{ fontSize: primary ? 16 : 12, color: 'var(--bone)', marginTop: primary ? 4 : 1 }}>{ammo}</span>
        {cd > 0 && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'var(--red-bright)', width: `${(1 - cd)*100}%` }}/>
        )}
      </div>
    </div>
  );
};

const BattlefieldMobileBackdrop = () => (
  <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #5c4a35 0%, #74604a 32%, #4a3d2c 55%, #2a2418 72%, #181410 100%)' }}/>
    <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 70%, rgba(180,140,90,0.35), transparent 60%)', mixBlendMode: 'screen' }}/>
    <svg viewBox="0 0 390 300" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', left: 0, right: 0, bottom: '32%', width: '100%', height: '40%', opacity: 0.85 }}>
      <defs>
        <linearGradient id="hud-silh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a221a"/>
          <stop offset="100%" stopColor="#0e0b08"/>
        </linearGradient>
      </defs>
      <path fill="url(#hud-silh)" d="M0 300 L0 220 L40 215 L80 200 L120 210 L160 185 L200 195 L240 175 L280 188 L320 170 L360 185 L390 175 L390 300 Z"/>
      <rect x="120" y="190" width="3" height="20" fill="#0a0806"/>
      <rect x="240" y="170" width="2" height="15" fill="#0a0806"/>
    </svg>
    <div style={{ position: 'absolute', inset: '68% 0 0 0', background: 'linear-gradient(180deg, #2a2418 0%, #1a1610 30%, #0a0806 100%)' }}/>
    <svg viewBox="0 0 390 200" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '32%', opacity: 0.4 }}>
      <defs>
        <linearGradient id="hud-gridfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(111,200,216,0)"/>
          <stop offset="100%" stopColor="rgba(111,200,216,0.5)"/>
        </linearGradient>
        <pattern id="hud-g" width="40" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 0 L40 0 M0 0 L0 20" stroke="url(#hud-gridfade)" strokeWidth="0.5" fill="none"/>
        </pattern>
      </defs>
      <rect width="390" height="200" fill="url(#hud-g)"/>
    </svg>
    <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 120px 40px rgba(0,0,0,0.7)' }}/>
  </div>
);

window.Screen_MatchHud = Screen_MatchHud;
