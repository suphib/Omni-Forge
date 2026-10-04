---
name: spieler
description: Der Spieler — spielt Omni-Forge selbst (Bot im Headless-Browser), läuft durch die Welten bis zu den Endgegnern, kämpft, benutzt Portale und Shop, schreibt Erkenntnisse auf und wird mit jedem Lauf besser. Nutzen, wenn eine neue Version (vN) getestet, Balance/Spielspaß geprüft oder "spiel das mal durch" gewünscht ist. Später: mehrere Spieler gegeneinander.
---

# Spieler

Ein Bot, der Omni-Forge wie ein Mensch bedient (Tasten, Zielrichtung, Portale, Shop), alles protokolliert und daraus lernt.
Er ersetzt keinen Menschen am Handy — er findet Hänger, Balance-Probleme, Leerlauf und Fehler, bevor Suphi sie findet.

## Ablauf (jedes Mal)

1. **Wissen lesen:** `wissen.md` (was über Spiel und Bot gilt), die letzten Zeilen von `verlauf.md`, `erkenntnisse.md` (oben = neu). Nichts doppelt herausfinden.
2. **Bereit machen (einmalig):** `bash .claude/skills/spieler/tools/setup.sh` (installiert playwright-core außerhalb des Repos; Chrome kommt vom System, sonst `CHROME=…`).
3. **Spielen:** `node .claude/skills/spieler/tools/play.mjs --version vN --tag <idee>-1 --notiz "<was ist neu>"`
   - Standard: Wiese → Berg → Eis (die ersten drei Endgegner), danach Bericht in `berichte/` und eine Zeile in `verlauf.md`.
   - Andere Bosse: `--bosse wiese,berg,eis,lava`. Ohne Bilder: `--keine-bilder`. Arbeitsordner: `--out DIR` (Bilder in `DIR/bilder`).
   - Ein Lauf dauert ca. 3–4 Minuten echte Zeit. **Für Entscheidungen mindestens 3 Läufe** mit Tags `<idee>-1/-2/-3`, dann `node .claude/skills/spieler/tools/vergleich.mjs` (Mittelwerte pro Idee).
4. **Ansehen:** den Bericht lesen und 3–4 Bilder aus `DIR/bilder` mit dem Read-Tool anschauen (Kampf, Ankunft, Sieg). Der Bot sieht nur Zahlen — Aussehen, Verdeckungen, überlappende Texte beurteilt man am Bild.
5. **Aufschreiben:** in `erkenntnisse.md` oben einen Eintrag: *Was fiel auf · Warum (Beleg: Zahl/Bild) · Was geändert wurde · Wirkung*. Allgemeingültiges (Regeln, Zahlen, Tricks) zusätzlich in `wissen.md`.
6. **Lernen (ein Schritt pro Runde):** eine Stellschraube in `strategie.json` ODER eine Verhaltensregel im Bot (`tools/bot.js`) ändern, wieder 3 Läufe, vergleichen. Besser → behalten und `stand` hochzählen; schlechter → zurück und in `wissen.md` als „bringt nichts" notieren.
7. **Spiel verbessern:** Findet der Bot ein Spielproblem (zäh, zu leicht, Meldungs-Spam, Hänger), wird es in einer **neuen** Version `vN+1` behoben (nie eine ausgelieferte Version ändern), und der Bot spielt sie gegen.
8. **Melden:** 3–5 Zeilen, einfaches Deutsch, Ergebnis zuerst („alle 3 Bosse in 220 s, 1 Tod — Kämpfe zu kurz"), keine Dateinamen.

## Regeln

- Der Bot läuft nur in einer **Debug-Kopie** (`window.__g` wird von `play.mjs` eingebaut). Ausgelieferte Dateien bleiben unberührt.
- Dem Bot nichts schenken, was ein Mensch nicht hat (kein Teleport, keine HP setzen). Teleport nur für gezielte Einzeltests (z. B. Bodenschlag-Aussehen).
- Ein einzelner Lauf ist Zufall (Gegner, Treffer). Aussagen wie „besser/schlechter" erst nach ≥ 3 Läufen.
- Steckt der Bot fest, zuerst fragen: Bot-Fehler oder echtes Spielproblem (könnte ein Mensch dort auch hängen)?
- Ergebnisse sind ehrlich zu berichten, auch wenn eine Verbesserung nichts brachte.

## Dateien

- `tools/play.mjs` — startet Spiel + Bot, schreibt Bericht und Verlauf · `tools/bot.js` — das Verhalten (läuft im Spiel) · `tools/setup.sh` · `tools/vergleich.mjs`
- `strategie.json` — Stellschrauben des Bots (`stand` = Lernstand) · `wissen.md` · `erkenntnisse.md` · `verlauf.md` · `berichte/` (ein Bericht pro Lauf)

## Mehrspieler (ab v17)

`node .claude/skills/spieler/tools/mehrspieler.mjs --version v17 --spieler 2 --tag mp-1` startet zwei (bis vier) Bots in einem Raum — je ein Tab im selben Browser (gemeinsamer Browser-Kanal), eigener Name und eigener Speicherstand (`?slot=`).
Szenario: **A** getrennte Welten (einer geht ins Portal, die anderen bleiben; geprüft: sie sehen sich nur als „in Welt X", nicht im Spiel) → **B** alle in dieselbe Welt, jagen und bekämpfen sich. Gemessen werden: wann sie sich treffen, erster Treffer, Kills/Tode, Waffen-Nachrichten, Abstandsfehler der Abbilder.
Plan, Grenzen und offene Punkte (Internet-Verbindung, Betrugsschutz, gemeinsame Bosse): `MEHRSPIELER.md`.
