# Handoff: Omni-Forge — Mobile PvP Kampfroboter-Spiel

## Overview
**Omni-Forge** ist ein Mobile-Multiplayer-Kampfspiel (App Store / Play Store), in dem
Spieler modulare Kampfmaschinen bauen und in Echtzeit-PvP-Gefechten gegeneinander
antreten. Dieses Bundle enthält alle Design-Referenzen, die in HTML als Prototypen
erstellt wurden: das komplette Mobile-App-MVP (11 Screens) sowie zwei fertig
gestaltete Kampfroboter-Dossiers («Stier» und «Krampus»).

Ziel dieses Handoffs: einem Entwickler (mit Claude Code) genug an die Hand zu geben,
um daraus ein echtes, spielbares Mobile-Spiel mit Online-PvP zu bauen.

---

## About the Design Files
Die HTML/JSX-Dateien in diesem Bundle sind **Design-Referenzen** — interaktive
Prototypen, die Aussehen, Layout und Verhalten zeigen. Sie sind **kein
Produktions-Code zum 1:1-Kopieren**.

Die Prototypen sind mit React (über Babel-im-Browser) + reinem CSS gebaut, damit sie
ohne Build-Schritt im Browser laufen. Für ein echtes Spiel ist das **nicht** die
richtige Architektur. Die Aufgabe ist, diese Designs im gewählten Ziel-Stack
**nachzubauen** (siehe „Empfohlener Tech-Stack"), nicht die HTML-Dateien
auszuliefern.

## Fidelity
**High-fidelity (hifi).** Alle Screens haben finale Farben, Typografie, Abstände und
Interaktions-Konzepte. Der Entwickler soll die UI möglichst pixelgenau mit den
Bibliotheken/Patterns des Ziel-Stacks nachbauen. Der Mech-Kampf selbst (Gameplay,
Physik, Netcode) ist **konzeptionell** — die HUD-Designs zeigen, welche Steuerung und
welche Anzeigen nötig sind, nicht die Spiel-Engine.

---

## Empfohlener Tech-Stack (da noch kein Codebase existiert)

Es gibt noch keinen bestehenden Code. Empfehlung für ein Mobile-PvP-Spiel dieser Art:

### Frontend / Client
- **Engine für das Gefecht:** **Unity** (C#) oder **Godot 4** — 2.5D/3D Arena-Kampf,
  Physik, Partikel (Flammen, Plasma), Server-Prediction. Godot ist kostenlos/Open-Source,
  Unity hat mehr Mobile-Tooling.
- **Menü-/Meta-UI (alles außer dem Gefecht):** Kann direkt in der Engine gebaut werden
  (Unity UI Toolkit / Godot Control-Nodes). Alternativ **React Native** oder **Flutter**
  für die Meta-Screens (Hangar, Werkstatt, Shop, Profil, Settings) und nur das Gefecht in
  der Engine — aber ein einheitlicher Engine-Ansatz ist für ein Spiel meist einfacher.
- Wenn es ein **Web-first**-Spiel sein soll: **PixiJS** oder **Phaser** (2D) bzw.
  **Three.js / Babylon.js** (3D) + React für die Meta-UI.

### Backend / Multiplayer (Pflicht für PvP)
- **Server-authoritative** Netcode (Cheating-Schutz ist bei PvP zwingend). Client sagt
  Eingaben, der Server berechnet die Wahrheit.
- Fertige Lösungen: **Photon Fusion / Photon Quantum** (Unity), **Nakama** (Open-Source,
  Godot/Unity/Web), **Colyseus** (Node.js, gut für Web/JS), oder **Unity Netcode for
  GameObjects**.
- **Matchmaking, ELO, Lobbies, Regionen-Server** — von Nakama/Photon abgedeckt oder
  eigener Dienst.
- **Persistenz** (Accounts, Loadouts, Progression, Inventar): PostgreSQL + Redis
  (Sessions/Matchmaking-Queue).
- **Auth:** Apple Sign-In + Google Sign-In (Store-Pflicht) + optional E-Mail.
- **IAP:** Apple StoreKit + Google Play Billing (echtes Geld → Gems); serverseitige
  Receipt-Validierung.

### Tick-Rate
- Gefecht: 30 Hz Server-Tick, Client-Prediction + Reconciliation (siehe Match-HUD unten).

---

## Screens / Views (Mobile-MVP — 390×844 pt Basis, iPhone)

Alle Screens teilen dasselbe visuelle System (siehe Design Tokens). Reihenfolge = Flow.

### 1. Splash / App-Icon  (`mobile/01-icon-splash.jsx`)
- **Zweck:** Kaltstart, Marken-Eindruck, Ladeanzeige.
- **Layout:** Vertikal zentriert. Hex-Grid-Hintergrund (12% Deckkraft), App-Icon (200×200,
  radius 44), darunter Wortmarke „OMNI-FORGE" (Chakra Petch 700, 44px) + „FIELD COMMAND"
  (IBM Plex Mono, 0.32em Tracking). Ladebalken 220px breit, 2px hoch, gefüllt bis 68%.
- **Interaktion:** Auto-Forward wenn Laden fertig. Build-/Versions-Info unten.

### 2a. Onboarding — Willkommen  (`mobile/02-onboarding.jsx`)
- **Zweck:** Account erstellen oder anmelden.
- **Layout:** Mech-Silhouette (opacity 0.55) mittig oben, Horizont-Silhouette + Boden-Grid
  darunter. Content unten: Eyebrow-Mono, H1 „Baue. Kämpfe. **Repliziere.**" (38px, letztes
  Wort in Cyan/Akzent), Body-Text, zwei CTAs (Konto erstellen = primär, Anmelden = ghost),
  AGB/Datenschutz-Zeile.
- **Interaktion:** „Konto erstellen" → Auth-Sheet (Apple/Google/E-Mail). Klassifikations-
  Stempel oben rechts als Deko.

### 2b. Onboarding — Tutorial  (`mobile/02-onboarding.jsx`)
- **Zweck:** 3-Schritt-Tutorial (hier Schritt 2/3 = Gefecht).
- **Layout:** Hero-Visual (Mini-Battlefield mit Fadenkreuz, Joystick, Fire-Button, 320px
  hoch), darunter Titel + Body, gelbe Tipp-Karte, Pagination (3 Striche, mittlerer aktiv),
  „Weiter ▸".
- **Interaktion:** Wischen/Weiter/Zurück, „Überspringen" oben rechts. Tutorial nur einmal
  (Flag lokal + serverseitig).

### 3. Hub / Hangar  (`mobile/03-hub.jsx`)
- **Zweck:** Home-Bildschirm, zentriert um die aktive Maschine.
- **Layout:** Header (Avatar-Kachel „J4", Name, LVL-Badge, Rang + zwei Währungs-Chips ◆/◇).
  XP-Balken. Große Hangar-Fläche mit Mech (300px), Hangar-Bogen-Frame, 4 Quick-Stats
  (PWR/HP/DPS/CG), Tagesmissions-Banner (gelb, mit Fortschritt 2/3). Bottom: großer CTA
  „⌖ GEFECHT STARTEN" (64px hoch) + 3 Ghost-Buttons (Werkstatt/Shop/Squad). Tab-Bar unten.
- **Interaktion:** CTA → Matchmaking. Tab-Bar-Routen. Tagesmission tippbar.

### 4. Werkstatt  (`mobile/04-werkstatt.jsx`)
- **Zweck:** Maschine bauen, Module per Tap equippen.
- **Layout:** App-Bar (Back / Titel / „Bereit ▸"). Mech-Vorschau (240px) mit Live-Stats-
  Overlay links + Rotations-Control. 4 Kategorie-Tabs (Antrieb/Waffen/Panzerung/Spezial).
  Scroll-Liste mit Modul-Zeilen (Icon, Name, Code, Masse, Power). Logik-Editor-Mini-Karte.
  Bottom-Leiste: Live-Bilanz + Speichern/Deploy.
- **Interaktion:** Modul antippen → equippen (Stats aktualisieren live). Loadout wird
  serverseitig validiert (Gewicht/Energie-Limits).
- **Vollversion der Werkstatt-Logik** siehe Desktop-Prototyp `workshop.jsx` (komplette
  Live-Stat-Berechnung, Schwerpunkt/Kipprisiko, Logik-Regel-Editor, Selbstzerstörungs-Timer).

### 5. Matchmaking  (`mobile/05-matchmaking.jsx`)
- **Zweck:** Gegner-Suche.
- **Layout:** Modus-Pill (3v3 Standard), pulsierende Radar-Such-Animation (3 Pulse-Ringe +
  rotierender Ring), Timer (00:14), 6 Spieler-Slots (grün=ich+Ally, grau=pending,
  rot=enemy), Skill-Fenster-Balken (ELO ± 80, erweitert sich), Abbrechen.
- **Interaktion:** Auto-Search, Slots füllen sich live vom Matchmaking-Dienst. ELO-Fenster
  erweitert sich mit Wartezeit.

### 6. Kampf-HUD  (`mobile/06-match-hud.jsx`)
- **Zweck:** Kern-Gameplay, Touch-Steuerung.
- **Layout (Vollbild, Landscape-fähig):** Oben Vital-Bars (Panzerung/Energie/Hitze) +
  Mini-Radar. Links Drohnen-Strip (Ausschleusen). Rechts SD-Knopf (Selbstzerstörung) +
  Pause + Ping. Mitte Fadenkreuz mit Range/Ziel-Label. Threat-Marker im Weltraum. Unten
  links **virtueller Joystick** (Bewegung), unten rechts **3 Waffen-Tasten im Bogen**
  (KN-88 = primär/größte). Taktik-Feed-Strip unten.
- **Interaktion:** Joystick = Bewegung, Waffen-Tap = Feuer (mit Cooldown-Animation),
  Drohnen-Tap = Ausschleusen, SD-Knopf = 2× Tap. **Server-authoritative**, 30 Hz Tick,
  Client-Prediction + Reconciliation.

### 7. Match-Ende / Sieg  (`mobile/07-match-end.jsx`)
- **Zweck:** Belohnung & Progression.
- **Layout:** Großer „SIEG"-Header (56px, grün, Glow), Score 3-1, Belohnungs-Karte
  (Schrott/Gems/XP mit Aufschlüsselung), Level-Up-Balken (LVL 14→15 mit
  Freischaltungs-Hinweis), 4 Performance-Tiles, Tagesmission-Fortschritt. Actions:
  „Erneut spielen" / „Maschine ändern" / „Zum Hangar".
- **Interaktion:** „Erneut spielen" behält Lobby. XP/Level serverseitig berechnet.

### 8. Profil  (`mobile/08-profile.jsx`)
- **Zweck:** ELO, Stats, Loadouts, Historie.
- **Layout:** Identitäts-Karte (Avatar, Name, ELO, Trend), 3 Stat-Big-Tiles
  (Siege/KDR/Drohnen), letzte 5 Einsätze (Sieg/Niederlage + KDA + Zeit), 4 Loadout-Karten
  (mit PWR/MAS-Balken, aktiv-Markierung), Achievement-Strip (14/80). Tab-Bar.
- **Interaktion:** Loadout tippen → aktivieren. Match-Zeile → Replay (falls implementiert).

### 9. Shop / Saison  (`mobile/09-shop.jsx`)
- **Zweck:** Battle Pass, Module, Currency-Käufe (IAP).
- **Layout:** 4 Tabs (Saison/Module/Bundles/Gems). Operationspass-Hero („Saison 03 · Staub
  & Stahl", 50 Stufen, Fortschritt, nächste Belohnung, Upgrade 990 ◇). Featured-Drops mit
  Timer + Rabatt. Gem-Pakete mit €-Preisen (2,49 / 9,99 / 19,99). Tab-Bar.
- **Interaktion:** Pass-Upgrade & Gem-Packs → echte IAP (StoreKit/Play Billing,
  serverseitige Receipt-Validierung). Modul kaufen → landet in Werkstatt.

### 10. Einstellungen  (`mobile/10-settings.jsx`)
- **Zweck:** Konto, Spiel, Audio, Benachrichtigungen, Datenschutz, Support.
- **Layout:** 6 Sektionen mit Rows (Toggle / Slider / Chevron). Konto-Block mit Avatar,
  Sprach-/Modus-Filter, Empfindlichkeits-Slider, DSGVO (Daten exportieren / Konto löschen),
  Server-Status. Build-Info unten.
- **Interaktion:** Toggles/Slider persistent (lokal + Cloud-Sync). „Konto löschen" =
  DSGVO Art. 17 mit Bestätigung. „Daten exportieren" = Art. 20.

### App-Icon (1024×1024 für Stores)
- Hex-Frame + abstrahierter Mech-Glyph + Wortmarke. Quelle: `mobile/01-icon-splash.jsx`
  (`AppIcon`-Komponente). Für die Stores in 1024×1024 rendern.

---

## Kampfroboter-Dossiers (Design-Referenz für Einheiten-Design)

Zwei fertig gestaltete Mechs. Die Dossiers zeigen **Optik + Fähigkeiten** jeder Einheit —
sie definieren die erste spielbare Roster. Werte (DPS/Cooldown/Reichweite) sind
Balancing-Startpunkte, nicht final.

### KMR-01 «STIER»  (`stier-mech.jsx`) — rot/gelb, Klasse-01 Heavy Assault
15 Systeme:
1. **Hauptbohrer** (zwischen Hörnern) — Sturm-Durchschlag + tunnelt durch Wände/Berge
2/3. **Hörner-Bombenwerfer** — Giftgas-Wolke bei Detonation (Radius 8m, 14s)
4. **Rotglüh-Augen** — 3 Modi: Standard-Scan / Röntgen (12m Stahl) / Geo-Tief (8m Erde)
5. **Spinnenweb-Werfer** — immobilisiert Ziel 10s
6. **Saugknopf-Felder** — Wände/Decken kleben
7. **Laser-Pistole** — Fernwaffe, unbegrenzte Munition
8. **Plasma-Klinge** — reflektiert Geschosse
9. **Produktions-Bucht (Bauch)** — spawnt Elektro-Panzer + Kampfflugzeuge (Reaktor exponiert)
10. **Gift-Stacheln (Beine)** — Tritt + Vergiftung
11. **Fuß-Triebwerk** — Sprung/Schweben (Flug)
12. **Elektro-Schutzschild** — blockt ALLE Fernattacken, Nahkampf durchdringt
13. **Lichtschwert-Schmiede (SBR-FORGE)** — spawnt Ersatz-/zweite Klinge (Doppel-Modus +60% DPS)
14. **Flammenwerfer + Ölsprüher** — 1.840°C schmilzt Metall; Öl-Modus = Pfütze, später zündbar
15. **Regenerative Gift-Stachel-Werfer** — abschießbar, 2 Stacheln/sek Nachwuchs

### KMR-02 «KRAMPUS»  (`krampus-mech.jsx`) — Knochen/Ember, Klasse-02 Subterranean
12 Systeme: Knochen-Hörner (Ramm-**Schild-Bruch**), Stachel-Krone, Wärme-Augen (4m Erde),
Plasma-Kettensäge, Ketten-Werfer (Zug + Blutungs-DOT), Bomben-Werfer (Streu), Bauch-
Produktion (Sturm-Panzer + Höllen-Jäger), **Bohr-Beine** (gräbt sich ein), Erd-Bohr-Modus
(22m tief, taucht überall auf), Elektro-Schutzschild (identisch zu Stier), Reaktorkern
(Schwachstelle), Hörner-Schild-Sensor.

**Kern-Mechaniken beider (systemweit relevant):**
- **Elektro-Schutzschild**: blockt Fernkampf komplett, nur Nahkampf/Schild-Bruch durchdringt.
  Fällt bei offener Bauch-Bucht oder Reaktorkern-Treffer.
- **Matroschka-Produktion**: Mechs bauen im Kampf kleinere Einheiten (Panzer/Flieger).
- **Selbstzerstörung**: Countdown, während dessen der Mech weiter fährt.
- **Bohr-/Tunnel-Fortbewegung** (beide) und **Flug** (Stier).

---

## Interactions & Behavior (Zusammenfassung)
- **Navigation:** Bottom-Tab (Hangar/Werkstatt/Kampf/Profil) + Push-Screens (Matchmaking,
  HUD, Match-Ende, Shop, Settings).
- **Animationen:** Radar-Sweep (3s linear), Puls-Ringe (2.4s), Scan-Sweep über Blueprints
  (6–8s), Cooldown-Balken auf Waffen, rot-pulsierender SD-Knopf.
- **Loading:** Splash-Ladebalken; Matchmaking-Suchanimation.
- **Error/Empty:** Matchmaking-Timeout → ELO-Fenster erweitern; Werkstatt-Validierung
  (Energie/Gewicht überschritten → Warnung, Deploy blockiert).
- **Responsive:** Meta-Screens Portrait 390×844 als Basis (skaliert auf andere Größen);
  Kampf-HUD Landscape.

## State Management (Gameplay-relevant)
- **Client:** aktueller Screen, aktives Loadout, Tweak-/Settings-Werte, Match-State
  (Prediction).
- **Server (authoritative):** Account, Progression (Level/XP/ELO), Inventar (Module/Skins),
  Loadout-Slots, Matchmaking-Queue, Match-Simulation (Positionen, HP, Schild, Cooldowns,
  Produktions-Queue, Selbstzerstörungs-Timer), Currency (Schrott/Gems), IAP-Belege.
- **Match-Loop:** Client sendet Eingaben → Server simuliert 30 Hz → Broadcast Snapshots →
  Client interpoliert/reconciled.

## Design Tokens
Vollständig in `styles.css` (`:root`) + `mobile-styles.css`. Wichtigste:

**Basis-Farben (Militär-Sci-Fi):**
- `--bg-void #06070a`, `--bg-deep #0c0e0a`, `--bg-surface #1b1e16`
- Text: `--bone #d8d4c4`, `--bone-mute #b2ad9a`, `--bone-dim #8a8674`
- Akzent: `--cyan #6fc8d8` / soft `#9fdde8`, `--red #d94838` / bright `#ff5a44`,
  `--amber #d4a82c`, `--green #7fb04a`

**Stier-Farbschema (rot/gelb, override in `stier-mech.jsx`):**
- Gelb `#f4d57a` / dim `#7a5a1c`, Rot `#c8302a` / bright `#ff4d3a`

**Krampus-Farbschema (Knochen/Ember, override in `krampus-mech.jsx`):**
- Knochen `#ebe2c4`, Charcoal `#1a1518`, Ember `#ff5a18`

**Typografie:**
- Display: **Chakra Petch** (400–700) — Titel, Buttons, Zahlen-Header
- Mono: **IBM Plex Mono** (400–600) — Labels, Codes, technische Werte
- UI/Body: **Inter** (400–600)

**Spacing:** 4/8/12/14/16/24px Raster. **Radius:** meist 1–2px (kantiges Militär-Design),
App-Icon 44px. **Touch-Targets:** min. 44px, CTAs 56–64px.

## Assets
- **Keine Bilddateien** — alle Mechs, Icons und Texturen sind inline **SVG** bzw. per CSS
  (Noise/Grain via data-URI). Für ein echtes Spiel sollten die Mechs als richtige
  Sprites/3D-Modelle nach diesen Blueprints modelliert werden.
- **Fonts:** Google Fonts (Chakra Petch, IBM Plex Mono, Inter) — im Spiel als
  eingebettete Font-Assets bundeln.

## Files (in diesem Bundle)
- `index.html` + `app.jsx`, `workshop.jsx`, `battlefield.jsx`, `mech.jsx`, `data.js`,
  `styles.css`, `tweaks-panel.jsx` — Desktop-Referenz (volle Werkstatt-/Schlachtfeld-Logik)
- `mobile-app.html` + `mobile-app.jsx` + `mobile/*.jsx` + `mobile-styles.css` — Mobile-MVP
  (11 Screens im Design-Canvas)
- `stier-mech.html` + `stier-mech.jsx` — KMR-01 «Stier» Dossier
- `krampus-mech.html` + `krampus-mech.jsx` — KMR-02 «Krampus» Dossier

Zum Ansehen: die `.html`-Dateien im Browser öffnen.

---

## Vorgeschlagene Bau-Reihenfolge (für Claude Code)
1. **Projekt-Setup** im gewählten Stack (z.B. Godot 4 + Nakama) + Auth (Apple/Google).
2. **Meta-UI** nachbauen: Hub → Werkstatt → Profil → Shop → Settings (statisch, dann an
   Backend anbinden). Datenmodell: User, Module, Loadout, Currency, Season.
3. **Werkstatt-Logik** aus `workshop.jsx` portieren (Live-Stats, Validierung, Loadout-Save).
4. **Erste Einheit** (KMR-01 «Stier») als spielbarer Mech modellieren + Basis-Bewegung +
   1–2 Waffen. Server-authoritative Grundgerüst.
5. **Matchmaking + Netcode** (Nakama/Photon), dann 1v1 spielbar machen.
6. **Kampf-HUD** aus `mobile/06-match-hud.jsx` an echtes Gameplay binden.
7. **Match-Ende + Progression** (XP/ELO/Belohnungen), dann 3v3 & FFA.
8. **Zweite Einheit** (Krampus), Matroschka-Produktion, Selbstzerstörung, Schild-System.
9. **IAP + Season-Pass**, Store-Assets (Icon, Screenshots), Store-Einreichung.
