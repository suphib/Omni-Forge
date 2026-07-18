// app.jsx — root: top bar, mode switch, tweaks, scaling stage

const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "mode": "werkstatt",
  "accentScheme": "dual",
  "showGrain": true,
  "intensity": "regular"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [mode, setMode] = useState(t.mode || 'werkstatt');
  const [equipped, setEquipped] = useState(window.OF_DATA.DEFAULT_EQUIPPED);
  const [sdTimer, setSdTimer] = useState(8);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Sync mode from tweaks
  useEffect(() => { if (t.mode !== mode) setMode(t.mode); }, [t.mode]);

  const switchMode = (m) => {
    setMode(m);
    setTweak('mode', m);
  };

  const pad = (n) => n.toString().padStart(2, '0');
  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  // Apply accent scheme overrides
  const accentVars = {
    cyan:   { '--cyan': '#6fc8d8', '--red': '#6fc8d8', '--red-bright': '#9fdde8' },
    red:    { '--cyan': '#d94838', '--red': '#d94838', '--red-bright': '#ff5a44', '--cyan-soft': '#ff8a76', '--cyan-dim': '#9c3a2e' },
    dual:   {},
    amber:  { '--cyan': '#d4a82c', '--cyan-soft': '#e8c768', '--cyan-dim': '#8a6e1d' },
  }[t.accentScheme || 'dual'] || {};

  return (
    <div className="stage-host">
      <ScalingStage>
        <div className="stage" style={accentVars}>
          {/* ── Top status bar ─────────────────────────────────────── */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 60,
            display: 'grid', gridTemplateColumns: '420px 1fr 420px',
            alignItems: 'center',
            borderBottom: '1px solid var(--line)',
            background: 'linear-gradient(180deg, rgba(36,40,33,0.95), rgba(20,22,16,0.85))',
            zIndex: 100, padding: '0 16px',
          }}>
            {/* Logo / brand */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <BrandMark />
              <div>
                <div className="disp" style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.16em' }}>OMNI-FORGE</div>
                <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.22em', marginTop: 1 }}>FIELD COMMAND v2.4.1 · DE</div>
              </div>
              <div style={{ width: 1, height: 32, background: 'var(--line)', marginLeft: 6 }}/>
              <div>
                <div className="label">Operator</div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--bone)' }}>CPT.J · 4-FOXTROT</div>
              </div>
            </div>

            {/* Center mode switch */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="mode-switch">
                <button className={mode === 'werkstatt' ? 'active' : ''} onClick={() => switchMode('werkstatt')}>
                  <span style={{ fontSize: 14 }}>⊞</span> Werkstatt
                </button>
                <button className={mode === 'schlachtfeld' ? 'active danger-mode' : ''} onClick={() => switchMode('schlachtfeld')}>
                  <span style={{ fontSize: 14 }}>⌖</span> Schlachtfeld
                </button>
              </div>
            </div>

            {/* Right status block */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, justifyContent: 'flex-end' }}>
              <StatusPill dot="green" label="Link" value="STABIL · 8MS" />
              <StatusPill dot="amber" label="Verschlüsselung" value="AES-256" />
              <StatusPill dot="cyan"  label={mode === 'werkstatt' ? 'Status' : 'Engage'} value={mode === 'werkstatt' ? 'BAUMODUS' : 'LIVE-FEUER'} highlight />
              <div style={{ width: 1, height: 32, background: 'var(--line)' }}/>
              <div style={{ textAlign: 'right' }}>
                <div className="mono tnum" style={{ fontSize: 18, color: 'var(--cyan-soft)', letterSpacing: '0.06em' }}>{time}</div>
                <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.18em', marginTop: 1 }}>UTC+01 · {now.toISOString().slice(0,10)}</div>
              </div>
            </div>
          </div>

          {/* ── Mode content ──────────────────────────────────────── */}
          {mode === 'werkstatt' ? (
            <WorkshopView
              equipped={equipped}
              setEquipped={setEquipped}
              sdTimer={sdTimer}
              setSdTimer={setSdTimer}
            />
          ) : (
            <BattlefieldView equipped={equipped} sdTimer={sdTimer} />
          )}

          {/* Classification stamp */}
          <div style={{
            position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 14, alignItems: 'center', zIndex: 60,
            fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.22em',
            color: 'rgba(217,72,56,0.75)',
          }}>
            <span>● VERTRAULICH</span>
            <span style={{ color: 'var(--bone-faint)' }}>—</span>
            <span style={{ color: 'var(--bone-dim)' }}>OF-MIL-7041 / R-04</span>
            <span style={{ color: 'var(--bone-faint)' }}>—</span>
            <span>NUR FÜR BERECHTIGTE</span>
          </div>
        </div>
      </ScalingStage>

      {/* Tweaks panel */}
      <TweaksPanel title="Tweaks">
        <TweakSection label="Modus" />
        <TweakRadio
          label="Aktiver Modus"
          value={t.mode}
          options={[{ value: 'werkstatt', label: 'Werkstatt' }, { value: 'schlachtfeld', label: 'Kampf' }]}
          onChange={(v) => { setTweak('mode', v); setMode(v); }}
        />

        <TweakSection label="Stil" />
        <TweakRadio
          label="Akzentfarben"
          value={t.accentScheme}
          options={[
            { value: 'dual', label: 'Doppel' },
            { value: 'cyan', label: 'Cyan' },
            { value: 'red',  label: 'Rot' },
            { value: 'amber',label: 'Bernstein' },
          ]}
          onChange={(v) => setTweak('accentScheme', v)}
        />
        <TweakToggle
          label="Korn / Rauschen"
          value={t.showGrain}
          onChange={(v) => setTweak('showGrain', v)}
        />

        {mode === 'werkstatt' && (
          <>
            <TweakSection label="Werkstatt-Beispiele" />
            <TweakButton label="Loadout: Voll bestückt" onClick={() =>
              setEquipped(['tx-mk4','kn-88','lcs-3','rkt-12','arm-a','arm-b','hgr-6','fab-2','rep-1'])
            } />
            <TweakButton label="Loadout: Drohnen-Mutter" onClick={() =>
              setEquipped(['mech-7','kn-88','hgr-6','fab-2','arm-a','rep-1'])
            } />
            <TweakButton label="Loadout: Kamikaze" onClick={() =>
              setEquipped(['rotor-2','core-x','arm-b'])
            } />
            <TweakButton label="Loadout: Standard zurücksetzen" onClick={() =>
              setEquipped(window.OF_DATA.DEFAULT_EQUIPPED)
            } />
          </>
        )}
      </TweaksPanel>

      {/* Toggle grain dynamically */}
      <style>{!t.showGrain ? '.stage::before, .stage::after { display: none !important; }' : ''}</style>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────

const ScalingStage = ({ children }) => {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const update = () => {
      const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      setScale(s);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return (
    <div style={{
      position: 'absolute', left: '50%', top: '50%',
      width: 1920, height: 1080,
      transform: `translate(-50%, -50%) scale(${scale})`,
      transformOrigin: 'center center',
    }}>
      {children}
    </div>
  );
};

const BrandMark = () => (
  <svg width="36" height="36" viewBox="0 0 36 36">
    <g fill="none" stroke="var(--cyan-soft)" strokeWidth="1.5">
      <path d="M18 4 L30 11 L30 25 L18 32 L6 25 L6 11 Z"/>
      <path d="M18 12 L24 15.5 L24 20.5 L18 24 L12 20.5 L12 15.5 Z" stroke="var(--cyan-soft)" fill="rgba(111,200,216,0.2)"/>
      <circle cx="18" cy="18" r="1.5" fill="var(--cyan-soft)"/>
      <line x1="18" y1="4" x2="18" y2="11"/>
      <line x1="18" y1="25" x2="18" y2="32"/>
    </g>
  </svg>
);

const StatusPill = ({ dot, label, value, highlight }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '4px 10px',
    border: '1px solid ' + (highlight ? 'var(--cyan-dim)' : 'var(--line)'),
    background: highlight ? 'var(--cyan-ink)' : 'transparent',
  }}>
    <span className={`dot ${dot}`}/>
    <div>
      <div className="mono" style={{ fontSize: 8, letterSpacing: '0.2em', color: 'var(--bone-dim)', textTransform: 'uppercase' }}>{label}</div>
      <div className="mono" style={{ fontSize: 11, color: highlight ? 'var(--cyan-soft)' : 'var(--bone)', letterSpacing: '0.06em' }}>{value}</div>
    </div>
  </div>
);

// Mount
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
