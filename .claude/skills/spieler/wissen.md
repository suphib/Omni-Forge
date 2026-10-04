# Wissen des Spielers

Stabile Fakten über Spiel und Bot. Neue Erkenntnisse zuerst in `erkenntnisse.md`, hier nur, was dauerhaft gilt.

## Spiel (Stand v16)
- Die Welt ist eine 2D-Simulation (x,z); Höhe nur optisch. Berg-Heimat: Basis-Kuppel (Radius 2000) bei x 3300, z 5400, **Tor nur bei +x** — wer anders hinauswill, bleibt an der Wand hängen und wird von Türmen beschossen.
- Portale (Berg): Wiese (4500|1680), Eis (4500|9120), Lava (9750|9180). Boss-Arena rechts der Karte (x ≈ 12150).
- **Schild** wirkt nur, wenn er eingeschaltet ist (Taste Shift / Knopf). Er hält max. 5 s, lädt in 14 s nach. Wer ihn nie einschaltet, hat 600 HP weniger — der Bot schaltet ihn nach Treffern ein.
- `autoFire` (Maus halten) setzt Fähigkeiten selbst ein; der Bot muss nur zielen, laufen und halten.
- Wachtürme mit Zwergen schießen auf alles im Umkreis von 2800 (außer in der Basis). Rivalen (Krampus) greifen erst jenseits des Flusses an.
- Die Spielschleife begrenzt dt auf 0,05 s; im Headless-Browser läuft das Spiel deshalb langsam. Der Bot ruft deshalb `update(1/30)` selbst in Schleifen auf (schneller als Echtzeit).
- Belohnung pro Rivalen-Abschuss 250 ⬡ / 60 ⚡; Boss ×1,5; Startbonus +500/+250 (einmalig, im Speicherstand).

## Bot
- Er spielt in der Hinten-Kamera mit Panzersteuerung (W/S, Q/E seitwärts, Blickrichtung `fpYaw` setzt er direkt wie die Maus).
- Wegpunkt-Regel für die Basis: raus/rein immer über das Tor-Ziel (BASE.x + R + 300 | BASE.z).
- Hänger-Erkennung: weniger als 120 Einheiten in 2,5 s → 1,4 s abbiegen.
- Bodenschlag (ab v16): roter Kreis, 1,5 s Vorlauf — der Bot läuft vom Mittelpunkt weg (`dodgeSlams`).
- Spielzeit pro Boss ≈ 25–35 s Reise + 30–40 s Kampf. Ein Lauf über die ersten drei Bosse ≈ 220 s Spielzeit.

## Bringt nichts / Vorsicht
- Ein Lauf allein sagt nichts: HP-Verlust schwankt stark (Rivalen, Zufall). Immer ≥ 3 Läufe vergleichen.
- Screenshots nach `update`-Schleifen zeigen schon spätere Spielzustände, weil die echte Frame-Schleife weiterläuft — für Momentaufnahmen nur wenige Schritte (≈ 14) vor dem Foto machen.

## Mehrspieler (ab v17)
- Ein Playwright-Kontext = ein gemeinsamer Browser-Kanal. Mehrere Seiten im selben Kontext teilen aber `localStorage` → pro Spieler `?slot=Name` setzen.
- Bots im Gleichschritt: kleine Häppchen (`__bot.run(10)`) abwechselnd auf allen Seiten, damit Nachrichten zwischendurch ankommen. Lange blockierende Schleifen (wie beim Einzelspieler) gehen hier nicht.
- Tab-Hintergrund pausiert die Spielschleife; Mitspieler verschwindet nach 6 s ohne Zustand. Beim Screenshot einer Seite stehen die anderen kurz still.
- PvP-Kills zahlen keinen Schrott (sonst Geldautomat mit zwei Tabs).
