// mobile/09-shop.jsx — Shop / Battle Pass / Modules

const Screen_Shop = () => (
  <div className="mob">
    <StatusBar/>
    <AppBar
      title="Arsenal"
      sub="MODULE · SAISON · IAP"
      left={<button className="cta ghost sm" style={{ width: 'auto', minHeight: 32, padding: '6px 10px' }}><IcBack/></button>}
      right={<CurrencyStrip/>}
    />

    {/* Tab strip */}
    <div style={{ display: 'flex', borderBottom: '1px solid var(--line)' }}>
      {['Saison', 'Module', 'Bundles', 'Gems'].map((t, i) => (
        <div key={t} style={{
          flex: 1, padding: '12px 4px', textAlign: 'center', cursor: 'pointer',
          color: i === 0 ? 'var(--cyan-soft)' : 'var(--bone-dim)',
          background: i === 0 ? 'var(--cyan-ink)' : 'transparent',
          borderRight: '1px solid var(--line-soft)',
          position: 'relative',
        }}>
          <div className="disp" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{t}</div>
          {i === 0 && <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 2, background: 'var(--cyan-soft)' }}/>}
        </div>
      ))}
    </div>

    <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 12, background: 'rgba(0,0,0,0.3)' }}>

      {/* Battle Pass hero */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        border: '1px solid var(--amber)',
        background: 'linear-gradient(135deg, rgba(212,168,44,0.15) 0%, rgba(100,40,20,0.25) 60%, rgba(20,15,10,0.85) 100%)',
        padding: '14px 14px 14px',
      }}>
        {/* corner brackets */}
        <span style={{ position: 'absolute', top: 4, left: 4, width: 12, height: 12, borderTop: '1px solid var(--amber)', borderLeft: '1px solid var(--amber)' }}/>
        <span style={{ position: 'absolute', top: 4, right: 4, width: 12, height: 12, borderTop: '1px solid var(--amber)', borderRight: '1px solid var(--amber)' }}/>

        <div className="mono" style={{ fontSize: 9, color: 'var(--amber)', letterSpacing: '0.32em' }}>SAISON 03 · STAUB & STAHL</div>
        <div className="disp" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.04em', marginTop: 4 }}>Operationspass</div>
        <div style={{ fontSize: 12, color: 'var(--bone-mute)', marginTop: 4 }}>50 Stufen · 4 exklusive Module · 18 Skins · noch 24 Tage</div>

        {/* Progress */}
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.18em' }}>STUFE 12 / 50</span>
            <span className="mono" style={{ fontSize: 9, color: 'var(--amber)' }}>240 / 400 STERNE</span>
          </div>
          <div className="bar warn" style={{ height: 6 }}>
            <i style={{ width: '24%' }}/>
            <div className="ticks"/>
          </div>
        </div>

        {/* Next reward preview */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12, padding: '8px 10px', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--amber)' }}>
          <div style={{ width: 36, height: 36, display: 'grid', placeItems: 'center', background: 'rgba(212,168,44,0.18)', color: 'var(--amber)', fontFamily: 'var(--f-display)', fontSize: 16, fontWeight: 700, border: '1px solid var(--amber)' }}>RH-9</div>
          <div style={{ flex: 1 }}>
            <div className="mono" style={{ fontSize: 9, color: 'var(--amber)', letterSpacing: '0.2em' }}>NÄCHSTE STUFE · 13</div>
            <div style={{ fontSize: 13, color: 'var(--bone)' }}>Reaktive Hülle RH-9</div>
          </div>
          <span className="mono" style={{ fontSize: 9, color: 'var(--bone-mute)' }}>160 STERNE</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 12 }}>
          <button className="cta ghost sm">Stufen</button>
          <button className="cta sm" style={{ background: 'rgba(212,168,44,0.18)', borderColor: 'var(--amber)', color: 'var(--amber)' }}>
            Upgrade · 990 ◇
          </button>
        </div>
      </div>

      {/* Featured drop */}
      <div className="card">
        <div className="card-hd">
          <span style={{ color: 'var(--cyan-soft)' }}>★</span> Im Angebot
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--f-mono)', fontSize: 9, color: 'var(--red-bright)', letterSpacing: '0.16em' }}>03:18:42</span>
        </div>

        <ShopItem
          name="Plasma-Klinge LCS-3"
          code="WPN-203 · PRO"
          desc="Reflektiert Geschosse · Nahkampf"
          price="850"
          currency="◆"
          discount="-25%"
          old="1.140"
        />
        <ShopItem
          name="Skin: «Ferrous-Korps»"
          code="SKN-014"
          desc="Camo + Insignien · 4 Maschinen"
          price="240"
          currency="◇"
        />
        <ShopItem
          name="Drohnen-Hangar H-6"
          code="SPC-064 · STD"
          desc="6 Schächte · 24s Zyklus"
          price="640"
          currency="◆"
          equipped
        />
      </div>

      {/* Currency packs */}
      <div className="card">
        <div className="card-hd">
          <span style={{ color: 'var(--cyan)' }}>◇</span> Gem-Pakete
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <PackTile amount="120"   bonus="" price="2,49 €"/>
          <PackTile amount="650"   bonus="+50"  price="9,99 €" best/>
          <PackTile amount="1.400" bonus="+200" price="19,99 €"/>
        </div>
      </div>

    </div>

    <TabBar active="shop"/>
    <HomeBar/>
  </div>
);

const ShopItem = ({ name, code, desc, price, currency, discount, old, equipped }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr auto', gap: 10, alignItems: 'center', padding: '10px 0', borderBottom: '1px dashed var(--line-soft)' }}>
    <div style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', background: 'var(--bg-deep)', border: '1px solid var(--line)', color: 'var(--cyan-soft)' }}>
      <ModGlyph kind={code.startsWith('WPN-203') ? 'blade' : code.startsWith('SKN') ? 'skin' : 'hangar'}/>
    </div>
    <div style={{ minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span className="disp" style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.02em' }}>{name}</span>
        {discount && <span className="mono" style={{ fontSize: 9, color: 'var(--red-bright)', letterSpacing: '0.16em', padding: '0 4px', border: '1px solid var(--red-bright)' }}>{discount}</span>}
      </div>
      <div className="mono" style={{ fontSize: 9, color: 'var(--bone-dim)', letterSpacing: '0.12em' }}>{code}</div>
      <div style={{ fontSize: 11, color: 'var(--bone-mute)', marginTop: 2 }}>{desc}</div>
    </div>
    <div style={{ textAlign: 'right' }}>
      {equipped ? (
        <div className="mono" style={{ fontSize: 10, color: 'var(--green)', letterSpacing: '0.16em' }}>● BESITZT</div>
      ) : (
        <>
          {old && <div className="mono" style={{ fontSize: 9, color: 'var(--bone-faint)', textDecoration: 'line-through' }}>{old} {currency}</div>}
          <div className="disp tnum" style={{ fontSize: 15, fontWeight: 700, color: currency === '◆' ? 'var(--amber)' : 'var(--cyan-soft)' }}>{price} {currency}</div>
        </>
      )}
    </div>
  </div>
);

const PackTile = ({ amount, bonus, price, best }) => (
  <div style={{
    padding: 10,
    border: `1px solid ${best ? 'var(--cyan-dim)' : 'var(--line)'}`,
    background: best ? 'var(--cyan-ink)' : 'rgba(20,22,16,0.5)',
    position: 'relative', textAlign: 'center',
  }}>
    {best && (
      <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', background: 'var(--cyan)', color: 'var(--bg-deep)', fontFamily: 'var(--f-display)', fontWeight: 700, fontSize: 8, letterSpacing: '0.16em', padding: '2px 6px' }}>BELIEBT</div>
    )}
    <div className="disp" style={{ fontSize: 18, fontWeight: 700, color: 'var(--cyan-soft)' }}>{amount}<span style={{ fontSize: 12, marginLeft: 2 }}>◇</span></div>
    {bonus && <div className="mono" style={{ fontSize: 9, color: 'var(--green)', letterSpacing: '0.12em' }}>{bonus} Bonus</div>}
    <div className="mono" style={{ fontSize: 11, color: 'var(--bone)', marginTop: 6, fontWeight: 600 }}>{price}</div>
  </div>
);

const ModGlyph = ({ kind }) => {
  const g = {
    blade:  <g stroke="currentColor" strokeWidth="1.4" fill="none"><rect x="5" y="18" width="6" height="4"/><line x1="11" y1="18" x2="22" y2="6" strokeWidth="2"/></g>,
    skin:   <g stroke="currentColor" strokeWidth="1.4" fill="none"><path d="M6 6 L18 6 L20 18 L14 22 L10 22 L4 18 Z"/><path d="M8 10 L14 10 M8 14 L18 14"/></g>,
    hangar: <g stroke="currentColor" strokeWidth="1.4" fill="none"><rect x="4" y="6" width="16" height="14"/><line x1="4" y1="10" x2="20" y2="10"/><line x1="4" y1="14" x2="20" y2="14"/></g>,
  };
  return <svg viewBox="0 0 24 26" width="22" height="22">{g[kind] || <rect x="6" y="6" width="14" height="14" stroke="currentColor" fill="none" strokeWidth="1.4"/>}</svg>;
};

window.Screen_Shop = Screen_Shop;
