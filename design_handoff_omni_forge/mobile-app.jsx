// mobile-app.jsx — Design canvas with all 10 MVP screens

const W = 390;
const H = 844;

function MobileApp() {
  return (
    <DesignCanvas>
      <DCSection id="identity" title="Identität · Onboarding" subtitle="Erster Kontakt mit der App">
        <DCArtboard id="splash"      label="01 · Splash"        width={W} height={H}><Screen_IconSplash/></DCArtboard>
        <DCArtboard id="welcome"     label="02a · Willkommen"   width={W} height={H}><Screen_OnboardingWelcome/></DCArtboard>
        <DCArtboard id="tutorial"    label="02b · Tutorial"     width={W} height={H}><Screen_OnboardingTutorial/></DCArtboard>
      </DCSection>

      <DCSection id="hub" title="Hangar" subtitle="Home-Bildschirm · Aktive Maschine · Tagesmission">
        <DCArtboard id="hub"         label="03 · Hub"           width={W} height={H}><Screen_Hub/></DCArtboard>
      </DCSection>

      <DCSection id="build-fight" title="Bauen · Kämpfen · Ende" subtitle="Kern-Loop des Spiels">
        <DCArtboard id="werkstatt"   label="04 · Werkstatt"     width={W} height={H}><Screen_Werkstatt/></DCArtboard>
        <DCArtboard id="matchmaking" label="05 · Matchmaking"   width={W} height={H}><Screen_Matchmaking/></DCArtboard>
        <DCArtboard id="hud"         label="06 · Kampf-HUD"     width={W} height={H}><Screen_MatchHud/></DCArtboard>
        <DCArtboard id="end"         label="07 · Sieg-Ende"     width={W} height={H}><Screen_MatchEnd/></DCArtboard>
      </DCSection>

      <DCSection id="operator" title="Operator-Bereich" subtitle="Profil · Shop · Einstellungen">
        <DCArtboard id="profile"     label="08 · Profil"        width={W} height={H}><Screen_Profile/></DCArtboard>
        <DCArtboard id="shop"        label="09 · Shop · Saison" width={W} height={H}><Screen_Shop/></DCArtboard>
        <DCArtboard id="settings"    label="10 · Einstellungen" width={W} height={H}><Screen_Settings/></DCArtboard>
      </DCSection>

      <DCSection id="brand" title="App-Identität" subtitle="Icon · für App Store / Play Store">
        <DCArtboard id="appicon"     label="App-Icon · 1024"     width={240} height={240}>
          <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', background: '#0a0c08' }}>
            <AppIcon/>
          </div>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<MobileApp/>);
