# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository status

No build system, no `package.json` — this is a **design handoff plus playable browser prototypes**, not the production implementation. The production game codebase starts from scratch in a stack chosen later.

Three top-level folders:
- `design_handoff_omni_forge/` — interactive HTML/JSX design prototypes (source of truth for UI/UX).
- `Kampfroboter/` — print-ready PDF dossiers plus separately bundled, self-contained HTML exports of the two mech units (Stier, Krampus). Duplicates the content of `stier-mech.jsx`/`krampus-mech.jsx` in a different export format. Read-only reference material, not meant to be edited.
- `playable-prototype/` — self-contained playable 3D duel prototype (Three.js ES module from CDN, no build step, open the `.html` directly). `index.html` is v1 (flat colored quadrant ground); `v2/index.html` adds heightmapped terrain with vertex colors, walkable paths (Catmull-Rom, with a stone ford over the river), island-with-ocean framing, richer procedural decor, sky/clouds, and real sun shadows. `v3/index.html` adds gameplay depth on top of v2: ammo with regen (fast in base), homing rocket volleys, a flight ability, visible melee blades (Stier double lightsaber per dossier, Krampus chainsaw), a rapid-fire Riesen-MG exclusive to player-controlled Krampus, bigger mechs, an intentional player advantage, and juice (camera shake, kill slow-mo, shockwave rings, procedural SFX). `v4/index.html` adds match structure on top of v3: win at 5 kills or after 3 min with a victory/defeat end screen (kills/deaths/damage/accuracy/scrap stats + rematch buttons), difficulty levels (Leicht/Mittel/Schwer via the `DIFFS` object that scales `aiCd`/`playerTake`/`playerDeal`/`aiShield` — so the v3 player-advantage constants now live there), a 3-2-1 countdown, procedural battle-music loop (`musicTick`) + victory fanfare, and a kill-cam camera zoom. `v5/index.html` reworks the mechs on top of v4: richer per-unit models closer to the dossiers (`buildModel` now splits into a root that faces heading + an `upper` group that aims at the enemy, with leg-swing walk cycle, spinning Krampus drill-legs, bone-spike crown, Stier suction cups), wrecks that topple and smoke until respawn, a loadout screen (card → loadout → fight) gating abilities via `player.equip`, and an optional companion drone (`buildDrone`/`updateDrone`/`fireDrone`, `drone:true` bullets excluded from accuracy). `v6/index.html` adds light progression on top of v5: a persistent scrap bank + upgrade shop (Werkstatt overlay, reachable from start & end screens) with 5-level upgrades for armor/cooldown/ammo, plus win/loss history per difficulty — all in `localStorage` (`save`, `SAVE_KEY`, `persist()`); upgrades apply to the player mech in `makeMech` via `playerMods()` (per-mech `amax`/`aregMul`/`cdMul`, so ammo/cooldown now read from the mech, not the shared def). Versioning convention: never edit a shipped version in place — copy to a new `vN/` folder instead (each version also carries its own `qr.svg` linking to its GitHub Pages URL). The world stays a 2D (x,z) simulation with terrain height applied visually via `terrainH(x,z)`. Live at `https://suphib.github.io/Omni-Forge/playable-prototype/vN/` (GitHub Pages, auto-deploys on push to `main`).

## What this repo actually is

Omni-Forge is a planned mobile PvP mech-battle game (App Store/Play Store). No production code exists yet. `design_handoff_omni_forge/README.md` is the authoritative brief — read it before implementation work; it defines the full screen list, design tokens, recommended tech stack (Unity/Godot + Nakama/Photon/Colyseus for server-authoritative netcode), and the suggested 9-step build order.

## Viewing/running the prototypes

No build step — open the relevant `.html` file directly in a browser. Each prototype loads React 18.3.1 UMD + ReactDOM UMD + `@babel/standalone` from a CDN and transpiles the `.jsx` files live in the browser. There is no npm/Vite/Webpack anywhere in this repo.

`<script>` order in the HTML files is load-bearing and must not be reordered: every `.jsx` file communicates only through `window` globals (`window.OF_DATA`, `window.Screen_Hub`, `window.MechBlueprint`, …), never ES module import/export — Babel Standalone transpiles each file independently, so later files depend on globals set by earlier ones.

## Architecture of the design prototypes

### Desktop reference (`index.html` → `app.jsx`)

Boot order: React/ReactDOM/Babel CDN → `data.js` (sets `window.OF_DATA`) → `tweaks-panel.jsx` → `mech.jsx` → `workshop.jsx` → `battlefield.jsx` → `app.jsx` (entry point, mounts via `ReactDOM.createRoot`).

```
App (app.jsx)
 ├─ ScalingStage — fixed 1920×1080 canvas, CSS transform:scale() to fit viewport (no responsive layout)
 │   └─ mode === 'werkstatt' ? WorkshopView : BattlefieldView
 └─ TweaksPanel — dev-only design-iteration overlay (postMessage bridge to an editor host), not app logic
```

- `WorkshopView` embeds `MechBlueprint` (`mech.jsx`), a hand-drawn SVG with hardcoded paths per module id (`has('kn-88')`-style conditionals) — a reference image, not a generic attachment-point data model.
- `BattlefieldView` is a self-contained HUD mockup driven by `setInterval` ticks; there is no real projectile/collision/damage logic.
- State is plain `useState` + props drilling, no Context/Redux. Central state lives in `App` (`equipped`, `sdTimer`, `mode`); `BattlefieldView`'s own combat state (`armor/power/ammo/cd/sdActive/feed`) is discarded on every mode switch because the component unmounts.
- Workshop live-stats (mass/energy/armor/DPS) are a `useMemo` that sums equipped modules — no physics. The "center of gravity / tip-over risk" warning (`workshop.jsx`, `cg = 0.4 ± ...`) is a cosmetic heuristic, not a real mass-distribution calculation — replace with real physics when porting.
- The self-destruct timer is split across two components and only loosely synced: the target value set in Workshop only takes effect in Battlefield while the timer isn't already active, and reaching zero has no explosion/game-over consequence — it's UI only.

### Mobile MVP (`mobile-app.html` → `mobile-app.jsx`, 11 screens)

Boot order: CSS → React/ReactDOM/Babel CDN → `data.js` → `design-canvas.jsx` → `mobile/shared.jsx` → `mobile/01-*.jsx` through `mobile/10-*.jsx` (numeric order) → `mobile-app.jsx` (mounts last).

`mobile-app.jsx` is **not an interactive app flow** — it renders all 11 screens simultaneously as static artboards inside `DesignCanvas`/`DCArtboard` (from `design-canvas.jsx`, shared with the desktop prototype), a pan/zoom presentation canvas. There is no router and no "current screen" state to model navigation on; the screen-to-screen flow described in the README's screen list is the spec for real navigation, not anything in this file.

Each screen file exports one `Screen_X` via `window.Screen_X = ...`, except `mobile/02-onboarding.jsx`, which defines two screens (`Screen_OnboardingWelcome`, `Screen_OnboardingTutorial`). `mobile/shared.jsx` provides the reusable chrome used across screens: `StatusBar`, `HomeBar`, `AppBar`, `TabBar` (visual only, no click handling), `CurrencyStrip`, `MechMiniSilhouette`, `Divider`, and a line-icon set (`IcHex`, `IcWrench`, `IcUser`, …).

Every screen is visual-only with zero interactivity — e.g. the match HUD's joystick (`mobile/06-match-hud.jsx`) is a styled `<div>` with no touch handlers, and weapon cooldowns render a fixed prop value rather than a real timer. Treat all 11 screens as pixel/behavior reference, not code to wire up — touch gestures, state, and networking need to be built from scratch on top of them.

## Design tokens

Defined in `styles.css` (`:root`) and `mobile-styles.css`; the full palette/spacing/type values are already documented in `design_handoff_omni_forge/README.md` — read that instead of re-deriving them from CSS. Per-mech color overrides (Stier: red/yellow, Krampus: bone/ember) live inside `stier-mech.jsx`/`krampus-mech.jsx` themselves, not the shared stylesheet.

## Data model reference

`data.js` (`window.OF_DATA`, IIFE) is mock data, not a schema: `CATEGORIES` (4 module categories), `MODULES` (12 equipment items with mass/power/hp/slot/tier), `DEFAULT_EQUIPPED`, `CHASSIS` (power/mass/armor caps), `DRONES`. Use it as a shape reference for the real backend data model, not as source data to ship.

## Mech unit dossiers

`stier-mech.jsx`/`stier-mech.html` (KMR-01 «Stier») and `krampus-mech.jsx`/`krampus-mech.html` (KMR-02 «Krampus») are standalone dossier pages, not wired into either app shell, documenting each unit's visual design and full ability list (see README for the systems breakdown per unit — these are balancing starting points, not final values). `Kampfroboter/` holds print-ready PDFs of the same two dossiers plus a separately bundled HTML export of each — read-only reference, don't edit.

## Suggested implementation order

See `design_handoff_omni_forge/README.md` → "Vorgeschlagene Bau-Reihenfolge" for the full 9-step plan (stack setup → meta UI → port workshop logic → first playable unit → matchmaking/netcode → combat HUD → progression → second unit → IAP/store submission).
