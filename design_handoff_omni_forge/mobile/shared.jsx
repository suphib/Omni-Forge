// mobile/shared.jsx — common building blocks for mobile screens

// iOS-style status bar (custom — minimalist, matches Omni-Forge dark theme)
const StatusBar = ({ time = '21:47', dark = true }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '14px 28px 6px', fontFamily: 'var(--f-display)', fontSize: 13, fontWeight: 600,
    color: 'var(--bone)', position: 'relative', zIndex: 11,
  }}>
    <span style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.02em' }}>{time}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
      {/* signal */}
      <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
        <rect x="0"  y="7" width="3" height="4" rx="0.5" fill="currentColor"/>
        <rect x="4"  y="5" width="3" height="6" rx="0.5" fill="currentColor"/>
        <rect x="8"  y="2" width="3" height="9" rx="0.5" fill="currentColor"/>
        <rect x="12" y="0" width="3" height="11" rx="0.5" fill="currentColor"/>
      </svg>
      {/* wifi */}
      <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
        <path d="M1 4 Q 8 -1 15 4" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <path d="M3 6.5 Q 8 3 13 6.5" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <path d="M5 9 Q 8 7 11 9" stroke="currentColor" strokeWidth="1.3" fill="none"/>
        <circle cx="8" cy="10" r="0.8" fill="currentColor"/>
      </svg>
      {/* battery */}
      <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
        <rect x="0.5" y="0.5" width="22" height="11" rx="2.5" stroke="currentColor" strokeOpacity="0.6"/>
        <rect x="2" y="2" width="16" height="8" rx="1" fill="currentColor"/>
        <rect x="23.5" y="3.5" width="2" height="5" rx="1" fill="currentColor" opacity="0.6"/>
      </svg>
    </div>
  </div>
);

// Bottom safe-area indicator (home bar)
const HomeBar = () => (
  <div style={{ height: 34, display: 'grid', placeItems: 'center', position: 'relative', zIndex: 11 }}>
    <div style={{ width: 134, height: 5, borderRadius: 3, background: 'var(--bone)' }}/>
  </div>
);

// App bar (header)
const AppBar = ({ title, sub, left, right }) => (
  <div className="mob-appbar">
    <div className="left">{left}</div>
    <div style={{ flex: 1, textAlign: 'center' }}>
      <div className="ttl">{title}</div>
      {sub && <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.18em', marginTop: 1 }}>{sub}</div>}
    </div>
    <div className="right">{right}</div>
  </div>
);

// Bottom tab navigation
const TabBar = ({ active = 'hub' }) => {
  const tabs = [
    { id: 'hub',       lbl: 'Hangar',     ic: <IcHex/> },
    { id: 'werkstatt', lbl: 'Werkstatt',  ic: <IcWrench/> },
    { id: 'kampf',     lbl: 'Kampf',      ic: <IcCross/> },
    { id: 'profil',    lbl: 'Profil',     ic: <IcUser/> },
  ];
  return (
    <div className="mob-tabbar">
      {tabs.map(t => (
        <div key={t.id} className={`mob-tab ${active === t.id ? 'active' : ''}`}>
          <div style={{ fontSize: 20 }}>{t.ic}</div>
          <div className="lbl">{t.lbl}</div>
        </div>
      ))}
    </div>
  );
};

// Icon set — line, brutalist
const IcHex = () => <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 2 L17 6 L17 14 L10 18 L3 14 L3 6 Z"/><path d="M10 7 L13.5 9 L13.5 13 L10 15 L6.5 13 L6.5 9 Z"/></svg>;
const IcWrench = () => <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2 L18 6 L14 10 L11 7 Z M11 7 L3 15 L5 17 L13 9"/></svg>;
const IcCross = () => <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="7"/><line x1="10" y1="3" x2="10" y2="17"/><line x1="3" y1="10" x2="17" y2="10"/></svg>;
const IcUser = () => <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="7" r="3.5"/><path d="M3 18 Q 10 12 17 18"/></svg>;
const IcShop = () => <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 7 L17 7 L16 17 L4 17 Z"/><path d="M7 7 L7 4 Q 10 2 13 4 L13 7"/></svg>;
const IcSettings = () => <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="10" cy="10" r="3"/><path d="M10 2 L10 4 M10 16 L10 18 M2 10 L4 10 M16 10 L18 10 M4.5 4.5 L6 6 M14 14 L15.5 15.5 M4.5 15.5 L6 14 M14 6 L15.5 4.5"/></svg>;
const IcBack = () => <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 4 L6 10 L12 16"/></svg>;
const IcClose = () => <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="4" y1="4" x2="16" y2="16"/><line x1="4" y1="16" x2="16" y2="4"/></svg>;
const IcSearch = () => <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="9" r="5"/><line x1="13" y1="13" x2="17" y2="17"/></svg>;
const IcBell = () => <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 14 L5 8 Q 5 4 10 4 Q 15 4 15 8 L15 14 Z M8 14 L8 16 Q 10 17 12 16 L12 14"/></svg>;
const IcMore = () => <svg viewBox="0 0 20 20" width="1em" height="1em" fill="currentColor"><circle cx="4" cy="10" r="1.4"/><circle cx="10" cy="10" r="1.4"/><circle cx="16" cy="10" r="1.4"/></svg>;
const IcChevron = () => <svg viewBox="0 0 20 20" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 4 L14 10 L8 16"/></svg>;

// Small currency strip — used in many headers
const CurrencyStrip = () => (
  <div style={{ display: 'flex', gap: 6 }}>
    <span className="chip scrap"><span className="ico">◆</span><span className="v">437</span></span>
    <span className="chip gem"><span className="ico">◇</span><span className="v">128</span></span>
  </div>
);

// Logo brand mark — small
const BrandMarkSmall = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
    <g fill="none" stroke="var(--cyan-soft)" strokeWidth="1.5">
      <path d="M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z"/>
      <path d="M12 7 L17 10 L17 14 L12 17 L7 14 L7 10 Z" fill="rgba(111,200,216,0.2)"/>
      <circle cx="12" cy="12" r="1.5" fill="var(--cyan-soft)"/>
    </g>
  </svg>
);

// Mech illustration — small / smaller variant for hub / icon
const MechMiniSilhouette = ({ size = 200, color = 'var(--bone)' }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ filter: `drop-shadow(0 0 16px rgba(111,200,216,0.25))` }}>
    <g fill="none" stroke={color} strokeWidth="1.2" strokeLinejoin="round">
      {/* Drone bay */}
      <path d="M70 65 L60 70 L55 110 L65 125 L75 122 L78 75 Z" fill="rgba(143,210,222,0.06)"/>
      {/* Head */}
      <path d="M90 35 L110 35 L114 44 L110 53 L90 53 L86 44 Z" fill="rgba(143,210,222,0.10)"/>
      <line x1="92" y1="44" x2="108" y2="44" stroke="var(--amber)" strokeWidth="2"/>
      {/* Torso */}
      <path d="M78 55 L122 55 L128 75 L130 110 L122 130 L78 130 L70 110 L72 75 Z" fill="rgba(143,210,222,0.08)"/>
      {/* Reactor core */}
      <circle cx="100" cy="92" r="3" fill="var(--cyan-soft)"/>
      <circle cx="100" cy="92" r="7" fill="none" stroke="var(--cyan-soft)" strokeWidth="0.8"/>
      {/* Shoulder rocket pod */}
      <rect x="110" y="56" width="22" height="10" fill="rgba(143,210,222,0.06)"/>
      {/* Left arm — cannon */}
      <path d="M73 76 L66 80 L62 105 L68 115 L74 110 L78 80 Z" fill="rgba(143,210,222,0.08)"/>
      <rect x="48" y="108" width="22" height="6" fill="rgba(0,0,0,0.4)"/>
      {/* Right arm — blade */}
      <path d="M127 76 L134 80 L138 105 L132 115 L126 110 L122 80 Z" fill="rgba(143,210,222,0.08)"/>
      <line x1="135" y1="113" x2="160" y2="60" stroke="var(--red-bright)" strokeWidth="2.5"/>
      <line x1="135" y1="113" x2="160" y2="60" stroke="#ffd4c0" strokeWidth="0.8"/>
      {/* Legs */}
      <path d="M82 130 L78 158 L86 175 L94 175 L96 155 L92 130 Z" fill="rgba(143,210,222,0.06)"/>
      <path d="M108 130 L104 155 L106 175 L114 175 L122 158 L118 130 Z" fill="rgba(143,210,222,0.06)"/>
      {/* Tracks */}
      <path d="M72 175 L98 175 L100 188 L94 192 L78 192 L72 188 Z" fill="rgba(0,0,0,0.4)"/>
      <path d="M102 175 L128 175 L128 188 L122 192 L106 192 L100 188 Z" fill="rgba(0,0,0,0.4)"/>
    </g>
  </svg>
);

// Bone-dim divider
const Divider = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0' }}>
    <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>
    {label && <div className="label">{label}</div>}
    {label && <div style={{ flex: 1, height: 1, background: 'var(--line)' }}/>}
  </div>
);

Object.assign(window, {
  StatusBar, HomeBar, AppBar, TabBar, CurrencyStrip, BrandMarkSmall, MechMiniSilhouette, Divider,
  IcHex, IcWrench, IcCross, IcUser, IcShop, IcSettings, IcBack, IcClose, IcSearch, IcBell, IcMore, IcChevron,
});
