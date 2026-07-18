// mobile/10-settings.jsx — Settings

const Screen_Settings = () => (
  <div className="mob">
    <StatusBar/>
    <AppBar
      title="Einstellungen"
      sub="OPERATOR-PROFIL · v2.4.1"
      left={<button className="cta ghost sm" style={{ width: 'auto', minHeight: 32, padding: '6px 10px' }}><IcBack/></button>}
    />

    <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.3)' }}>

      {/* Account block */}
      <SettingsSection label="Konto">
        <div className="row">
          <div style={{ width: 40, height: 40, background: 'var(--cyan-ink)', border: '1px solid var(--cyan-dim)', display: 'grid', placeItems: 'center', fontFamily: 'var(--f-display)', fontWeight: 700, color: 'var(--cyan-soft)' }}>J4</div>
          <div className="lbl">
            <b>CPT.J</b>
            <span>jimmy.lala@example.de · Apple-ID verknüpft</span>
          </div>
          <div className="ch"><IcChevron/></div>
        </div>
        <Row label="Clan / Squad" sub="4-FOXTROT · 12 Mitglieder" chevron/>
        <Row label="Plattform-Verknüpfungen" sub="Apple · Google · 1 Konto" chevron/>
      </SettingsSection>

      {/* Gameplay */}
      <SettingsSection label="Spiel">
        <Row label="Sprache" sub="Deutsch · DE" chevron/>
        <Row label="Spielmodus-Filter" sub="3v3 Standard · Ranked" chevron/>
        <RowSlider label="Empfindlichkeit Fadenkreuz" sub="Touch · X · Y" value={62}/>
        <RowToggle label="Sprint-Doppeltap" sub="Joystick doppelt antippen für Sprint" on/>
        <RowToggle label="Auto-Drohne deployen" sub="Logik-Skript bei Match-Start aktivieren" on/>
        <RowToggle label="Selbstzerstörung — Doppeltap" sub="Zusätzliche Bestätigung erforderlich"/>
      </SettingsSection>

      {/* Audio / Haptics */}
      <SettingsSection label="Audio & Haptik">
        <RowSlider label="Master" value={80}/>
        <RowSlider label="Effekte" value={92}/>
        <RowSlider label="Musik" value={48}/>
        <RowToggle label="Haptisches Feedback" sub="Treffer · Treffer am Schild · Sieg" on/>
        <RowToggle label="Sprachchat im Squad" on/>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection label="Benachrichtigungen">
        <RowToggle label="Saison endet bald" on/>
        <RowToggle label="Freund online" sub="Push wenn Squad-Mitglied in Lobby"/>
        <RowToggle label="Tagesmission verfügbar" on/>
        <RowToggle label="Marketing & Angebote"/>
      </SettingsSection>

      {/* Privacy / Data */}
      <SettingsSection label="Privatsphäre">
        <Row label="Datenschutz-Erklärung" chevron/>
        <Row label="AGB" chevron/>
        <Row label="Werbe-IDs zurücksetzen" sub="Personalisierte Empfehlungen deaktivieren" chevron/>
        <Row label="Daten exportieren" sub="DSGVO Art. 20" chevron/>
      </SettingsSection>

      {/* Support */}
      <SettingsSection label="Hilfe & Support">
        <Row label="Kontaktiere Support" chevron/>
        <Row label="Spielregeln & Verhaltenskodex" chevron/>
        <Row label="Versions-Hinweise" sub="v2.4.1 · 14.05.2026" chevron/>
        <Row label="Server-Status" sub="● Alle Regionen normal" chevron/>
      </SettingsSection>

      {/* Danger */}
      <SettingsSection label="Konto verwalten">
        <div className="row">
          <div className="lbl">
            <b style={{ color: 'var(--red-bright)' }}>Konto löschen</b>
            <span>Unwiderruflich · DSGVO Art. 17</span>
          </div>
          <div className="ch"><IcChevron/></div>
        </div>
        <div className="row" style={{ justifyContent: 'center', padding: '14px 16px' }}>
          <button className="cta ghost sm" style={{ width: 'auto' }}>Abmelden</button>
        </div>
      </SettingsSection>

      {/* Build info */}
      <div style={{ padding: '20px 16px 32px', textAlign: 'center' }}>
        <div className="mono" style={{ fontSize: 9, color: 'var(--bone-faint)', letterSpacing: '0.22em' }}>OMNI-FORGE · BUILD 2.4.1-DE</div>
        <div className="mono" style={{ fontSize: 9, color: 'var(--bone-faint)', letterSpacing: '0.22em', marginTop: 2 }}>© LOCH·LABS 2026 · NUR FÜR BERECHTIGTE</div>
      </div>
    </div>

    <HomeBar/>
  </div>
);

const SettingsSection = ({ label, children }) => (
  <div style={{ marginTop: 18 }}>
    <div className="label" style={{ padding: '0 16px 8px' }}>{label}</div>
    <div style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      {children}
    </div>
  </div>
);

const Row = ({ label, sub, chevron }) => (
  <div className="row">
    <div className="lbl">
      <b>{label}</b>
      {sub && <span>{sub}</span>}
    </div>
    {chevron && <div className="ch"><IcChevron/></div>}
  </div>
);

const RowToggle = ({ label, sub, on }) => (
  <div className="row">
    <div className="lbl">
      <b>{label}</b>
      {sub && <span>{sub}</span>}
    </div>
    <div className={`tog ${on ? 'on' : ''}`}/>
  </div>
);

const RowSlider = ({ label, sub, value }) => (
  <div className="row" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div className="lbl">
        <b>{label}</b>
        {sub && <span>{sub}</span>}
      </div>
      <span className="mono tnum" style={{ fontSize: 12, color: 'var(--cyan-soft)' }}>{value}</span>
    </div>
    <div style={{ position: 'relative', height: 4, background: 'rgba(0,0,0,0.5)', border: '1px solid var(--line-soft)' }}>
      <div style={{ position: 'absolute', inset: '0 auto 0 0', width: `${value}%`, background: 'var(--cyan)' }}/>
      <div style={{ position: 'absolute', top: -5, left: `calc(${value}% - 6px)`, width: 12, height: 12, background: 'var(--bone)', border: '1px solid var(--cyan-soft)', boxShadow: '0 0 6px rgba(111,200,216,0.6)' }}/>
    </div>
  </div>
);

window.Screen_Settings = Screen_Settings;
