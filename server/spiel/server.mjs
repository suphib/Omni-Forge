// Omni-Forge · Spiel-Relay
// Leitet Nachrichten zwischen den Spielern EINES Raums weiter (max. 4). Keine Spiellogik, keine Speicherung —
// jeder Spieler führt sein eigenes Spiel, der Server verteilt nur Zustand und Waffen-Aktivierungen.
// Schutz: Raumname/Nachrichtenform geprüft, Größe und Rate begrenzt, Absender-ID festgelegt (kein Fremd-Absender),
// Grenzen für Räume/Verbindungen/IP, Origin-Prüfung, Ping/Timeout.
import http from "node:http";
import { WebSocketServer } from "ws";

const PORT = +process.env.PORT || 8080;
const ORIGINS = (process.env.ALLOWED_ORIGINS || "https://suphib.github.io").split(",").map(s => s.trim()).filter(Boolean);
const MAX_ROOM = 4, MAX_ROOMS = 200, MAX_CONN = 400, MAX_PER_IP = 8;
const MAX_MSG = 2048, MAX_PER_SEC = 120, PING_MS = 15000;
const TYPES = new Set(["s", "a", "hi", "bye"]);
const ROOM_RE = /^[A-Z0-9_-]{1,12}$/, ID_RE = /^[a-z0-9]{3,12}$/;

const rooms = new Map();                // Raumname -> Set<ws>
const perIp = new Map();                // IP -> Anzahl
let conns = 0, total = 0, relayed = 0;
const started = Date.now();

const originOk = o => {
  if (!o) return true;                  // Nicht-Browser (Test-Skripte); Browser senden immer eine Herkunft
  if (ORIGINS.includes(o)) return true;
  try { const u = new URL(o); return u.hostname === "localhost" || u.hostname === "127.0.0.1"; } catch { return false; }
};
const clientIp = req => String(req.headers["x-real-ip"] || req.socket.remoteAddress || "?");

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json", "cache-control": "no-store" });
    res.end(JSON.stringify({ ok: true, rooms: rooms.size, players: conns, total, relayed, uptimeS: Math.round((Date.now() - started) / 1000) }));
    return;
  }
  res.writeHead(404, { "content-type": "text/plain" }); res.end("Omni-Forge Spiel-Relay\n");
});

const wss = new WebSocketServer({ noServer: true, maxPayload: MAX_MSG, perMessageDeflate: false });

server.on("upgrade", (req, socket, head) => {
  const reject = (code, msg) => { socket.write(`HTTP/1.1 ${code} ${msg}\r\nConnection: close\r\n\r\n`); socket.destroy(); };
  let room;
  try { room = (new URL(req.url, "http://x").searchParams.get("room") || "").toUpperCase(); } catch { return reject(400, "Bad Request"); }
  if (!ROOM_RE.test(room)) return reject(400, "Bad Room");
  if (!originOk(req.headers.origin)) return reject(403, "Forbidden");
  const ip = clientIp(req);
  if (conns >= MAX_CONN || (perIp.get(ip) || 0) >= MAX_PER_IP) return reject(429, "Too Many");
  if (!rooms.has(room) && rooms.size >= MAX_ROOMS) return reject(429, "Too Many Rooms");
  wss.handleUpgrade(req, socket, head, ws => { ws.room = room; ws.ip = ip; wss.emit("connection", ws, req); });
});

const send = (ws, s) => { if (ws.readyState === 1) ws.send(s); };
const count = room => (rooms.get(room) || new Set()).size;
const announce = room => { const set = rooms.get(room); if (set) for (const c of set) send(c, JSON.stringify({ srv: 1, t: "srv", n: set.size })); };

wss.on("connection", ws => {
  const { room, ip } = ws;
  let set = rooms.get(room);
  if (set && set.size >= MAX_ROOM) { send(ws, JSON.stringify({ srv: 1, t: "full" })); ws.close(1013, "Raum voll"); return; }
  if (!set) rooms.set(room, set = new Set());
  set.add(ws); conns++; total++; perIp.set(ip, (perIp.get(ip) || 0) + 1);
  ws.alive = true; ws.pid = null; ws.win = 0; ws.winT = Date.now();
  announce(room);

  ws.on("pong", () => { ws.alive = true; });
  ws.on("message", (data, isBinary) => {
    if (isBinary) return;
    const now = Date.now(); if (now - ws.winT >= 1000) { ws.winT = now; ws.win = 0; }
    if (++ws.win > MAX_PER_SEC) { ws.close(1008, "Zu viele Nachrichten"); return; }
    const raw = data.toString(); let m;
    try { m = JSON.parse(raw); } catch { return; }
    if (!m || typeof m !== "object" || !TYPES.has(m.t) || typeof m.id !== "string" || !ID_RE.test(m.id)) return;
    if (ws.pid === null) ws.pid = m.id; else if (ws.pid !== m.id) return;         // Absender-ID bleibt fest
    for (const c of set) if (c !== ws) { send(c, raw); relayed++; }
  });
  ws.on("close", () => {
    set.delete(ws); conns--; const n = (perIp.get(ip) || 1) - 1; if (n <= 0) perIp.delete(ip); else perIp.set(ip, n);
    if (ws.pid) for (const c of set) send(c, JSON.stringify({ t: "bye", id: ws.pid }));
    if (!set.size) rooms.delete(room); else announce(room);
  });
  ws.on("error", () => {});
});

setInterval(() => { for (const set of rooms.values()) for (const ws of set) { if (!ws.alive) { ws.terminate(); continue; } ws.alive = false; try { ws.ping(); } catch {} } }, PING_MS).unref();

server.listen(PORT, () => console.log(`[spiel] Relay läuft auf :${PORT} · Herkünfte: ${ORIGINS.join(", ")} + localhost`));
process.on("SIGTERM", () => { wss.clients.forEach(c => c.close(1001)); server.close(() => process.exit(0)); setTimeout(() => process.exit(0), 2000).unref(); });
