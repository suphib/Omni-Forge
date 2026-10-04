// Selbsttest des Relays: node test.mjs  (startet einen eigenen Server auf Port 18765)
import { spawn } from "node:child_process";
import WebSocket from "ws";
const PORT = 18765, URL0 = `ws://127.0.0.1:${PORT}/`;
const srv = spawn("node", ["server.mjs"], { env: { ...process.env, PORT: String(PORT) }, stdio: "ignore" });
const sleep = ms => new Promise(r => setTimeout(r, ms));
let fails = 0; const ok = (c, msg) => { console.log((c ? "✓ " : "✗ ") + msg); if (!c) fails++; };
const open = (room, opts = {}) => new Promise(res => { const ws = new WebSocket(URL0 + "?room=" + room, opts); ws.got = []; ws.on("message", d => ws.got.push(JSON.parse(d.toString()))); ws.on("open", () => res(ws)); ws.on("unexpected-response", (rq, rs) => res({ status: rs.statusCode })); ws.on("error", () => {}); ws.on("close", c => { ws.closeCode = c; }); });
await sleep(700);
try {
  const a = await open("TEST"), b = await open("TEST"), c = await open("ANDERS");
  await sleep(100);
  ok(a.got.some(m => m.t === "srv" && m.n === 2), "Raum meldet 2 Spieler");
  a.send(JSON.stringify({ t: "s", id: "aaa111", x: 5 })); await sleep(100);
  ok(b.got.some(m => m.t === "s" && m.x === 5), "Zustand kommt beim Mitspieler an");
  ok(!a.got.some(m => m.t === "s"), "kein Echo an den Absender");
  ok(!c.got.some(m => m.t === "s"), "anderer Raum bekommt nichts");
  a.send(JSON.stringify({ t: "s", id: "fake99", x: 9 })); await sleep(100);
  ok(!b.got.some(m => m.x === 9), "gefälschte Absender-ID wird verworfen");
  a.send(JSON.stringify({ t: "boom", id: "aaa111" })); a.send("kein json"); a.send(Buffer.from([1, 2, 3])); await sleep(100);
  ok(b.got.filter(m => m.t !== "srv").length === 1, "unbekannte Typen/kaputte Daten werden verworfen");
  const d = await open("TEST"), e = await open("TEST"); await sleep(100);
  const f = await open("TEST"); await sleep(150);
  ok(f.got.some(m => m.t === "full") && f.closeCode === 1013, "5. Spieler wird abgewiesen (Raum voll)");
  a.close(); await sleep(150);
  ok(b.got.some(m => m.t === "bye" && m.id === "aaa111"), "Mitspieler bekommt „bye“ beim Verlassen");
  const bad = await open("böse raum!!"); ok(bad.status === 400, "ungültiger Raumname → 400");
  const evil = await open("TEST", { headers: { Origin: "https://boese.example" } }); ok(evil.status === 403, "fremde Herkunft → 403");
  const gh = await open("TEST2", { headers: { Origin: "https://suphib.github.io" } }); ok(gh.send, "GitHub-Pages-Herkunft erlaubt");
  const big = await open("TEST3"); big.send("x".repeat(5000)); await sleep(150); ok(big.closeCode === 1009, "zu große Nachricht → Verbindung zu");
  const h = await (await fetch(`http://127.0.0.1:${PORT}/health`)).json(); ok(h.ok && h.relayed >= 1, "Health-Abfrage antwortet");
} finally { srv.kill(); }
console.log(fails ? `\n${fails} Test(s) FEHLGESCHLAGEN` : "\nalle Tests grün"); process.exit(fails ? 1 : 0);
