# Omni-Forge — Roadmap

Zwei Spuren: **Spur A** verbessert den Browser-Prototyp (schnelle, günstige Iterationen zum
Ausprobieren, was Spaß macht). **Spur B** ist der bestehende 9-Schritte-Plan für das echte
Mobile-Spiel (`design_handoff_omni_forge/README.md` → „Vorgeschlagene Bau-Reihenfolge").
Empfehlung: erst A weiterdrehen, bis sich das Gameplay richtig gut anfühlt — jede Erkenntnis
fließt später in B ein.

## Spur A — Prototyp (v4, v5, …)

### v4 — Match-Struktur & Spielgefühl (empfohlener nächster Schritt)
- [ ] **Spielziel:** Sieg bei 5 Kills oder nach 3 Minuten; Sieger-/Verlierer-Bildschirm mit
      Statistik (Kills, Schaden, Genauigkeit) und „Nochmal"-Button. Aktuell ist das Duell endlos.
- [ ] **Schwierigkeitsgrade:** Leicht / Mittel / Schwer wählbar auf dem Startbildschirm
      (skaliert KI-Cooldowns, Schaden und Reaktionsweite — die Stellschrauben existieren schon).
- [ ] **Countdown & Musik:** 3-2-1-Start, kurze Kampf-Loop-Musik (prozedural), Sieges-Fanfare.
- [ ] **Kill-Cam-Moment:** Zeitlupe existiert; dazu kurzer Kamera-Zoom auf die Explosion.

### v5 — Mechs zum Anfassen
- [ ] **Bessere Mech-Modelle:** näher an den Dossier-Designs (Stier: Saugknöpfe/Doppelhorn,
      Krampus: Bohr-Beine/Knochen-Stacheln), Lauf-Animation der Beine, Torso dreht zum Ziel,
      Wrack bleibt nach Zerstörung kurz liegen.
- [ ] **Loadout-Auswahl vor dem Match:** 2 von 5 Fähigkeiten frei wählen (nutzt die
      Modul-Idee aus `data.js` — Vorstufe der Werkstatt aus dem Handoff).
- [ ] **Drohnen:** `data.js` definiert bereits DRONES — eine Begleit-Drohne als 6. Fähigkeit.

### v6 — Progression light
- [ ] **Schrott ausgeben:** Zwischen Matches Upgrades kaufen (Panzerung +10 %, Cooldown −10 %,
      Munition +25 %) — Spielstand in `localStorage`.
- [ ] **Match-Historie:** Siege/Niederlagen pro Schwierigkeitsgrad.

### v7 — Mobile-Polish
- [ ] **PWA:** Manifest + Icon, damit „Zum Home-Bildschirm" wie eine echte App startet (Vollbild).
- [ ] **Performance-Modus:** Schatten/Partikel automatisch reduzieren auf schwächeren Geräten.
- [ ] **Gamepad-Support** am Desktop/iPad (Gamepad API).

### v8 — Multiplayer-Experiment (optional, größerer Brocken)
- [ ] Echtes 1v1 über WebRTC/Firebase als Machbarkeitstest. Achtung: Das echte Spiel plant
      server-authoritative Netcode (Nakama/Photon) — dieses Experiment ist Wegwerf-Lerncode.

## Spur B — Produktionsspiel (bestehender Plan, unverändert)

Siehe `design_handoff_omni_forge/README.md` → „Vorgeschlagene Bau-Reihenfolge":
Stack-Setup + Auth → Meta-UI → Werkstatt-Logik → erste Einheit (Stier) server-authoritative →
Matchmaking/Netcode → Kampf-HUD → Match-Ende/Progression (3v3, FFA) → zweite Einheit (Krampus,
Matroschka, Selbstzerstörung) → IAP/Season-Pass/Store-Einreichung.

**Startkriterium für Spur B:** Wenn sich im Prototyp Steuerung, Waffen-Balance und
Match-Struktur (v4) über mehrere Testrunden auf dem iPad gut anfühlen — dann lohnt der
Umstieg auf die richtige Engine, und die Prototyp-Werte dienen als Balancing-Startpunkt.
