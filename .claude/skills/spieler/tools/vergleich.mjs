#!/usr/bin/env node
// Vergleicht Läufe aus verlauf.md: gruppiert nach Lauf-Name ohne Endnummer ("idee-1" → "idee") und zeigt Mittelwerte.
import fs from 'fs'; import path from 'path'; import { fileURLToPath } from 'url';
const f = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'verlauf.md');
const rows = fs.readFileSync(f, 'utf8').split('\n').filter(l => /^\| 20\d\d-/.test(l)).map(l => l.split('|').slice(1, -1).map(x => x.trim()));
const g = {};
for (const [d, v, tag, ok, zeit, tode, schaden, schrott, pp] of rows) { const k = v + ' · ' + tag.replace(/-\d+$/, ''); (g[k] ||= []).push({ ok: ok === 'ja', zeit: +zeit, tode: +tode, schaden: +schaden }); }
const avg = a => (a.reduce((x, y) => x + y, 0) / a.length).toFixed(0);
console.log('Gruppe'.padEnd(34), 'Läufe', 'geschafft', 'Zeit s', 'Tode', 'Schaden');
for (const [k, a] of Object.entries(g)) console.log(k.padEnd(34), String(a.length).padStart(5), (a.filter(x => x.ok).length + '/' + a.length).padStart(9), avg(a.map(x => x.zeit)).padStart(6), (a.reduce((s, x) => s + x.tode, 0) / a.length).toFixed(1).padStart(4), avg(a.map(x => x.schaden)).padStart(7));
