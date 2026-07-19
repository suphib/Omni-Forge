# Omni-Forge — Roadmap

Zwei Spuren: **Spur A** verbessert den Browser-Prototyp (schnelle, günstige Iterationen zum
Ausprobieren, was Spaß macht). **Spur B** ist der bestehende 9-Schritte-Plan für das echte
Mobile-Spiel (`design_handoff_omni_forge/README.md` → „Vorgeschlagene Bau-Reihenfolge").
Empfehlung: erst A weiterdrehen, bis sich das Gameplay richtig gut anfühlt — jede Erkenntnis
fließt später in B ein.

## Spur A — Prototyp (v4, v5, …)

### v4 — Match-Struktur & Spielgefühl ✅ (gebaut, `playable-prototype/v4/`)
- [x] **Spielziel:** Sieg bei 5 Kills oder nach 3 Minuten (bei Zeitablauf mehr Kills = Sieg,
      Gleichstand = Unentschieden); Sieger-/Verlierer-Bildschirm mit Statistik
      (Kills, Tode, Schaden, Treffer-%, Schrott) und „Nochmal" / „Andere Einheit".
- [x] **Schwierigkeitsgrade:** Leicht / Mittel / Schwer auf dem Startbildschirm — skaliert
      KI-Cooldown (`aiCd`), Spieler-Schadensbonus/-resistenz (`playerDeal`/`playerTake`) und
      KI-Schild-Nutzung (`aiShield`) über das `DIFFS`-Objekt.
- [x] **Countdown & Musik:** 3-2-1-Countdown (Kampf eingefroren), prozedurale 16-Schritt-
      Kampfmusik-Loop (`musicTick`), Sieges-Fanfare / Niederlage-Sound.
- [x] **Kill-Cam-Moment:** Zeitlupe + Kamera-Zoom auf die Explosion (`killPos` in `updateCamera`).

### v5 — Mechs zum Anfassen ✅ (gebaut, `playable-prototype/v5/`)
- [x] **Bessere Mech-Modelle:** näher an den Dossiers (Stier: hexagonale Saugknöpfe + Doppelhorn,
      Krampus: rotierende Bohr-Beine + Kranz aus Knochen-Stacheln). Lauf-Animation der Beine,
      Oberkörper dreht zum Ziel während die Beine in Laufrichtung zeigen (`upper`-Gruppe im Modell),
      Wrack kippt um und bleibt rauchend liegen bis zum Respawn.
- [x] **Loadout-Auswahl vor dem Match:** eigener Ausrüstungs-Screen (Karte → Loadout → Kampf);
      Fähigkeiten frei an-/abwählbar (Default alle an — bewusst nicht auf hartes „2 von 5"
      begrenzt, um den Spaß nicht zu beschneiden) + optionale Drohne. Gating über `player.equip`.
- [x] **Drohne:** „Späher SCT-1" als optionales Modul — begleitet den Spieler und feuert
      automatisch auf den Gegner (`updateDrone`/`fireDrone`).

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
