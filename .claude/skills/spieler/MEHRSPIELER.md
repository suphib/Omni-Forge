# Mehrspieler — Stand und Plan (2 bis 4 Spieler)

**Stand (v18):** läuft über das Internet — Handys/Rechner verbinden sich per WebSocket mit dem Spiel-Relay `wss://spiel.fraglokal.de` (Details unten, „Online“). Zwei Bots wurden gegen den echten Server getestet. Die Spielidee ist seit v17 unverändert:

**Spielidee (seit v17):** Idee: Jeder Spieler führt sein **eigenes Spiel** (eigene Welt, Gegner, Bosse). Wer in derselben Welt ist, erscheint beim anderen als „Abbild" (Name, HP-Balken, Minimap-Punkt) und kann gegen ihn kämpfen. Wer in einer anderen Welt ist, steht nur in der Liste oben („Ben (BERG)").

- **Verbindung:** Raum-Code im Startmenü (oder `?room=ABC&name=Anna`). Bis 4 Spieler pro Raum. Zweiter Tab im selben Browser: Adresse mit `&slot=2` (eigener Speicherstand). `?net=local` = alter Browser-Kanal ohne Server.
- **Nachrichten:** ~10×/s Zustand (Welt, Position, Blickrichtung, HP, lebt, Basis) und jede Waffen-Aktivierung (Slot, Richtung, Ort). Jeder simuliert die Schüsse der anderen bei sich und verletzt **nur sich selbst** — jeder bestimmt über seine eigene HP, es gibt keinen Treffer-Nachrichtenverkehr.
- **Treffer auf ein Abbild:** nur Anzeige (Funken, Schadenszahl, Super lädt). Fällt das Abbild, bekommt der Letzte, der es in den letzten 4 s traf, den „PvP-KILL" — ohne Schrott (sonst wäre Selbst-Farmen mit zwei Tabs ein Geldautomat).
- **Gegner/Bosse:** bleiben lokal (nicht geteilt). Basis und Turm sind unverwundbar wie im Einzelspiel.
- **Grenzen jetzt:** Hintergrund-Tabs/gesperrtes Handy pausieren → Mitspieler verschwindet nach 6 s (beim Zurückkehren verbindet sich das Spiel neu); Schüsse zu Fuß (Pilot) werden nicht übertragen; Position wird geglättet, nicht vorhergesagt; Spieler vertrauen sich (kein Betrugsschutz).
- **Messwerte (Lauf mp-erster):** Welten-Trennung korrekt, Treffen nach 12 s, gegenseitige Treffer, ein PvP-Kill, mittlerer Abstandsfehler der Abbilder 51 Einheiten (max 500 beim Dash/Überlagerung).

## Online (v18) — so läuft es

- **Server:** `server/spiel/` (Node + `ws`, ~100 Zeilen, Selbsttest `npm test`). Leitet nur Nachrichten weiter: Raum-Code geprüft, Nachrichtenform/-größe (2 KB)/Rate (120/s) begrenzt, Absender-ID pro Verbindung fest, max. 4 pro Raum, 200 Räume, 8 Verbindungen je IP, Origin nur `https://suphib.github.io` + localhost, Ping/Timeout. `GET /health` liefert Zahlen.
- **Wo:** Container `omniforge-spiel` auf dem Fraglokal-Live-Server (`194.117.224.135`, Ordner `/opt/omni-forge-spiel`, eigenes Compose-Projekt, 128 MB / 0,25 CPU, **eigenes Docker-Netz `spiel-net`** — der Container hat keinen Zugang zu Fraglokals Datenbank/Redis/App; Netz einmalig mit `docker network create spiel-net` anlegen). Fraglokals nginx leitet `spiel.fraglokal.de` weiter (eigenes Zertifikat, Erneuerung über den vorhandenen certbot-Cron). Deploy: Ordner per `tar | ssh` hochladen, dort `docker compose up -d --build`.
- **⚠ Zwei Dinge im Fraglokal-Repo (müssen committet **und** gepusht sein):** (1) der nginx-Block in `Fraglokal-website/fraglokal/nginx/fraglokal.conf`; (2) in `docker-compose.live.yml` hängt Fraglokals nginx zusätzlich in `spiel-net` (damit er das Spiel erreicht). Fraglokals Live-Deploy kopiert beides bei jedem Release über den Server-Stand → fehlt eins, ist `spiel.fraglokal.de` nach dem nächsten Fraglokal-Release weg (Spiel meldet „getrennt“). Umgekehrt: Die Compose-Datei in `server/spiel/` muss `spiel-net` behalten, sonst hängt das nächste Spiel-Update den Container wieder ins Fraglokal-Netz. Backup der Original-Datei: `/opt/omni-forge-spiel/backup/`.
- **Fraglokal-Releases unterbrechen kurz** (nginx ist ~30 s weg): das Spiel zeigt „getrennt, verbinde neu …“ und verbindet sich selbst wieder (Abstand 1/2/4/8 s).
- **Test gegen den echten Server:** `node tools/mehrspieler.mjs --version v18 --spieler 2 --tag v18-live` (ohne `--relay`). Lokal: Relay mit `PORT=8765 node server.mjs`, Test mit `--relay ws://127.0.0.1:8765/` (`relay=` wird vom Spiel nur auf localhost beachtet).
- **Empfang gehärtet:** alles von außen wird bereinigt (Name, Zahlen begrenzt, Mech-/Weltname nur aus bekannten, Waffen-Plätze nur aus der Liste, höchstens ~14 Aktivierungen/s je Mitspieler). Der Raum-Code ist die einzige Zugangsschranke; echter Login/Betrugsschutz fehlt weiter.
- **Messwerte (v18 gegen echten Server):** Trennung der Welten korrekt, Treffen nach 12 s, gegenseitige Treffer (10 und 86 angezeigt), mittlerer Abstandsfehler 30 Einheiten, keine Seitenfehler; Server-Last ~0 % CPU, 18 MB.

**Nächste Schritte (Entscheidung nötig):**
1. *Zwei echte Handys* ausprobieren (Latenz im Mobilfunk, Sperrbildschirm, Reconnect).
2. *Gemeinsame Bosse (Co-op)* — ein Spieler „besitzt“ den Boss, die anderen sehen ihn.
3. *Login/Rangliste* — jetzt möglich, weil ein eigener Server existiert (Konten, Namen reservieren, Bestenliste).
4. *Pilot-Schüsse übertragen*, Vorhersage der Bewegung.
