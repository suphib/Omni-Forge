# Mehrspieler — Stand und Plan (2 bis 4 Spieler)

**Stand (v17, getestet mit zwei Bots):** funktioniert im selben Browser (zwei Tabs). Idee: Jeder Spieler führt sein **eigenes Spiel** (eigene Welt, Gegner, Bosse). Wer in derselben Welt ist, erscheint beim anderen als „Abbild" (Name, HP-Balken, Minimap-Punkt) und kann gegen ihn kämpfen. Wer in einer anderen Welt ist, steht nur in der Liste oben („Ben (BERG)").

- **Verbindung:** Raum-Code im Startmenü (oder `?room=ABC&name=Anna`). Zweiter Tab im selben Browser: Adresse mit `&slot=2` (eigener Speicherstand). Bis 4 Spieler (3 Mitspieler) pro Raum.
- **Nachrichten:** ~10×/s Zustand (Welt, Position, Blickrichtung, HP, lebt, Basis) und jede Waffen-Aktivierung (Slot, Richtung, Ort). Jeder simuliert die Schüsse der anderen bei sich und verletzt **nur sich selbst** — jeder bestimmt über seine eigene HP, es gibt keinen Treffer-Nachrichtenverkehr.
- **Treffer auf ein Abbild:** nur Anzeige (Funken, Schadenszahl, Super lädt). Fällt das Abbild, bekommt der Letzte, der es in den letzten 4 s traf, den „PvP-KILL" — ohne Schrott (sonst wäre Selbst-Farmen mit zwei Tabs ein Geldautomat).
- **Gegner/Bosse:** bleiben lokal (nicht geteilt). Basis und Turm sind unverwundbar wie im Einzelspiel.
- **Grenzen jetzt:** nur ein Browser (Tabs); Hintergrund-Tabs pausieren → Mitspieler verschwindet nach 6 s; Schüsse zu Fuß (Pilot) werden nicht übertragen; Position wird geglättet, nicht vorhergesagt; Spieler vertrauen sich (kein Betrugsschutz).
- **Messwerte (Lauf mp-erster):** Welten-Trennung korrekt, Treffen nach 12 s, gegenseitige Treffer, ein PvP-Kill, mittlerer Abstandsfehler der Abbilder 51 Einheiten (max 500 beim Dash/Überlagerung).

**Nächste Schritte (Entscheidung nötig):**
1. *Internet/Handys:* gleiche Nachrichten über ein anderes Rohr. Optionen: (a) WebRTC über PeerJS (kein eigener Server, aber fremder Vermittler-Dienst), (b) kleiner WebSocket-Vermittler (Node, ~30 Zeilen) auf einem Hoster mit TLS (Fly.io/Render/Cloudflare) — verlässlicher, kostet Pflege. GitHub Pages kann keinen Server.
2. *Gemeinsame Bosse (Co-op)* — ein Spieler „besitzt" den Boss, die anderen sehen ihn.
3. *Rangliste/Login* — erst mit Server sinnvoll.
4. *Pilot-Schüsse übertragen*, Vorhersage der Bewegung, Reconnect.
