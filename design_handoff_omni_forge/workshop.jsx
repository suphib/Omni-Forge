// workshop.jsx — Werkstatt (Construction Cradle)
// Live stats, module library, holographic mech blueprint, logic timeline.

const { useState, useMemo, useEffect } = React;

const WorkshopView = ({ equipped, setEquipped, sdTimer, setSdTimer }) => {
  const { CATEGORIES, MODULES, CHASSIS } = window.OF_DATA;
  const [activeCat, setActiveCat] = useState('antrieb');
  const [hoverPart, setHoverPart] = useState(null);

  // ── Live computed stats ────────────────────────────────────
  const stats = useMemo(() => {
    const eq = MODULES.filter(m => equipped.includes(m.id));
    const mass = eq.reduce((s,m) => s + m.mass, 0);
    const power = -eq.reduce((s,m) => s + (m.power || 0), 0); // power draw (positive)
    const armor = eq.filter(m => m.cat === 'panzerung').reduce((s,m) => s + m.hp, 0);
    const dmg = eq.filter(m => m.cat === 'waffen' && m.id !== 'core-x').reduce((s,m) => s + (m.dmg || 0), 0);
    const droneRate = eq.filter(m => m.id === 'hgr-6' || m.id === 'fab-2').length;
    return {
      mass, power, armor, dmg,
      massPct: Math.min(1, mass / CHASSIS.massMax),
      powerPct: Math.min(1, power / CHASSIS.powerMax),
      armorPct: Math.min(1, armor / CHASSIS.armorMax),
      dmgPct: Math.min(1, dmg / 800),
      droneRate, // 0–2
      cg: 0.4 + (eq.find(m => m.id === 'rkt-12') ? 0.3 : 0) + (eq.find(m => m.id === 'hgr-6') ? -0.2 : 0),
    };
  }, [equipped]);

  const toggle = (id) => {
    setEquipped(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const catModules = MODULES.filter(m => m.cat === activeCat);

  return (
    <div style={{
      position: 'absolute', inset: '60px 0 0 0',
      display: 'grid',
      gridTemplateColumns: '380px 1fr 420px',
      gridTemplateRows: '1fr 220px',
      gap: 12, padding: 12,
    }}>
      {/* ── LEFT: Module library ─────────────────────────────── */}
      <div className="panel bracket-corners" style={{ gridColumn: '1', gridRow: '1 / 3', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <span className="bc-bl"></span><span className="bc-br"></span>
        <div className="panel-hd">
          <span className="dot cyan"></span>
          <span className="title">Modulbibliothek</span>
          <span className="id">LIB · 014/068</span>
        </div>
        <div className="tabs">
          {CATEGORIES.map(c => (
            <div key={c.id} className={`tab ${activeCat === c.id ? 'active' : ''}`} onClick={() => setActiveCat(c.id)}>
              <div>{c.name}</div>
              <div className="mono" style={{ fontSize: 9, opacity: 0.6, marginTop: 2, letterSpacing: '0.18em' }}>{c.code}</div>
            </div>
          ))}
        </div>

        {/* Search/filter row */}
        <div style={{ padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'center', borderBottom: '1px solid var(--line-soft)' }}>
          <span className="label">Filter</span>
          <input
            placeholder="Komponente suchen…"
            style={{
              flex: 1, background: 'rgba(0,0,0,0.4)', border: '1px solid var(--line)',
              color: 'var(--bone)', padding: '6px 8px', fontFamily: 'var(--f-mono)', fontSize: 11,
              outline: 'none',
            }}
          />
          <button className="btn ghost" style={{ padding: '4px 8px' }}>↕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {catModules.map(m => (
            <div
              key={m.id}
              className={`mod-card ${equipped.includes(m.id) ? 'equipped' : ''}`}
              onClick={() => toggle(m.id)}
              onMouseEnter={() => setHoverPart(m.id)}
              onMouseLeave={() => setHoverPart(null)}
            >
              <div className="ico">
                <ModuleGlyph kind={m.id} />
              </div>
              <div>
                <div className="name">{m.name}</div>
                <div className="meta">{m.code} · {m.note}</div>
              </div>
              <div>
                <div className="mass tnum">{m.mass.toLocaleString('de-DE')} KG</div>
                <div className="mass tnum" style={{ color: m.power < 0 ? 'var(--red-bright)' : 'var(--green)' }}>
                  {m.power > 0 ? '+' : ''}{m.power} kW
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '10px 14px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10 }}>
          <span className="label">Slots</span>
          <span className="mono" style={{ color: 'var(--bone-mute)' }}>{equipped.length} / 12 belegt</span>
        </div>
      </div>

      {/* ── CENTER: Mech cradle ─────────────────────────────── */}
      <div className="panel bracket-corners" style={{ gridColumn: '2', gridRow: '1', position: 'relative', overflow: 'hidden' }}>
        <span className="bc-bl"></span><span className="bc-br"></span>

        {/* Top metadata bar */}
        <div style={{
          position: 'absolute', top: 12, left: 16, right: 16, zIndex: 4,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <div>
            <div className="label" style={{ color: 'var(--cyan-dim)' }}>Konstruktion · Halterung 03</div>
            <div className="disp" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.05em', marginTop: 2, whiteSpace: 'nowrap' }}>{CHASSIS.name}</div>
            <div className="code" style={{ marginTop: 2 }}>{CHASSIS.designation} · {CHASSIS.role}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="label">Standort</div>
            <div className="mono" style={{ color: 'var(--cyan-soft)', fontSize: 11, marginTop: 2 }}>ARSENAL 7B · HALL 03</div>
            <div className="code" style={{ marginTop: 2 }}>49.7820° N · 11.4280° E</div>
          </div>
        </div>

        {/* Mech */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <MechBlueprint equipped={equipped} highlight={hoverPart} onPart={(id, on) => setHoverPart(on ? id : null)} />
        </div>

        {/* Rotation indicator */}
        <div style={{
          position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 10, zIndex: 5,
          background: 'rgba(0,0,0,0.5)', border: '1px solid var(--line)', padding: '4px 8px',
        }}>
          <button className="btn ghost" style={{ padding: '2px 8px' }}>◀</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className="label">Ansicht</span>
            <span className="mono" style={{ color: 'var(--cyan-soft)' }}>FRONT · 000°</span>
          </div>
          <button className="btn ghost" style={{ padding: '2px 8px' }}>▶</button>
        </div>

        {/* Toolbar — right side */}
        <div style={{
          position: 'absolute', top: 90, right: 14, zIndex: 5,
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          {[
            { k: '⊞', label: 'Raster' },
            { k: '◐', label: 'Schnitt' },
            { k: '⤢', label: 'Vollbild' },
            { k: '⊕', label: 'Messen' },
          ].map(b => (
            <button key={b.k} className="btn ghost" title={b.label} style={{ width: 32, height: 32, padding: 0, justifyContent: 'center', fontSize: 14 }}>
              {b.k}
            </button>
          ))}
        </div>

        {/* Bottom-left integrity stamp */}
        <div style={{
          position: 'absolute', bottom: 16, left: 16, zIndex: 5,
          border: '1px solid var(--line)', padding: '6px 10px',
          background: 'rgba(0,0,0,0.4)',
        }}>
          <div className="label" style={{ color: 'var(--amber)' }}>● Live-Vorschau</div>
          <div className="code" style={{ marginTop: 2 }}>POLY 14.7K · DRAW 0.6MS</div>
        </div>
      </div>

      {/* ── RIGHT: Status panel ─────────────────────────────── */}
      <div className="panel bracket-corners" style={{ gridColumn: '3', gridRow: '1 / 3', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <span className="bc-bl"></span><span className="bc-br"></span>
        <div className="panel-hd">
          <span className="dot cyan"></span>
          <span className="title">Maschinen-Status</span>
          <span className="id">TLM · LIVE</span>
        </div>
        <div style={{ overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 16 }}>

          <StatRow
            label="Energie-Bilanz"
            code="PWR-001"
            value={`${stats.power} / ${CHASSIS.powerMax} kW`}
            pct={stats.powerPct}
            tone={stats.powerPct > 0.92 ? 'crit' : stats.powerPct > 0.78 ? 'warn' : 'ok'}
            note={stats.powerPct > 0.92 ? 'Reaktor an der Grenze' : 'Reserve verfügbar'}
          />

          <StatRow
            label="Gewicht / Chassis"
            code="MAS-002"
            value={`${stats.mass.toLocaleString('de-DE')} / ${CHASSIS.massMax.toLocaleString('de-DE')} kg`}
            pct={stats.massPct}
            tone={stats.massPct > 0.95 ? 'crit' : stats.massPct > 0.82 ? 'warn' : ''}
            note={stats.massPct > 0.82 ? 'Mobilität reduziert' : 'Im Toleranzbereich'}
          />

          {/* CG indicator */}
          <div>
            <div className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Schwerpunkt</span>
              <span className="mono" style={{ color: 'var(--bone-mute)' }}>CG-003</span>
            </div>
            <div style={{
              position: 'relative', height: 28, marginTop: 6,
              background: 'rgba(0,0,0,0.5)', border: '1px solid var(--line-soft)',
            }}>
              {/* zone bands */}
              <div style={{ position: 'absolute', inset: 0,
                background: 'linear-gradient(90deg, rgba(217,72,56,0.18) 0 18%, rgba(212,168,44,0.18) 18% 30%, transparent 30% 70%, rgba(212,168,44,0.18) 70% 82%, rgba(217,72,56,0.18) 82% 100%)' }}/>
              {/* center line */}
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'rgba(255,240,200,0.18)' }}/>
              {/* marker */}
              <div style={{
                position: 'absolute', top: 0, bottom: 0,
                left: `${50 + stats.cg * 18}%`,
                transform: 'translateX(-50%)',
                width: 2, background: stats.cg > 0.6 ? 'var(--amber)' : 'var(--cyan)',
                boxShadow: '0 0 8px currentColor', color: stats.cg > 0.6 ? 'var(--amber)' : 'var(--cyan)',
              }}/>
            </div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--bone-dim)', marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
              <span>Δ-CG {stats.cg.toFixed(2)}m</span>
              <span style={{ color: stats.cg > 0.6 ? 'var(--amber)' : 'var(--bone-dim)' }}>{stats.cg > 0.6 ? 'Heck-lastig — Kipprisiko' : 'Balanciert'}</span>
            </div>
          </div>

          <StatRow
            label="Panzerung gesamt"
            code="ARM-004"
            value={`${stats.armor.toLocaleString('de-DE')} HP`}
            pct={stats.armorPct}
            tone="ok"
          />

          <StatRow
            label="Feuerkraft (Burst)"
            code="DPS-005"
            value={`${stats.dmg} DPS`}
            pct={stats.dmgPct}
            tone={stats.dmgPct > 0.7 ? 'ok' : ''}
          />

          {/* Drone production */}
          <div>
            <div className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Drohnen-Produktion</span>
              <span className="mono" style={{ color: 'var(--bone-mute)' }}>SPC-006</span>
            </div>
            <div className="mono" style={{ fontSize: 18, marginTop: 4, color: stats.droneRate ? 'var(--cyan-soft)' : 'var(--bone-faint)' }}>
              {stats.droneRate ? (stats.droneRate === 2 ? '0.42 / sek' : '0.18 / sek') : '— · kein Hangar'}
            </div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--bone-dim)', marginTop: 4 }}>
              {stats.droneRate ? `${stats.droneRate} Modul${stats.droneRate>1?'e':''} aktiv · Zyklus 24s` : 'Hangar oder Fabrik anschließen'}
            </div>
          </div>

          {/* System diagnostics */}
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
            <div className="label" style={{ marginBottom: 8 }}>System-Diagnose</div>
            {[
              { ok: true,  label: 'Reaktor-Kühlung',     val: '47°C' },
              { ok: true,  label: 'Hydraulik-Druck',     val: '14.2 MPa' },
              { ok: stats.powerPct < 0.9, label: 'Energie-Reserve',    val: stats.powerPct < 0.9 ? 'NOMINAL' : 'KRITISCH' },
              { ok: stats.cg < 0.6, label: 'Schwerpunkt-Balance',val: stats.cg < 0.6 ? 'NOMINAL' : 'WARN' },
              { ok: true,  label: 'KI-Logic Interlock',  val: 'AUTO/MAN' },
            ].map((d,i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px dashed var(--line-soft)', whiteSpace: 'nowrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
                  <span className={`dot ${d.ok ? 'green' : 'red'}`}/>
                  <span style={{ color: 'var(--bone-mute)' }}>{d.label}</span>
                </span>
                <span className="mono" style={{ fontSize: 11, color: d.ok ? 'var(--bone)' : 'var(--red-bright)' }}>{d.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: 12, borderTop: '1px solid var(--line)', display: 'flex', gap: 6 }}>
          <button className="btn ghost" style={{ flex: 1 }}>Speichern</button>
          <button className="btn primary" style={{ flex: 1.4 }}>▸ Deploy</button>
        </div>
      </div>

      {/* ── BOTTOM CENTER: Logic editor + self-destruct ────── */}
      <div className="panel bracket-corners" style={{ gridColumn: '2', gridRow: '2', display: 'grid', gridTemplateColumns: '1fr 360px', minHeight: 0 }}>
        <span className="bc-bl"></span><span className="bc-br"></span>

        {/* Logic timeline */}
        <div style={{ borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column' }}>
          <div className="panel-hd" style={{ borderBottom: '1px solid var(--line-soft)' }}>
            <span className="dot amber"></span>
            <span className="title">Logik-Editor · Verhaltens-Skript</span>
            <span className="id">LGC-007 · 4 REGELN</span>
            <button className="btn ghost" style={{ marginLeft: 8, padding: '4px 10px' }}>+ Regel</button>
          </div>
          <div style={{ padding: '10px 14px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
            <LogicRule n="01" when="HP der Maschine < 10 %" then="Selbstzerstörung aktivieren · Gegner-Cluster anvisieren" priority="HIGH"/>
            <LogicRule n="02" when="Gegner in 40m · und Kanone bereit" then="Feuerfreigabe KN-88 · Salve 4 Schuss" priority="MED"/>
            <LogicRule n="03" when="Schrott eingesammelt ≥ 80 kg" then="Drohnen-Bay : produziere Boden-Bot BB-3" priority="MED"/>
            <LogicRule n="04" when="Verbündeter HP < 30 %" then="Repair-Swarm entsenden · Schutz-Formation" priority="LOW"/>
          </div>
        </div>

        {/* Self-destruct slider */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="panel-hd" style={{ borderBottom: '1px solid var(--line-soft)' }}>
            <span className="dot red"></span>
            <span className="title" style={{ color: 'var(--red-bright)' }}>Ultima-Option</span>
            <span className="id">WPN-999</span>
          </div>
          <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="code" style={{ color: 'var(--bone-mute)' }}>
              Bei Aktivierung läuft ein Countdown. Während der Detonation kann die Maschine weiter bewegt werden.
            </div>
            <div className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Selbstzerstörungs-Timer</span>
              <span className="mono" style={{ color: 'var(--red-bright)', fontSize: 14 }}>T-{sdTimer.toString().padStart(2,'0')}s</span>
            </div>
            <input
              type="range" min="3" max="30" value={sdTimer}
              onChange={(e) => setSdTimer(parseInt(e.target.value))}
              style={{
                appearance: 'none', width: '100%', height: 4,
                background: 'linear-gradient(90deg, var(--red) 0%, var(--red) ' + ((sdTimer-3)/27*100) + '%, rgba(255,255,255,0.1) ' + ((sdTimer-3)/27*100) + '%)',
                outline: 'none', cursor: 'pointer',
              }}
              className="sd-range"
            />
            <div className="mono" style={{ fontSize: 10, display: 'flex', justifyContent: 'space-between', color: 'var(--bone-dim)' }}>
              <span>3s · Sofort</span>
              <span>30s · Sprint</span>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
              <button className="btn" style={{ flex: 1 }}>Test-Sequenz</button>
              <button className="btn danger" style={{ flex: 1.2 }}>Scharf schalten</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── helper components ────────────────────────────────────────
const StatRow = ({ label, code, value, pct, tone = '', note }) => (
  <div>
    <div className="label" style={{ display: 'flex', justifyContent: 'space-between', whiteSpace: 'nowrap', letterSpacing: '0.12em' }}>
      <span>{label}</span>
      <span className="mono" style={{ color: 'var(--bone-mute)', letterSpacing: '0.14em' }}>{code}</span>
    </div>
    <div className="mono tnum" style={{ fontSize: 16, marginTop: 4, color: tone === 'crit' ? 'var(--red-bright)' : tone === 'warn' ? 'var(--amber)' : 'var(--bone)' }}>
      {value}
    </div>
    <div className={`bar ${tone}`} style={{ marginTop: 6 }}>
      <i style={{ width: `${pct * 100}%`, transition: 'width .25s ease' }}/>
      <div className="ticks"/>
    </div>
    {note && <div className="mono" style={{ fontSize: 10, color: tone === 'crit' ? 'var(--red-bright)' : tone === 'warn' ? 'var(--amber)' : 'var(--bone-dim)', marginTop: 4 }}>{note}</div>}
  </div>
);

const LogicRule = ({ n, when, then, priority }) => {
  const pCol = priority === 'HIGH' ? 'var(--red-bright)' : priority === 'MED' ? 'var(--amber)' : 'var(--cyan-soft)';
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '32px 1fr 64px 20px', gap: 10, alignItems: 'center',
      padding: '8px 10px', background: 'rgba(20,22,16,0.5)', border: '1px solid var(--line-soft)',
    }}>
      <div className="mono" style={{ color: 'var(--bone-faint)', fontSize: 10 }}>{n}</div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', fontSize: 12 }}>
        <span style={{ color: 'var(--amber)', fontFamily: 'var(--f-display)', letterSpacing: '0.1em' }}>WENN</span>
        <span style={{ color: 'var(--bone)' }}>{when}</span>
        <span style={{ color: 'var(--cyan)', fontFamily: 'var(--f-display)', letterSpacing: '0.1em' }}>↦ DANN</span>
        <span style={{ color: 'var(--bone-mute)' }}>{then}</span>
      </div>
      <div className="mono" style={{ fontSize: 10, color: pCol, letterSpacing: '0.16em', textAlign: 'right' }}>{priority}</div>
      <div style={{ color: 'var(--bone-dim)', textAlign: 'right', cursor: 'pointer' }}>⋮</div>
    </div>
  );
};

// Tiny inline glyphs for module rows
const ModuleGlyph = ({ kind }) => {
  const stroke = 'currentColor';
  const sw = 1.2;
  const glyphs = {
    'tx-mk4':  <g stroke={stroke} strokeWidth={sw} fill="none"><rect x="4" y="9" width="12" height="6" rx="3"/><circle cx="7" cy="12" r="1.2"/><circle cx="13" cy="12" r="1.2"/></g>,
    'mech-7':  <g stroke={stroke} strokeWidth={sw} fill="none"><path d="M5 4 L8 10 L7 16 M15 4 L12 10 L13 16"/></g>,
    'rotor-2': <g stroke={stroke} strokeWidth={sw} fill="none"><circle cx="10" cy="10" r="3"/><path d="M10 7 L10 3 M10 13 L10 17 M7 10 L3 10 M13 10 L17 10"/></g>,
    'kn-88':   <g stroke={stroke} strokeWidth={sw} fill="none"><rect x="3" y="8" width="10" height="4"/><rect x="13" y="9" width="4" height="2"/><line x1="6" y1="12" x2="6" y2="15"/></g>,
    'lcs-3':   <g stroke={stroke} strokeWidth={sw} fill="none"><rect x="3" y="13" width="4" height="4"/><line x1="7" y1="13" x2="17" y2="3" strokeWidth="2"/></g>,
    'rkt-12':  <g stroke={stroke} strokeWidth={sw} fill="none"><rect x="4" y="6" width="12" height="8"/><circle cx="7" cy="9" r="0.8"/><circle cx="10" cy="9" r="0.8"/><circle cx="13" cy="9" r="0.8"/><circle cx="7" cy="12" r="0.8"/><circle cx="10" cy="12" r="0.8"/><circle cx="13" cy="12" r="0.8"/></g>,
    'core-x':  <g stroke={stroke} strokeWidth={sw} fill="none"><circle cx="10" cy="10" r="5"/><path d="M10 7 L10 13 M7 10 L13 10"/></g>,
    'arm-a':   <g stroke={stroke} strokeWidth={sw} fill="none"><path d="M10 3 L16 6 L16 12 L10 17 L4 12 L4 6 Z"/></g>,
    'arm-b':   <g stroke={stroke} strokeWidth={sw} fill="none"><path d="M10 3 L16 6 L16 12 L10 17 L4 12 L4 6 Z M7 7 L13 13 M13 7 L7 13"/></g>,
    'hgr-6':   <g stroke={stroke} strokeWidth={sw} fill="none"><rect x="3" y="5" width="14" height="10"/><line x1="3" y1="9" x2="17" y2="9"/><line x1="3" y1="12" x2="17" y2="12"/></g>,
    'fab-2':   <g stroke={stroke} strokeWidth={sw} fill="none"><path d="M4 16 L4 8 L8 11 L8 5 L12 8 L12 5 L16 8 L16 16 Z"/></g>,
    'rep-1':   <g stroke={stroke} strokeWidth={sw} fill="none"><path d="M10 4 L10 16 M4 10 L16 10" strokeWidth="2"/></g>,
  };
  return <svg viewBox="0 0 20 20" width="20" height="20">{glyphs[kind] || <rect x="4" y="4" width="12" height="12" stroke={stroke} fill="none"/>}</svg>;
};

window.WorkshopView = WorkshopView;
