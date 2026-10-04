#!/usr/bin/env node
// Spieler: spielt Omni-Forge headless durch und schreibt einen Bericht.
// Aufruf: node play.mjs [--version v15] [--bosse wiese,berg,eis] [--out DIR] [--tag name] [--notiz "..."] [--keine-bilder]
import fs from 'fs'; import path from 'path';
import { here, skill, arg, defaultOut, playwright, prepare, serve, launchArgs } from './lib.mjs';
const VER = arg('version', 'v15'), BOSSE = String(arg('bosse', 'wiese,berg,eis')).split(','), TAG = arg('tag', 'lauf'), NOTIZ = arg('notiz', ''), SHOTS = !process.argv.includes('--keine-bilder');
const OUT = defaultOut(); const chromium = playwright(OUT);
prepare(VER, OUT); const { server, port } = await serve(OUT);

// 3) Browser
const strat = JSON.parse(fs.readFileSync(path.join(skill, 'strategie.json'), 'utf8'));
const browser = await chromium.launch(launchArgs);
const pg = await browser.newPage({ viewport: { width: 960, height: 540 } }); pg.setDefaultTimeout(0);
const errs = []; pg.on('console', m => { if (m.type() === 'error' && !/404|favicon/.test(m.text())) errs.push(m.text()); }); pg.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
await pg.goto(`http://127.0.0.1:${port}/${VER}/index.html`, { waitUntil: 'load' }); await pg.waitForTimeout(2000);
await pg.click('.card.stier'); await pg.waitForTimeout(400); await pg.click('#btnStart'); await pg.waitForTimeout(6000);
await pg.addScriptTag({ path: path.join(here, 'bot.js') });
const ev = (f, a) => pg.evaluate(f, a);
await ev(c => __bot.setCfg(c), strat.bot || {});
const snap = () => ev(() => __bot.snap());
const shot = async (n) => { if (!SHOTS) return; await ev(() => __bot.shot()); await pg.screenshot({ path: path.join(OUT, 'bilder', `${TAG}_${n}.png`) }); };
const R = { version: VER, tag: TAG, bosse: [], shop: [], start: await snap() };
const say = (...a) => console.log(...a);
say('START', JSON.stringify(R.start));
R.shop.push(await ev(() => __bot.shop())); say('Shop am Start:', JSON.stringify(R.shop[0]));

for (const key of BOSSE) {
  say('=== Boss', key);
  const t0 = (await snap()).t;
  if (key !== 'berg') { await ev(w => { __bot.note('→ Portal ' + w); __bot.toPortal(w); }, key); } else { await ev(() => __bot.note('→ Berg-Boss (Heimatwelt)')); }
  const arrive = await snap(); say('  angekommen', JSON.stringify(arrive)); await shot(key + '_0');
  let res, n = 0; const f0 = (await snap());
  for (; n < 16; n++) { res = await ev(() => __bot.fightBoss(25)); const s = await snap(); say('  Häppchen', n, JSON.stringify({ hp: s.hp, deaths: s.deaths, boss: res.bossHp, t: s.t })); if (n % 2 === 0 || res.won) await shot(key + '_k' + n); if (res.won) break; }
  const end = await snap();
  R.bosse.push({ key, won: !!res.won, bossRest: res.bossHp, reiseSek: f0.t - t0, kampfSek: end.t - f0.t, tode: end.deaths - arrive.deaths, todeInsg: end.deaths - R.start.deaths, hpEnde: end.hp, schrott: end.scrap - arrive.scrap, pp: end.pp - arrive.pp });
  if (!res.won) { say('  Boss nicht besiegt — Lauf endet'); break; }
  if (key !== BOSSE[BOSSE.length - 1]) { // zurück zur Basis, einkaufen
    await ev(() => { __bot.idle(); for (let i = 0; i < 30; i++) __bot.step(); });
    await ev(() => { __bot.toPortal('berg'); });   // Heimkehr-Portal (ab v16) oder normales Portal
    await ev(() => { __bot.toBase(); }); const b = await ev(() => __bot.shop()); R.shop.push(b); say('  Shop:', JSON.stringify(b), JSON.stringify(await snap()));
  }
}
const fin = await snap(); const info = await ev(() => ({ log: __bot.log, minHp: __bot.minHpFrac, dmg: Math.round(__bot.dmgTaken), stuck: __bot.stuck, shields: __bot.shields, dodges: __bot.dodges || 0, t: __bot.t, timeline: __bot.timeline }));
R.ende = fin; R.info = info; R.fehler = errs;
await browser.close(); server.close();

// 4) Bericht + Verlauf
const date = new Date().toISOString().slice(0, 10), repFile = path.join(skill, 'berichte', `${date}_${VER}_${TAG}.md`);
const ok = R.bosse.length === BOSSE.length && R.bosse.every(b => b.won), totT = fin.t, todeIns = fin.deaths;
const auff = []; const tot = info.t.travel + info.t.fight + info.t.idle || 1;
if (info.t.travel / tot > 0.5) auff.push(`Mehr als die Hälfte der Zeit (${Math.round(info.t.travel / tot * 100)} %) nur Laufen — Wege wirken lang.`);
if (info.stuck > 0) auff.push(`Bot blieb ${info.stuck}× hängen (Gelände/Wand/Prop?) — Spieler könnte das auch passieren.`);
if (todeIns >= 3) auff.push(`${todeIns} Tode — zu hart oder Bot zu dumm?`);
if (info.minHp <= 0.05) auff.push('Mindestens einmal fast/ganz tot (HP-Minimum ' + Math.round(info.minHp * 100) + ' %).');
for (const b of R.bosse) { if (!b.won) auff.push(`Boss ${b.key} nicht besiegt (Rest ${b.bossRest}).`); if (b.kampfSek > 150) auff.push(`Boss ${b.key}: Kampf dauert ${b.kampfSek} s — zäh.`); if (b.kampfSek < 12) auff.push(`Boss ${b.key}: nur ${b.kampfSek} s Kampf — zu leicht/zu kurz.`); }
if (errs.length) auff.push('Seitenfehler: ' + errs.slice(0, 3).join(' | '));
const md = `# Lauf ${date} · ${VER} · ${TAG}\n\n${NOTIZ ? 'Notiz: ' + NOTIZ + '\n\n' : ''}**Ergebnis:** ${ok ? 'alle ' + BOSSE.length + ' Bosse besiegt' : 'NICHT geschafft'} · ${totT} s Spielzeit · ${todeIns} Tode · Schrott ${fin.scrap} · PP ${fin.pp}\n\n` +
  `| Boss | Sieg | Reise s | Kampf s | Tode | HP Ende | +Schrott | +PP |\n|---|---|---|---|---|---|---|---|\n` + R.bosse.map(b => `| ${b.key} | ${b.won ? 'ja' : 'nein'} | ${b.reiseSek} | ${b.kampfSek} | ${b.tode} | ${b.hpEnde} | ${b.schrott} | ${b.pp} |`).join('\n') +
  `\n\nZeitanteile: Laufen ${Math.round(info.t.travel / tot * 100)} % · Kämpfen ${Math.round(info.t.fight / tot * 100)} % · Warten ${Math.round(info.t.idle / tot * 100)} %. Schaden gesamt ${info.dmg}, HP-Minimum ${Math.round(info.minHp * 100)} %, Schild ${info.shields}×, Ausweichschritte ${info.dodges}, festgesteckt ${info.stuck}×.\n` +
  `Einkäufe: ${R.shop.map(s => s.join(',') || '–').join(' | ')}\n\n## Auffälligkeiten (automatisch)\n${auff.length ? auff.map(a => '- ' + a).join('\n') : '- keine'}\n\n## Protokoll\n\`\`\`\n${info.log.slice(0, 160).join('\n')}\n\`\`\`\n`;
fs.writeFileSync(repFile, md);
const vf = path.join(skill, 'verlauf.md'); const row = `| ${date} | ${VER} | ${TAG} | ${ok ? 'ja' : 'nein'} | ${totT} | ${todeIns} | ${info.dmg} | ${fin.scrap} | ${fin.pp} | ${String(NOTIZ).replace(/\|/g, '/')} |\n`;
if (fs.existsSync(vf)) fs.appendFileSync(vf, row);
say('\nBERICHT', repFile); say(ok ? 'ALLE BOSSE BESIEGT' : 'NICHT GESCHAFFT', JSON.stringify(R.bosse)); say('AUFFÄLLIG', JSON.stringify(auff)); say('BILDER', path.join(OUT, 'bilder'));
