#!/usr/bin/env node
// Spieler im Mehrspieler-Modus: zwei (bis vier) Bots in einem Raum. Szenario: erst getrennte Welten, dann treffen sie sich und kämpfen.
// Aufruf: node mehrspieler.mjs [--version v17] [--spieler 2] [--tag mp] [--notiz "..."] [--out DIR] [--keine-bilder]
import fs from 'fs'; import path from 'path';
import { here, skill, arg, defaultOut, playwright, prepare, serve, launchArgs } from './lib.mjs';
const VER = arg('version', 'v17'), N = Math.min(4, Math.max(2, +arg('spieler', 2))), TAG = arg('tag', 'mp'), NOTIZ = arg('notiz', ''), SHOTS = !process.argv.includes('--keine-bilder');
const OUT = defaultOut(); const chromium = playwright(OUT); prepare(VER, OUT); const { server, port } = await serve(OUT);
const strat = JSON.parse(fs.readFileSync(path.join(skill, 'strategie.json'), 'utf8'));
const NAMES = ['Anna', 'Ben', 'Cem', 'Dora'].slice(0, N), ROOM = 'BOT' + Math.floor(Math.random() * 900 + 100);
const browser = await chromium.launch(launchArgs); const errs = [];
const pages = []; const ctx = await browser.newContext({ viewport: { width: 960, height: 540 } });   // ein Kontext = gemeinsamer Browser-Kanal
for (const name of NAMES) {
  const pg = await ctx.newPage(); pg.setDefaultTimeout(0);
  pg.on('console', m => { if (m.type() === 'error' && !/404|favicon/.test(m.text())) errs.push(name + ': ' + m.text()); }); pg.on('pageerror', e => errs.push(name + ' PAGEERROR: ' + e.message));
  await pg.goto(`http://127.0.0.1:${port}/${VER}/index.html?room=${ROOM}&name=${name}&slot=${name}`, { waitUntil: 'load' }); pages.push(pg);
}
await pages[0].waitForTimeout(2000);
for (const pg of pages) { await pg.click('.card.stier'); await pg.waitForTimeout(300); await pg.click('#btnStart'); }
await pages[0].waitForTimeout(7000);
for (const pg of pages) { await pg.addScriptTag({ path: path.join(here, 'bot.js') }); await pg.evaluate(c => __bot.setCfg(c), strat.bot || {}); }
const log = []; const L = (...a) => { const t = a.join(' '); log.push(t); console.log(t); };
const run = async (n) => Promise.all(pages.map(pg => pg.evaluate(n => __bot.run(n), n)));
const goals = async (gs) => { await Promise.all(pages.map((pg, i) => pg.evaluate(g => __bot.setGoal(g), gs[i]))); };
const shot = async (tag) => { if (!SHOTS) return; for (let i = 0; i < pages.length; i++) { await pages[i].evaluate(() => __bot.shot()); await pages[i].screenshot({ path: path.join(OUT, 'bilder', `${TAG}_${tag}_${NAMES[i]}.png`) }); } };
const fmt = (st) => st.map((s, i) => `${NAMES[i]}:${s.w}${s.alive ? '' : '☠'} hp${s.hp} (${s.x}|${s.z}) sieht ${s.remotes.map(r => r.name + (r.here ? '@' + r.d : '(' + r.world + ')')).join(',') || '–'}`).join('  ·  ');

// Phase A: getrennte Welten — Anna geht nach Wiese, die anderen bleiben im Berg
L('=== Phase A: getrennte Welten');
await Promise.all(pages.map(pg => pg.evaluate(() => { __bot.cfg.fightPlayers = false; })));   // erst nur laufen, nicht kämpfen
await run(30); L('Start', fmt(await run(1)));
await goals(NAMES.map((n, i) => i === 0 ? { k: 'portal', to: 'wiese' } : { k: 'hold' }));
let st; for (let i = 0; i < 60; i++) st = await run(10); L('nach 20 s', fmt(st));
const sep = { annaSiehtAndereNichtHier: st[0].remotes.every(r => !r.here), andereSehenAnnaNichtHier: st.slice(1).every(s => s.remotes.every(r => r.name !== 'Anna' || !r.here)), annaInWiese: st[0].w === 'wiese', anderePräsent: st[0].remotes.length === N - 1 };
L('Trennung korrekt:', JSON.stringify(sep));

// Phase B: alle in die Wiese, dann jagen sie sich
L('=== Phase B: Treffen und Kampf');
await Promise.all(pages.map(pg => pg.evaluate(() => { __bot.cfg.fightPlayers = true; })));
await goals(NAMES.map((n, i) => i === 0 ? { k: 'hunt' } : { k: 'portal', to: 'wiese' }));
let meetT = null, simT = 0, errMax = 0, errSum = 0, errN = 0, first = null, shots = 0; const hist = [];
for (let i = 0; i < 240 && simT < 100; i++) {
  st = await run(10); simT += 10 / 30;
  const here = st.every(s => s.w === 'wiese');
  if (here && meetT == null) { meetT = simT; L('alle in Wiese nach', simT.toFixed(1), 's', fmt(st)); await goals(NAMES.map(() => ({ k: 'hunt' }))); await shot('treffen'); }
  if (here) { // Abbild-Genauigkeit: Abstand laut Abbild gegen echten Abstand
    for (let a = 0; a < N; a++) for (const r of st[a].remotes) { const b = NAMES.indexOf(r.name); if (b < 0 || !r.here) continue; const real = Math.hypot(st[a].x - st[b].x, st[a].z - st[b].z); const e = Math.abs(real - r.d); errMax = Math.max(errMax, e); errSum += e; errN++; } }
  if (first == null && st.some(s => s.hits > 0)) { first = simT; L('erster Treffer auf ein Abbild nach', simT.toFixed(1), 's'); await shot('kampf'); }
  if (st.some(s => s.pvp > 0) && shots === 0) { shots = 1; L('PvP-Kill:', fmt(st)); await shot('kill'); }
  hist.push(st.map(s => s.hp));
  if (st.reduce((a, s) => a + s.pvp, 0) >= 2) break;
}
st = await run(1); L('Ende', fmt(st));
const res = { raum: ROOM, spieler: NAMES, getrennt: sep, treffenNachS: meetT && +meetT.toFixed(1), ersterTreffer: first && +first.toFixed(1), kills: st.map(s => s.pvp), tode: st.map(s => s.deaths), schadenErhalten: st.map(s => s.dmg), nachrichtenWaffen: st.map(s => s.acts), anzeigeTreffer: st.map(s => s.hits), abbildFehlerMittel: errN ? Math.round(errSum / errN) : null, abbildFehlerMax: Math.round(errMax), fehler: errs };
await browser.close(); server.close();
const date = new Date().toISOString().slice(0, 10), repFile = path.join(skill, 'berichte', `${date}_${VER}_${TAG}.md`);
const auff = []; if (!Object.values(sep).every(Boolean)) auff.push('Trennung der Welten stimmt nicht: ' + JSON.stringify(sep));
if (meetT == null) auff.push('Die Bots haben sich nie in derselben Welt getroffen.'); if (first == null) auff.push('Kein einziger Treffer auf einen anderen Spieler — Zielen/Replikation prüfen.');
if (res.abbildFehlerMittel != null && res.abbildFehlerMittel > 150) auff.push('Abbilder hängen deutlich hinterher (mittl. Abstandsfehler ' + res.abbildFehlerMittel + ').'); if (errs.length) auff.push('Seitenfehler: ' + errs.slice(0, 3).join(' | '));
fs.writeFileSync(repFile, `# Mehrspieler-Lauf ${date} · ${VER} · ${TAG}\n\n${NOTIZ ? 'Notiz: ' + NOTIZ + '\n\n' : ''}**${N} Spieler** (${NAMES.join(', ')}) im Raum ${ROOM}.\n\n\`\`\`json\n${JSON.stringify(res, null, 1)}\n\`\`\`\n\n## Auffälligkeiten (automatisch)\n${auff.length ? auff.map(a => '- ' + a).join('\n') : '- keine'}\n\n## Protokoll\n\`\`\`\n${log.join('\n')}\n\`\`\`\n`);
L('\nBERICHT', repFile); L('ERGEBNIS', JSON.stringify(res)); L('AUFFÄLLIG', JSON.stringify(auff));
