// Spieler-Bot für Omni-Forge — läuft IM Spiel (nur in der Debug-Kopie, die play.mjs erzeugt; nie in ausgelieferten Dateien).
// Er bedient das Spiel wie ein Mensch: Tasten, Maus (Zielrichtung), Portale, Shop. Alle Stellschrauben stehen in strategie.json.
(() => {
const G = window.__g;
const DEF = { turnRate: 3.4, travelTurnRate: 4, fireCone: 0.3, fightRangeMul: 1.15, tooCloseMul: 0.5, strafeMin: 0.7, strafeMax: 2.0,
  rivalRange: 1700, bossRange: 2200, dodgeSlams: true, fightPlayers: true, playerRange: 2200, fightRivals: true, useShield: true, shieldAfterDmg: 25, retreatHpFrac: 0, towerRoute: false,
  shopOrder: ['armor', 'cooldown', 'ammo'], buyMechs: true, maxFightSecPerRival: 60 };
const B = window.__bot = { cfg: { ...DEF }, log: [], simT: 0, dmgTaken: 0, minHpFrac: 1, seen: new WeakSet(), timeline: [], t: { travel: 0, fight: 0, idle: 0 }, stuck: 0, shields: 0, tag: '' };
B.setCfg = (c) => { B.cfg = { ...DEF, ...(c || {}) }; };
const DT = 1 / 30;
const wrap = a => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const dist = (a, b) => Math.hypot(a.x - b.x, a.z - b.z);
let lastTxt = null, lastN = 0;
const push = (txt) => { if (txt === lastTxt) { lastN++; B.log[B.log.length - 1] = txt + '  (×' + (lastN + 1) + ')'; } else { lastTxt = txt; lastN = 0; B.log.push(txt); } };
const note = (s) => push('[' + String(Math.round(B.simT)).padStart(4) + 's ' + G.worldKey + '] ' + s);
B.note = note;
let prevHp = null, recent = 0, lastTl = -99;
function track() {
  const p = G.player, cur = p.hp + (p.shieldActive ? p.shield : 0);
  let lost = 0; if (prevHp != null && cur < prevHp) lost = prevHp - cur;
  B.dmgTaken += lost; recent = recent * 0.92 + lost; prevHp = cur; B.minHpFrac = Math.min(B.minHpFrac, p.hp / p.maxHp);
  for (const f of G.feed) if (!B.seen.has(f)) { B.seen.add(f); push('   · ' + f.text); }
  const bn = G.banner; if (bn && !B.seen.has(bn)) { B.seen.add(bn); push('   ▣ ' + bn.title + ' — ' + bn.sub); }
  if (B.simT - lastTl >= 5) { lastTl = B.simT; const b = G.bosses.find(x => x.alive); B.timeline.push({ t: Math.round(B.simT), w: G.worldKey, hp: Math.round(p.hp), boss: b ? Math.round(b.hp) : null }); }
}
B.step = () => { G.update(DT); B.simT += DT; track(); };
B.snap = () => { const p = G.player; return { w: G.worldKey, hp: Math.round(p.hp), max: p.maxHp, sh: Math.round(p.shield || 0), x: Math.round(p.x), z: Math.round(p.z), scrap: G.save.scrap, pp: G.save.pp, kills: G.kills, deaths: G.deaths, t: Math.round(B.simT) }; };
const clearKeys = () => { for (const k of ['w', 's', 'q', 'e', 'a', 'd']) G.keys.delete(k); };
B.idle = () => { clearKeys(); G.mouse.down = false; };
function steer(x, z, rate) { const p = G.player; const d = wrap(Math.atan2(z - p.z, x - p.x) - p.fpYaw); p.fpYaw += clamp(d, -rate * DT, rate * DT); return Math.abs(d); }
// Gegner, die gerade ernsthaft angreifen (aggressive Rivalen, wache Bosse)
function threats(range) {
  const p = G.player, out = [];
  for (const b of G.bosses) if (b.alive && !b.passive && dist(p, b) < B.cfg.bossRange) out.push(b);
  if (B.cfg.fightRivals) for (const r of G.rivals) if (r.alive && r.aggro && !r.inBase && dist(p, r) < (range || B.cfg.rivalRange)) out.push(r);
  if (B.cfg.fightPlayers) for (const m of G.mechs) if (m.isRemote && m.alive && m.here && !m.inBase && dist(p, m) < B.cfg.playerRange) out.push(m);   // andere Spieler (Mehrspieler)
  return out.sort((a, b) => dist(p, a) - dist(p, b));
}
let strafe = { dir: 1, t: 0 };
// Rote Boden-Markierung (Boss-Bodenschlag) → heraus laufen. Gibt true zurück, wenn ausgewichen wird.
function dodge() {
  const p = G.player, sl = G.slams || [];
  for (const s of sl) { if (s.t <= 0.05) continue; const d = Math.hypot(p.x - s.x, p.z - s.z); if (d > s.R + 140) continue;
    const ax = (p.x - s.x) / (d || 1), az = (p.z - s.z) / (d || 1), fx = Math.cos(p.fpYaw), fz = Math.sin(p.fpYaw);
    const fwd = ax * fx + az * fz, side = ax * -fz + az * fx;
    G.keys.delete('w'); G.keys.delete('s'); G.keys.delete('e'); G.keys.delete('q');
    if (Math.abs(fwd) > 0.2) G.keys.add(fwd > 0 ? 'w' : 's'); if (Math.abs(side) > 0.2) G.keys.add(side > 0 ? 'e' : 'q');
    B.dodges = (B.dodges || 0) + 1; return true; }
  return false; }
function fightStep(t) {
  const p = G.player, c = B.cfg; clearKeys();
  const err = steer(t.x, t.z, c.turnRate), d = dist(p, t), pref = (t.def && t.def.pref) || 650;
  if (d > pref * c.fightRangeMul) G.keys.add('w'); else if (d < pref * c.tooCloseMul) G.keys.add('s');
  strafe.t -= DT; if (strafe.t <= 0) { strafe.dir *= -1; strafe.t = c.strafeMin + Math.random() * (c.strafeMax - c.strafeMin); }
  G.keys.add(strafe.dir > 0 ? 'e' : 'q');
  G.mouse.down = err < c.fireCone && d < 1500;
  if (c.dodgeSlams) dodge();
  if (c.useShield && !p.shieldActive && p.shield > 100 && p.shieldBroken <= 0 && recent > c.shieldAfterDmg) { G.playerActivate('shield'); B.shields++; }
  B.t.fight += DT; B.step();
}
// Basis-Kuppel: Tor liegt bei +x. Wegpunkt liefern, damit der Bot nicht an der Wand klebt.
function waypoint(tx, tz) {
  const p = G.player, base = G.BASE; if (!base) return { x: tx, z: tz };
  const R = G.BASE_R || 2000, door = { x: base.x + R + 300, z: base.z };
  const pin = Math.hypot(p.x - base.x, p.z - base.z) < R + 120, tin = Math.hypot(tx - base.x, tz - base.z) < R + 60;
  if (pin && !tin && p.x < base.x + R + 100) return door;
  if (!pin && tin && (p.x < base.x + R + 100 || Math.abs(p.z - base.z) > 700)) return door;
  return { x: tx, z: tz };
}
let unstick = 0;
// ein Wanderschritt (kämpft unterwegs gegen Bedrohungen); true = angekommen
function travelStep(x, z, st) {
  if (st.w0 && G.worldKey !== st.w0 && !G.tele) return true;   // Welt gewechselt (Portal) → Ziel erreicht
  const p = G.player; if (!p.alive || G.tele) { B.idle(); B.t.idle += DT; B.step(); return false; }
  const th = st.ignore ? [] : threats();
  if (th.length) { fightStep(th[0]); st.fightT += DT; if (st.fightT > B.cfg.maxFightSecPerRival) { st.ignore = true; note('Kampf abgebrochen (zu lange)'); } return false; }
  if (dist(p, { x, z }) < st.stop) { B.idle(); return true; }
  const wp = waypoint(x, z);
  if (unstick > 0) { unstick -= DT; p.fpYaw += 2.2 * DT; } else steer(wp.x, wp.z, B.cfg.travelTurnRate);
  clearKeys(); G.keys.add('w'); G.mouse.down = false; B.t.travel += DT; B.step();
  if (st.lastPos == null || B.simT - st.lastPosT > 2.5) { if (st.lastPos && Math.hypot(p.x - st.lastPos.x, p.z - st.lastPos.z) < 120) { B.stuck++; unstick = 1.4; note('Bot steckt fest bei ' + Math.round(p.x) + '/' + Math.round(p.z)); } st.lastPos = { x: p.x, z: p.z }; st.lastPosT = B.simT; }
  return false;
}
B.travel = (x, z, opt = {}) => {
  const st = { stop: opt.stop || 260, fightT: 0, ignore: !!opt.ignore, lastPos: null, lastPosT: 0, w0: opt.leaveWorldEnds ? G.worldKey : null }, maxT = opt.maxT || 120, t0 = B.simT;
  while (B.simT - t0 < maxT) { if (travelStep(x, z, st)) return true; }
  B.idle(); return false;
};
// --- Ziel-Steuerung in kleinen Schritten (für Mehrspieler: mehrere Bots im Gleichschritt) ---
// goal: {k:'goto',x,z,stop} | {k:'portal',to} | {k:'hunt'} | {k:'hold'} | null
B.goal = null; let gst = null;
B.setGoal = (g) => { B.goal = g; gst = { stop: (g && g.stop) || 260, fightT: 0, ignore: false, lastPos: null, lastPosT: 0 }; };
B.tick = () => {
  const g = B.goal, p = G.player;
  if (!g) { B.idle(); B.step(); return 'idle'; }
  if (g.k === 'goto') return travelStep(g.x, g.z, gst) ? 'done' : 'busy';
  if (g.k === 'portal') { if (G.worldKey === g.to) { B.idle(); B.step(); return 'done'; } const pt = G.portals.filter(q => q.to === g.to).sort((a, b) => dist(p, a) - dist(p, b))[0]; if (!pt) { B.step(); return 'noportal'; } gst.stop = 120; travelStep(pt.x, pt.z, gst); return 'busy'; }
  if (g.k === 'hunt') { const rem = G.mechs.filter(m => m.isRemote && m.alive && m.here).sort((a, b) => dist(p, a) - dist(p, b))[0];
    if (!rem) { B.idle(); B.step(); return 'none'; } gst.ignore = false; travelStep(rem.x, rem.z, { ...gst, stop: 700 }); return 'busy'; }
  if (g.k === 'hold') { const th = threats(); if (th.length) fightStep(th[0]); else { B.idle(); B.step(); } return 'busy'; }
  B.step(); return 'idle';
};
B.run = (n) => { let st = 'idle'; for (let i = 0; i < n; i++) st = B.tick(); return B.status(st); };
B.status = (st) => { const p = G.player; return { st, w: G.worldKey, hp: Math.round(p.hp), max: p.maxHp, alive: p.alive, x: Math.round(p.x), z: Math.round(p.z), deaths: G.deaths, kills: G.kills, dmg: Math.round(B.dmgTaken), t: Math.round(B.simT),
  acts: G.NET ? G.NET.acts : 0, hits: G.NET ? G.NET.hitsShown : 0, pvp: G.NET ? (G.NET.pvpKills || 0) : 0, remotes: G.remotes ? [...G.remotes.values()].map(r => ({ name: r.name, world: r.state.world, here: !!(r.rep && r.rep.here), alive: r.rep ? r.rep.alive : null, d: r.rep && r.rep.here ? Math.round(dist(p, r.rep)) : null, dx: r.rep && r.rep.here ? Math.round(Math.hypot(r.rep.x - r.state.x, r.rep.z - r.state.z)) : null })) : [] }; };
B.waitTele = () => { let n = 0; while (G.tele && n++ < 300) B.step(); for (let i = 0; i < 20; i++) B.step(); };
// nächstes Portal (auch das Heimkehr-Portal nach dem Boss)
B.toPortal = (to) => { const p0 = G.player, pt = G.portals.filter(q => q.to === to).sort((a, b) => dist(p0, a) - dist(p0, b))[0]; if (!pt) { note('Kein Portal nach ' + to + ' in ' + G.worldKey); return false; }
  const w0 = G.worldKey, ok = B.travel(pt.x, pt.z, { stop: 120, maxT: 150, leaveWorldEnds: true }); B.waitTele(); if (G.worldKey === w0 && to !== w0) note('Portal ' + to + ' nicht erreicht'); return ok; };
B.toBase = () => { if (G.BASE) B.travel(G.BASE.x, G.BASE.z, { stop: 500, maxT: 120 }); };
// Boss-Kampf in Häppchen (maxT Spielsekunden) — kommt zurück, sobald gewonnen oder Zeit um
B.fightBoss = (maxT = 25) => {
  const t0 = B.simT, start = B.snap(); let lastDeaths = G.deaths;
  while (B.simT - t0 < maxT) {
    const bs = G.bosses.filter(b => b.alive); if (!bs.length) break;
    const p = G.player; if (!p.alive) { B.idle(); B.step(); continue; }
    if (G.deaths > lastDeaths) { lastDeaths = G.deaths; note('☠ gestorben'); }
    const b = bs.sort((a, c) => dist(p, a) - dist(p, c))[0], d = dist(p, b);
    if (d > 1500 && !G.bossFight()) { B.travel(b.x, b.z, { stop: 1300, maxT: 60 }); continue; }
    fightStep(b);
  }
  B.idle(); const end = B.snap(), alive = G.bosses.filter(b => b.alive);
  return { won: !alive.length, bossHp: alive.map(b => Math.round(b.hp) + '/' + b.maxHp).join(','), hp: end.hp, deaths: end.deaths - start.deaths };
};
B.shop = () => {
  const bought = [], c = B.cfg;
  for (let g = 0; g < 40; g++) {
    const opts = c.shopOrder.filter(k => G.UPGRADES[k] && G.save.upgrades[k] < G.UPGRADES[k].max && G.UPGRADES[k].cost(G.save.upgrades[k]) <= G.save.scrap);
    if (!opts.length) break;
    opts.sort((a, b) => G.UPGRADES[a].cost(G.save.upgrades[a]) - G.UPGRADES[b].cost(G.save.upgrades[b]));   // billigstes zuerst
    const k = opts[0]; const before = G.save.upgrades[k]; G.buyUpgrade(k); if (G.save.upgrades[k] === before) break; bought.push(k + (before + 1));
  }
  if (c.buyMechs) { const mk = Object.keys(G.MECHS).filter(k => G.MECHS[k].price && !G.ownsMech(k) && G.MECHS[k].price <= G.save.pp).sort((a, b) => G.MECHS[b].price - G.MECHS[a].price);
    if (mk.length) { const k = mk[0]; if (G.buyMech(k)) bought.push('MECH:' + k); } }
  return bought;
};
B.shot = () => { G.draw(); };
})();
