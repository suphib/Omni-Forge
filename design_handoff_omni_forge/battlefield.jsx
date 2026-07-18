// battlefield.jsx — Schlachtfeld (Combat HUD)
// Tactical military overlay. Dusty arena, weapon slots, drone hangar, radar, self-destruct.

const { useState: useStateB, useEffect: useEffectB, useRef: useRefB } = React;

const BattlefieldView = ({ equipped, sdTimer }) => {
  const { MODULES, DRONES } = window.OF_DATA;
  const [armor, setArmor] = useStateB(78);
  const [power, setPower] = useStateB(64);
  const [ammo, setAmmo]   = useStateB({ 'kn-88': 18, 'lcs-3': 100, 'rkt-12': 8 });
  const [cd, setCd]       = useStateB({ 'kn-88': 0, 'lcs-3': 0, 'rkt-12': 0 });
  const [sdActive, setSdActive] = useStateB(false);
  const [sdRemain, setSdRemain] = useStateB(sdTimer);
  const [droneQueue, setDroneQueue] = useStateB(DRONES);
  const [feed, setFeed] = useStateB([
    { t: '00:14:22', tag: 'KILL', text: 'Hostile ZWERG-4 zerstört · +120 Schrott' },
    { t: '00:14:08', tag: 'WARN', text: 'Panzerung Sektor 2 unter 50%' },
    { t: '00:13:51', tag: 'INFO', text: 'Drohne SCT-1 erreicht Aufklärungspunkt B' },
    { t: '00:13:37', tag: 'INFO', text: 'Schmiede aktiv · Boden-Bot in Produktion' },
  ]);

  // Cooldown ticker
  useEffectB(() => {
    const id = setInterval(() => {
      setCd(prev => {
        const next = {};
        for (const k in prev) next[k] = Math.max(0, prev[k] - 0.1);
        return next;
      });
    }, 100);
    return () => clearInterval(id);
  }, []);

  // Drone production ticker
  useEffectB(() => {
    const id = setInterval(() => {
      setDroneQueue(prev => prev.map(d => {
        if (d.state === 'building') {
          const eta = Math.max(0, d.eta - 1);
          return { ...d, eta, state: eta === 0 ? 'ready' : 'building' };
        }
        if (d.state === 'queued' && !prev.some(o => o.state === 'building')) {
          return { ...d, state: 'building' };
        }
        return d;
      }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Self-destruct countdown
  useEffectB(() => {
    if (!sdActive) { setSdRemain(sdTimer); return; }
    const id = setInterval(() => {
      setSdRemain(r => {
        if (r <= 1) { clearInterval(id); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [sdActive, sdTimer]);

  const fire = (id) => {
    if (cd[id] > 0) return;
    const costs = { 'kn-88': { ammo: 1, cd: 0.8 }, 'lcs-3': { ammo: 0, cd: 1.4 }, 'rkt-12': { ammo: 1, cd: 2.6 } };
    const c = costs[id];
    if (c.ammo && ammo[id] <= 0) return;
    setCd(p => ({ ...p, [id]: c.cd }));
    setAmmo(p => ({ ...p, [id]: Math.max(0, p[id] - c.ammo) }));
    setFeed(f => [{ t: nowTime(), tag: 'FIRE', text: `${weaponName(id)} · Schuss abgegeben` }, ...f].slice(0, 8));
  };

  const launchDrone = (idx) => {
    setDroneQueue(prev => prev.map((d,i) => i === idx ? { ...d, state: 'deployed' } : d));
    setFeed(f => [{ t: nowTime(), tag: 'DRONE', text: `${droneQueue[idx].name} ausgeschleust` }, ...f].slice(0, 8));
  };

  const equippedWeapons = ['kn-88', 'lcs-3', 'rkt-12'].filter(w => equipped.includes(w));

  return (
    <div style={{ position: 'absolute', inset: '60px 0 0 0', overflow: 'hidden' }}>
      {/* Battlefield backdrop */}
      <BattlefieldBackdrop />

      {/* ── Compass strip ────────────────────────────────── */}
      <CompassStrip heading={67} />

      {/* ── Threat / unit markers around the world ───────── */}
      <WorldMarkers />

      {/* ── Top status strip ─────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 12, left: 12, right: 12,
        display: 'grid', gridTemplateColumns: '300px 1fr 360px 300px', gap: 12, zIndex: 10,
      }}>
        {/* Mission / unit */}
        <div className="panel bracket-corners" style={{ padding: '10px 14px' }}>
          <span className="bc-bl"></span><span className="bc-br"></span>
          <div className="label" style={{ color: 'var(--cyan-dim)' }}>Mission · OP-FERROUS</div>
          <div className="disp" style={{ fontSize: 16, fontWeight: 700, marginTop: 2, letterSpacing: '0.04em' }}>SEKTOR 7 · OST</div>
          <div className="code" style={{ marginTop: 2 }}>OBJ 02/04 · ETA 04:18</div>
        </div>

        {/* Vital bars across the top */}
        <div className="panel" style={{ padding: '10px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
            <VitalReadout label="Panzerung" code="ARM" value={`${armor}%`} pct={armor/100} tone={armor < 30 ? 'crit' : armor < 60 ? 'warn' : ''} />
            <VitalReadout label="Energie" code="PWR" value={`${power}%`} pct={power/100} tone={power < 30 ? 'crit' : power < 60 ? 'warn' : ''} />
            <VitalReadout label="Hitze" code="HET" value="42%" pct={0.42} tone="" />
          </div>
        </div>

        {/* SELF-DESTRUCT */}
        <div style={{ position: 'relative' }}>
          {!sdActive ? (
            <button
              onClick={() => setSdActive(true)}
              style={{
                width: '100%', height: '100%',
                background: 'linear-gradient(180deg, rgba(217,72,56,0.18), rgba(85,20,12,0.6))',
                border: '1.5px solid var(--red)', color: 'var(--red-bright)',
                fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 14, letterSpacing: '0.18em',
                textTransform: 'uppercase', cursor: 'pointer', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                animation: 'pulse-red 2s ease-in-out infinite',
              }}
            >
              <span style={{ fontSize: 22 }}>⚠</span>
              <div style={{ textAlign: 'left' }}>
                <div>Selbstzerstörung</div>
                <div className="mono" style={{ fontSize: 9, letterSpacing: '0.16em', color: 'var(--bone-mute)', fontWeight: 400, marginTop: 2 }}>WPN-999 · DOPPELKLICK</div>
              </div>
            </button>
          ) : (
            <div style={{
              width: '100%', height: '100%',
              background: 'rgba(217,72,56,0.25)',
              border: '2px solid var(--red-bright)', color: 'var(--red-bright)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
              animation: 'pulse-red 0.6s ease-in-out infinite',
              cursor: 'pointer',
            }} onClick={() => setSdActive(false)}>
              <div style={{ textAlign: 'right' }}>
                <div className="label" style={{ color: 'var(--red-bright)' }}>Detonation in</div>
                <div className="disp" style={{ fontSize: 11, color: 'var(--bone-mute)', letterSpacing: '0.14em', marginTop: 2 }}>ABBRUCH ‹ KLICKEN</div>
              </div>
              <div className="disp tnum" style={{ fontSize: 44, fontWeight: 700, letterSpacing: '0.04em' }}>
                T-{sdRemain.toString().padStart(2,'0')}
              </div>
            </div>
          )}
        </div>

        {/* Radar */}
        <div className="panel bracket-corners" style={{ padding: 0, position: 'relative', overflow: 'hidden' }}>
          <span className="bc-bl"></span><span className="bc-br"></span>
          <RadarMini />
          <div style={{ position: 'absolute', top: 6, left: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
            <span className="label" style={{ color: 'var(--cyan-soft)' }}>RADAR</span>
            <span className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)' }}>· 200M</span>
          </div>
          <div style={{ position: 'absolute', bottom: 6, right: 8, display: 'flex', gap: 6, fontSize: 9 }}>
            <span className="mono" style={{ color: 'var(--red-bright)' }}>● 4 FEIND</span>
            <span className="mono" style={{ color: 'var(--green)' }}>● 2 ALLY</span>
          </div>
        </div>
      </div>

      {/* ── Center crosshair ─────────────────────────────── */}
      <Crosshair active={Object.values(cd).some(v => v > 0)} />

      {/* ── Bottom-left: Drone Command ───────────────────── */}
      <div className="panel bracket-corners" style={{
        position: 'absolute', left: 12, bottom: 12, width: 420, zIndex: 10,
      }}>
        <span className="bc-bl"></span><span className="bc-br"></span>
        <div className="panel-hd">
          <span className="dot cyan"></span>
          <span className="title">Drohnen-Kommando</span>
          <span className="id">HGR-6 · BAY 06</span>
        </div>
        <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 280, overflowY: 'auto' }}>
          {droneQueue.map((d, i) => (
            <DroneRow key={d.id} d={d} onLaunch={() => launchDrone(i)} />
          ))}
        </div>
        <div style={{ padding: '8px 12px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10 }}>
          <span className="label">Fabrik-Befehl</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button className="btn ghost" style={{ padding: '4px 8px', fontSize: 9 }}>+ Späher</button>
            <button className="btn ghost" style={{ padding: '4px 8px', fontSize: 9 }}>+ Sprenger</button>
            <button className="btn primary" style={{ padding: '4px 8px', fontSize: 9 }}>+ Abwehr-Bot</button>
          </div>
        </div>
      </div>

      {/* ── Bottom-right: Weapon slots ───────────────────── */}
      <div style={{
        position: 'absolute', right: 12, bottom: 12, zIndex: 10,
        display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end',
      }}>
        {/* Weapon slot bar */}
        <div className="panel bracket-corners" style={{ padding: 12 }}>
          <span className="bc-bl"></span><span className="bc-br"></span>
          <div className="label" style={{ marginBottom: 8 }}>Waffen-Slots · QWE</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {equippedWeapons.map((id, idx) => (
              <WeaponSlot
                key={id}
                hotkey={['Q','W','E'][idx]}
                module={MODULES.find(m => m.id === id)}
                ammo={ammo[id]}
                maxAmmo={id === 'kn-88' ? 32 : id === 'rkt-12' ? 12 : 100}
                cd={cd[id]}
                cdMax={id === 'kn-88' ? 0.8 : id === 'lcs-3' ? 1.4 : 2.6}
                onFire={() => fire(id)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Right column: Tactical feed ──────────────────── */}
      <div className="panel bracket-corners" style={{
        position: 'absolute', right: 12, top: 140, width: 320, zIndex: 10,
      }}>
        <span className="bc-bl"></span><span className="bc-br"></span>
        <div className="panel-hd">
          <span className="dot green"></span>
          <span className="title">Taktik-Feed</span>
          <span className="id">LOG · LIVE</span>
        </div>
        <div style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 220, overflowY: 'auto' }}>
          {feed.map((f, i) => (
            <FeedRow key={i} {...f} />
          ))}
        </div>
      </div>

      {/* ── Left column: Squad / objectives ──────────────── */}
      <div className="panel bracket-corners" style={{
        position: 'absolute', left: 12, top: 140, width: 320, zIndex: 10,
      }}>
        <span className="bc-bl"></span><span className="bc-br"></span>
        <div className="panel-hd">
          <span className="dot amber"></span>
          <span className="title">Auftrag · OBJ</span>
          <span className="id">02 / 04</span>
        </div>
        <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Objective state="done"   name="Aufklärung Sektor 7" sub="SCT-1 · abgeschlossen"/>
          <Objective state="done"   name="Außenposten neutralisieren" sub="2 / 2 Bunker"/>
          <Objective state="active" name="Reaktor-Kern erreichen" sub="630m · Ost"/>
          <Objective state="locked" name="Exfiltration · Zone B" sub="—"/>
        </div>
        <div style={{ padding: '8px 12px', borderTop: '1px solid var(--line)' }}>
          <div className="label" style={{ marginBottom: 6 }}>Schrott · Reserve</div>
          <div className="mono tnum" style={{ fontSize: 22, color: 'var(--amber)' }}>437 <span style={{ fontSize: 11, color: 'var(--bone-dim)' }}>/ 1000 KG</span></div>
        </div>
      </div>
    </div>
  );
};

// ── Subcomponents ──────────────────────────────────────────

const nowTime = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
};
const weaponName = (id) => ({ 'kn-88': 'KN-88', 'lcs-3': 'LCS-3', 'rkt-12': 'RKT-12' }[id] || id);

const VitalReadout = ({ label, code, value, pct, tone }) => (
  <div>
    <div className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: tone === 'crit' ? 'var(--red-bright)' : 'var(--bone-dim)' }}>{label}</span>
      <span className="mono" style={{ color: 'var(--bone-faint)' }}>{code}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
      <span className="disp tnum" style={{ fontSize: 22, fontWeight: 700, color: tone === 'crit' ? 'var(--red-bright)' : tone === 'warn' ? 'var(--amber)' : 'var(--bone)' }}>{value}</span>
    </div>
    <div className={`bar ${tone}`} style={{ marginTop: 4, height: 4 }}>
      <i style={{ width: `${pct * 100}%` }}/>
    </div>
  </div>
);

const Crosshair = ({ active }) => (
  <div style={{
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    pointerEvents: 'none', zIndex: 5,
  }}>
    <svg width="220" height="220" viewBox="0 0 220 220" style={{ filter: active ? 'drop-shadow(0 0 6px rgba(217,72,56,0.6))' : 'drop-shadow(0 0 4px rgba(111,200,216,0.5))' }}>
      {/* Outer ring */}
      <circle cx="110" cy="110" r="95" fill="none" stroke={active ? 'var(--red)' : 'var(--cyan)'} strokeWidth="1" strokeDasharray="2 6" opacity="0.5"/>
      <circle cx="110" cy="110" r="60" fill="none" stroke={active ? 'var(--red)' : 'var(--cyan-soft)'} strokeWidth="1" opacity="0.7"/>
      {/* Center reticle */}
      <line x1="110" y1="70" x2="110" y2="95" stroke={active ? 'var(--red)' : 'var(--cyan-soft)'} strokeWidth="1.5"/>
      <line x1="110" y1="125" x2="110" y2="150" stroke={active ? 'var(--red)' : 'var(--cyan-soft)'} strokeWidth="1.5"/>
      <line x1="70" y1="110" x2="95" y2="110" stroke={active ? 'var(--red)' : 'var(--cyan-soft)'} strokeWidth="1.5"/>
      <line x1="125" y1="110" x2="150" y2="110" stroke={active ? 'var(--red)' : 'var(--cyan-soft)'} strokeWidth="1.5"/>
      <circle cx="110" cy="110" r="2" fill={active ? 'var(--red-bright)' : 'var(--cyan-soft)'}/>
      {/* Corner brackets */}
      {[[20,20,0],[200,20,90],[200,200,180],[20,200,270]].map(([x,y,r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path d="M0 0 L14 0 M0 0 L0 14" stroke={active ? 'var(--red)' : 'var(--cyan-soft)'} strokeWidth="1.5" fill="none"/>
        </g>
      ))}
      {/* Range labels */}
      <text x="110" y="40" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="9" fill="var(--cyan-dim)" letterSpacing="1.5">418M</text>
      <text x="110" y="190" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="var(--bone-dim)" letterSpacing="1">ZIEL · ZWERG-MK2</text>
    </svg>
  </div>
);

const RadarMini = () => (
  <div style={{ width: '100%', height: '100%', position: 'relative', background: 'radial-gradient(circle at center, rgba(111,200,216,0.10), rgba(0,0,0,0.6) 70%)' }}>
    <svg viewBox="0 0 200 100" width="100%" height="100%">
      {[20, 40, 60, 80].map(r => (
        <circle key={r} cx="100" cy="60" r={r/2} fill="none" stroke="rgba(111,200,216,0.18)" strokeWidth="0.5"/>
      ))}
      <line x1="100" y1="20" x2="100" y2="100" stroke="rgba(111,200,216,0.15)" strokeWidth="0.5"/>
      <line x1="60" y1="60" x2="140" y2="60" stroke="rgba(111,200,216,0.15)" strokeWidth="0.5"/>
      {/* Contacts */}
      <circle cx="120" cy="42" r="2" fill="var(--red-bright)"/>
      <circle cx="135" cy="52" r="2" fill="var(--red-bright)"/>
      <circle cx="78"  cy="70" r="2" fill="var(--red-bright)"/>
      <circle cx="88"  cy="80" r="2" fill="var(--red-bright)"/>
      <circle cx="106" cy="68" r="2.2" fill="var(--green)"/>
      <circle cx="92"  cy="55" r="2.2" fill="var(--green)"/>
      <circle cx="100" cy="60" r="3" fill="var(--cyan-soft)"/>
      {/* Sweep */}
      <g style={{ transformOrigin: '100px 60px', animation: 'radar-sweep 3s linear infinite' }}>
        <line x1="100" y1="60" x2="100" y2="20" stroke="var(--cyan)" strokeWidth="1" opacity="0.6"/>
        <path d="M100 60 L100 20 A40 40 0 0 1 128 32 Z" fill="var(--cyan)" opacity="0.12"/>
      </g>
    </svg>
  </div>
);

const WeaponSlot = ({ hotkey, module, ammo, maxAmmo, cd, cdMax, onFire }) => {
  const ready = cd <= 0.01;
  return (
    <div onClick={onFire} style={{
      width: 92, padding: 10,
      background: ready ? 'rgba(20,22,16,0.7)' : 'rgba(217,72,56,0.08)',
      border: `1px solid ${ready ? 'var(--line)' : 'var(--red-dim)'}`,
      cursor: 'pointer', position: 'relative', overflow: 'hidden',
      transition: 'all .12s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="mono" style={{ fontSize: 9, color: 'var(--cyan-soft)', letterSpacing: '0.16em' }}>{module.code}</span>
        <span className="mono" style={{
          fontSize: 9, padding: '1px 5px',
          border: '1px solid var(--line-strong)', color: 'var(--bone-mute)',
        }}>{hotkey}</span>
      </div>
      <div className="disp" style={{ fontSize: 13, fontWeight: 700, marginTop: 6, letterSpacing: '0.04em', color: ready ? 'var(--bone)' : 'var(--bone-mute)' }}>
        {module.name.split(' ').slice(-1)[0]}
      </div>
      <div className="mono tnum" style={{ fontSize: 18, marginTop: 6, color: ammo === 0 ? 'var(--red-bright)' : 'var(--bone)' }}>
        {ammo === 100 ? '∞' : ammo}
        <span style={{ fontSize: 10, color: 'var(--bone-dim)' }}>{ammo !== 100 && ` / ${maxAmmo}`}</span>
      </div>
      {/* Cooldown overlay */}
      {!ready && (
        <div style={{
          position: 'absolute', left: 0, bottom: 0, height: 4,
          background: 'var(--red-bright)',
          width: `${100 - (cd / cdMax) * 100}%`,
          transition: 'width 0.1s linear',
        }}/>
      )}
      {!ready && (
        <div className="mono blink" style={{ position: 'absolute', top: 6, right: 6, fontSize: 9, color: 'var(--red-bright)' }}>
          ◐ CD
        </div>
      )}
    </div>
  );
};

const DroneRow = ({ d, onLaunch }) => {
  const stateColor = {
    ready: 'var(--cyan-soft)',
    building: 'var(--amber)',
    queued: 'var(--bone-dim)',
    deployed: 'var(--green)',
  }[d.state];
  const stateLabel = { ready: 'BEREIT', building: 'IN BAU', queued: 'WARTEND', deployed: 'AKTIV' }[d.state];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '28px 1fr 70px 78px', gap: 8, alignItems: 'center',
      padding: '7px 8px', background: 'rgba(20,22,16,0.6)', border: '1px solid var(--line-soft)',
    }}>
      <div style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, background: 'var(--bg-deep)', border: '1px solid var(--line)', color: stateColor, fontFamily: 'var(--f-mono)', fontSize: 10 }}>
        {d.code.split('-')[1]}
      </div>
      <div>
        <div className="disp" style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.02em' }}>{d.name}</div>
        <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.1em', marginTop: 1 }}>{d.code}</div>
      </div>
      <div className="mono" style={{ fontSize: 10, color: stateColor, letterSpacing: '0.14em', textAlign: 'right' }}>
        {stateLabel}
        {d.state === 'building' && <div style={{ color: 'var(--bone-dim)', fontSize: 9, marginTop: 1 }}>{d.eta}s</div>}
      </div>
      <button
        onClick={onLaunch}
        disabled={d.state !== 'ready'}
        className={d.state === 'ready' ? 'btn primary' : 'btn ghost'}
        style={{ padding: '4px 6px', fontSize: 9, opacity: d.state === 'ready' ? 1 : 0.4 }}
      >
        {d.state === 'deployed' ? '◉ Aktiv' : '▸ Ausschleusen'}
      </button>
    </div>
  );
};

const FeedRow = ({ t, tag, text }) => {
  const tagCol = { KILL: 'var(--green)', WARN: 'var(--amber)', INFO: 'var(--cyan-soft)', FIRE: 'var(--red-bright)', DRONE: 'var(--cyan)' }[tag] || 'var(--bone)';
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '54px 44px 1fr', gap: 6, padding: '3px 4px', fontSize: 11, alignItems: 'baseline' }}>
      <span className="mono" style={{ color: 'var(--bone-faint)', fontSize: 9 }}>{t}</span>
      <span className="mono" style={{ color: tagCol, fontSize: 9, letterSpacing: '0.14em' }}>{tag}</span>
      <span style={{ color: 'var(--bone-mute)', fontSize: 11 }}>{text}</span>
    </div>
  );
};

const Objective = ({ state, name, sub }) => {
  const icon = { done: '✓', active: '◉', locked: '◌' }[state];
  const col = { done: 'var(--green)', active: 'var(--amber)', locked: 'var(--bone-faint)' }[state];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '20px 1fr', gap: 10, alignItems: 'center', padding: '4px 0' }}>
      <span style={{ color: col, fontSize: 14, textAlign: 'center' }}>{icon}</span>
      <div>
        <div className="disp" style={{ fontSize: 12, fontWeight: 600, color: state === 'locked' ? 'var(--bone-faint)' : 'var(--bone)', textDecoration: state === 'done' ? 'line-through' : 'none', textDecorationColor: 'var(--bone-faint)' }}>
          {name}
        </div>
        <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.1em', marginTop: 1 }}>{sub}</div>
      </div>
    </div>
  );
};

const BattlefieldBackdrop = () => (
  <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
    {/* Sky / horizon */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'linear-gradient(180deg, #5c4a35 0%, #74604a 32%, #4a3d2c 55%, #2a2418 72%, #181410 100%)',
    }}/>
    {/* Dust haze */}
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse at 50% 70%, rgba(180,140,90,0.35), transparent 60%)',
      mixBlendMode: 'screen',
    }}/>
    {/* Distant silhouette / structures */}
    <svg viewBox="0 0 1920 600" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', left: 0, right: 0, bottom: '32%', width: '100%', height: '40%', opacity: 0.85 }}>
      <defs>
        <linearGradient id="silh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2a221a"/>
          <stop offset="100%" stopColor="#0e0b08"/>
        </linearGradient>
      </defs>
      <path fill="url(#silh)" d="M0 600 L0 470 L80 460 L120 440 L180 445 L220 410 L260 415 L320 380 L380 385 L440 360 L500 365 L520 320 L560 325 L620 300 L680 305 L760 280 L820 295 L900 270 L960 285 L1040 260 L1120 275 L1200 245 L1280 260 L1360 230 L1440 250 L1520 220 L1600 245 L1680 215 L1760 240 L1840 230 L1920 250 L1920 600 Z"/>
      {/* Tower / antenna silhouettes */}
      <g fill="#0a0806">
        <rect x="380" y="320" width="6" height="60"/>
        <rect x="378" y="318" width="10" height="3"/>
        <rect x="1240" y="280" width="4" height="50"/>
        <rect x="700" y="290" width="8" height="40"/>
      </g>
    </svg>
    {/* Foreground floor */}
    <div style={{
      position: 'absolute', inset: '68% 0 0 0',
      background: 'linear-gradient(180deg, #2a2418 0%, #1a1610 30%, #0a0806 100%)',
    }}/>
    {/* Tactical grid on ground */}
    <svg viewBox="0 0 1920 360" preserveAspectRatio="xMidYMax slice" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', height: '32%', opacity: 0.4 }}>
      <defs>
        <linearGradient id="gridfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(111,200,216,0)"/>
          <stop offset="50%" stopColor="rgba(111,200,216,0.3)"/>
          <stop offset="100%" stopColor="rgba(111,200,216,0)"/>
        </linearGradient>
        <pattern id="gridg" width="80" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 0 L80 0 M0 0 L0 40" stroke="url(#gridfade)" strokeWidth="0.5" fill="none"/>
        </pattern>
        <mask id="gm"><rect x="0" y="0" width="1920" height="360" fill="url(#gridfade)"/></mask>
      </defs>
      <rect x="0" y="0" width="1920" height="360" fill="url(#gridg)" mask="url(#gm)"/>
    </svg>
    {/* Vignette */}
    <div style={{ position: 'absolute', inset: 0, boxShadow: 'inset 0 0 240px 60px rgba(0,0,0,0.85)' }}/>
  </div>
);

window.BattlefieldView = BattlefieldView;

// ── Compass + world markers (added) ────────────────────────

const CompassStrip = ({ heading = 67 }) => {
  // Render headings 0–360, centered on `heading`
  const span = 90; // visible degrees
  const ticks = [];
  for (let i = -span/2; i <= span/2; i += 5) {
    const deg = (heading + i + 360) % 360;
    const isMajor = deg % 30 === 0;
    const cardinal = { 0:'N', 45:'NO', 90:'O', 135:'SO', 180:'S', 225:'SW', 270:'W', 315:'NW' }[deg];
    const x = 50 + (i / span) * 100;
    ticks.push({ x, deg, isMajor, cardinal });
  }
  return (
    <div style={{
      position: 'absolute', top: 168, left: '50%', transform: 'translateX(-50%)',
      width: 720, height: 36, zIndex: 9, pointerEvents: 'none',
      background: 'linear-gradient(180deg, rgba(0,0,0,0.4), rgba(0,0,0,0.0))',
      borderBottom: '1px solid var(--line-cyan)',
    }}>
      {ticks.map((t, i) => (
        <div key={i} style={{
          position: 'absolute', left: t.x + '%', top: 0, bottom: 0,
          transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        }}>
          <div style={{ width: 1, height: t.isMajor ? 10 : 5, background: t.isMajor ? 'var(--cyan-soft)' : 'rgba(143,210,222,0.4)' }}/>
          {t.cardinal && (
            <div className="disp" style={{ fontSize: 13, fontWeight: 700, color: 'var(--cyan-soft)', letterSpacing: '0.06em', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{t.cardinal}</div>
          )}
          {!t.cardinal && t.isMajor && (
            <div className="mono" style={{ fontSize: 10, color: 'var(--bone-mute)', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>{t.deg.toString().padStart(3,'0')}</div>
          )}
        </div>
      ))}
      {/* Center marker */}
      <div style={{
        position: 'absolute', left: '50%', top: -4, transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
        borderTop: '8px solid var(--cyan-soft)',
      }}/>
      <div style={{
        position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)',
        fontFamily: 'var(--f-mono)', fontSize: 9, color: 'var(--cyan-soft)', letterSpacing: '0.14em',
        background: 'rgba(0,0,0,0.6)', padding: '1px 6px',
      }}>HDG {heading.toString().padStart(3,'0')}°</div>
    </div>
  );
};

const WorldMarkers = () => {
  // Markers placed around the field — distance + bearing labels
  const markers = [
    { x: 28, y: 48, type: 'hostile', code: 'ZWERG-4', dist: '518m' },
    { x: 72, y: 46, type: 'hostile', code: 'ZWERG-7', dist: '604m' },
    { x: 84, y: 56, type: 'hostile', code: 'BUNKER',  dist: '710m' },
    { x: 18, y: 60, type: 'objective', code: 'OBJ-03', dist: '630m' },
    { x: 44, y: 64, type: 'ally',    code: 'BRAVO-2',  dist: '120m' },
    { x: 60, y: 62, type: 'ally',    code: 'DRONE SCT-1', dist: '210m' },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 6 }}>
      {markers.map((m, i) => <WorldMarker key={i} {...m} />)}
    </div>
  );
};

const WorldMarker = ({ x, y, type, code, dist }) => {
  const col = type === 'hostile' ? 'var(--red-bright)' : type === 'objective' ? 'var(--amber)' : 'var(--green)';
  const shape = type === 'hostile' ? (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path d="M4 4 L20 4 L20 8 M4 4 L4 8 M4 20 L4 16 M20 20 L20 16 M4 20 L20 20" stroke={col} strokeWidth="1.5" fill="none"/>
      <path d="M12 8 L17 16 L7 16 Z" stroke={col} fill="rgba(217,72,56,0.2)" strokeWidth="1"/>
    </svg>
  ) : type === 'objective' ? (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9" stroke={col} strokeWidth="1.5" fill="none" strokeDasharray="3 2"/>
      <circle cx="12" cy="12" r="3" stroke={col} fill="rgba(212,168,44,0.2)" strokeWidth="1"/>
    </svg>
  ) : (
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path d="M4 4 L20 4 L20 8 M4 4 L4 8 M4 20 L4 16 M20 20 L20 16 M4 20 L20 20" stroke={col} strokeWidth="1.5" fill="none"/>
      <path d="M8 12 L12 8 L16 12 L12 16 Z" stroke={col} fill="rgba(127,176,74,0.2)" strokeWidth="1"/>
    </svg>
  );
  return (
    <div style={{
      position: 'absolute', left: x + '%', top: y + '%', transform: 'translate(-50%, -50%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    }}>
      {shape}
      <div className="mono" style={{ fontSize: 9, color: col, letterSpacing: '0.14em', textShadow: '0 0 4px rgba(0,0,0,0.8)' }}>{code}</div>
      <div className="mono" style={{ fontSize: 9, color: 'var(--bone)', textShadow: '0 0 4px rgba(0,0,0,0.8)' }}>{dist}</div>
    </div>
  );
};
