// Gemeinsame Helfer: Debug-Kopie einer Spielversion erzeugen (mit window.__g) und lokal ausliefern.
import fs from 'fs'; import path from 'path'; import http from 'http'; import os from 'os'; import { fileURLToPath } from 'url'; import { createRequire } from 'module';
export const here = path.dirname(fileURLToPath(import.meta.url)), skill = path.resolve(here, '..'), repo = path.resolve(skill, '../../..');
export const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i < 0 ? d : (process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : true); };
export const CHROME = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
export const defaultOut = () => path.resolve(arg('out', path.join(os.tmpdir(), 'omniforge-spieler')));
export function playwright(OUT) { try { return createRequire(path.join(OUT, 'x.js'))('playwright-core').chromium; } catch (e) { console.error('playwright-core fehlt — erst: bash ' + path.join(here, 'setup.sh') + ' ' + OUT); process.exit(2); } }
const names = ['player', 'pilot', 'mechs', 'rivals', 'bosses', 'camera', 'BASE', 'BASE_R', 'BASE_TOWER', 'TOWERS', 'save', 'W', 'worldKey', 'portals', 'ARENA', 'SPAWN', 'running', 'time', 'banner', 'feed', 'bullets', 'kills', 'deaths', 'schrott', 'tele',
  'update', 'keys', 'mouse', 'sticks', 'applyDamage', 'groundY', 'buyUpgrade', 'buyMech', 'ownsMech', 'switchMech', 'startTeleport', 'loadWorld', 'aggroBoss', 'captureTower', 'towerToggle', 'toggleFoot', 'curTarget', 'UPGRADES', 'MECHS', 'BOSSES', 'riverXf', 'pastRiver', 'effCam', 'playerActivate', 'bossFight', 'diff', 'slams', 'loot', 'NET', 'remotes'];
export function prepare(VER, OUT) {
  fs.mkdirSync(path.join(OUT, 'www', VER), { recursive: true }); fs.mkdirSync(path.join(OUT, 'bilder'), { recursive: true });
  const srcFile = path.join(repo, 'playable-prototype', VER, 'index.html'); let html = fs.readFileSync(srcFile, 'utf8');
  const marker = '\n  requestAnimationFrame(frame);\n';
  if (html.split(marker).length !== 2) { console.error('Hook-Stelle nicht eindeutig in ' + srcFile); process.exit(2); }
  const hook = '\n  window.__g={ ' + names.map(n => `get ${n}(){ try{ return ${n} }catch(e){ return undefined } }`).join(', ') + ', draw(){ renderer.render(scene,camera); drawHUD(); }, get camMode(){ return camMode }, set camMode(v){ camMode=v } };\n  requestAnimationFrame(frame);\n';
  fs.writeFileSync(path.join(OUT, 'www', VER, 'index.html'), html.replace(marker, () => hook));
}
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png' };
export async function serve(OUT) {
  const server = http.createServer((q, r) => { const f = path.join(OUT, 'www', decodeURIComponent(q.url.split('?')[0])); const ff = fs.existsSync(f) && fs.statSync(f).isDirectory() ? path.join(f, 'index.html') : f;
    fs.readFile(ff, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { 'Content-Type': mime[path.extname(ff)] || 'application/octet-stream' }); r.end(d); } }); });
  await new Promise(res => server.listen(0, '127.0.0.1', res)); return { server, port: server.address().port };
}
export const launchArgs = { executablePath: CHROME, headless: true, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] };
