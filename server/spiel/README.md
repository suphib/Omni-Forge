# Spiel-Relay (Omni-Forge Mehrspieler)

WebSocket-Raum-Relay für 2–4 Spieler. Jeder Spieler führt sein eigenes Spiel; der Server leitet nur Zustand und Waffen-Aktivierungen
der Spieler eines Raums weiter (keine Spiellogik, keine Speicherung). Client: `playable-prototype/v18/` ab v18.

- Lokal testen: `npm install && npm test`, starten mit `PORT=8765 node server.mjs`
- Live: `wss://spiel.fraglokal.de/?room=ABC` (Container `omniforge-spiel` auf dem Fraglokal-Server, nginx von Fraglokal leitet weiter)
- Gesundheit: `https://spiel.fraglokal.de/health`
- Server-Ordner: `/opt/omni-forge-spiel/` → `docker compose up -d --build`
- Netz: eigenes Docker-Netz `spiel-net` (einmalig `docker network create spiel-net`); Fraglokals nginx ist dort zusätzlich angehängt (`docker-compose.live.yml` im Fraglokal-Repo). Der Container erreicht Datenbank/Redis/App von Fraglokal nicht.
- Zertifikat: eigenes Let's-Encrypt-Zertifikat `spiel.fraglokal.de` (Erneuerung über den vorhandenen certbot-Cron)
- nginx-Block steht in `Fraglokal-website/fraglokal/nginx/fraglokal.conf` (zusammen mit dem Netz-Eintrag in `docker-compose.live.yml` im Fraglokal-Repo committet und gepusht, sonst überschreibt der nächste Fraglokal-Deploy ihn)
