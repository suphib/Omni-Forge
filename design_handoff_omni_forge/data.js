// data.js — Omni-Forge module catalog and default loadout
// Shared between Workshop and Battlefield views.

window.OF_DATA = (function () {
  const CATEGORIES = [
    { id: 'antrieb',   name: 'Antrieb',   code: 'PRP', icon: 'wheel' },
    { id: 'waffen',    name: 'Waffen',    code: 'WPN', icon: 'cannon' },
    { id: 'panzerung', name: 'Panzerung', code: 'ARM', icon: 'shield' },
    { id: 'spezial',   name: 'Spezial',   code: 'SPC', icon: 'drone' },
  ];

  // mass kg | power Δ | hp | rate (production/sec) | dmg
  const MODULES = [
    // Antrieb
    { id:'tx-mk4',  cat:'antrieb', name:'Kettenlauf TX-MK4',  code:'PRP-041', mass:1850, power:-280, hp:420, slot:'legs',   note:'Doppelketten · Allgelände', tier:'STD' },
    { id:'mech-7',  cat:'antrieb', name:'Servo-Bein MECH-7',  code:'PRP-072', mass:1420, power:-340, hp:380, slot:'legs',   note:'Hexapod · Klettertauglich', tier:'PRO' },
    { id:'rotor-2', cat:'antrieb', name:'Hover-Rotor R-II',   code:'PRP-118', mass: 980, power:-520, hp:240, slot:'legs',   note:'Antigrav · 4m Bodenfrei',   tier:'EXP' },

    // Waffen
    { id:'kn-88',   cat:'waffen',  name:'Kinetik-Kanone KN-88', code:'WPN-088', mass:740,  power:-180, hp:300, slot:'arm-l', note:'105mm · 4 Schuss/s', dmg:180, tier:'STD' },
    { id:'lcs-3',   cat:'waffen',  name:'Plasma-Klinge LCS-3',  code:'WPN-203', mass:320,  power:-410, hp:160, slot:'arm-r', note:'Reflektor · Nahkampf', dmg:340, tier:'PRO' },
    { id:'rkt-12',  cat:'waffen',  name:'Raketen-Pod RKT-12',   code:'WPN-126', mass:520,  power:-220, hp:180, slot:'shldr', note:'12 Schächte · Salve', dmg:90, tier:'STD' },
    { id:'core-x',  cat:'waffen',  name:'Selbstzerstörungskern', code:'WPN-999', mass:140,  power:-60,  hp:80,  slot:'core',  note:'⚠ Letzter Ausweg · 8.4 Mt', dmg:9999, tier:'EXP' },

    // Panzerung
    { id:'arm-a',   cat:'panzerung', name:'Composit-Platte CP-A', code:'ARM-014', mass:2200, power:0,   hp:1400, slot:'plate-c', note:'Frontalschutz · Ceram', tier:'STD' },
    { id:'arm-b',   cat:'panzerung', name:'Reaktive Hülle RH-9',  code:'ARM-029', mass:1640, power:-90, hp:1100, slot:'plate-s', note:'Sprengt eingehende Geschosse', tier:'PRO' },

    // Spezial
    { id:'hgr-6',   cat:'spezial',  name:'Drohnen-Hangar H-6',  code:'SPC-064', mass:1280, power:-260, hp:540, slot:'back',  note:'6 Schächte · 24s Schub-Zyklus', tier:'STD' },
    { id:'fab-2',   cat:'spezial',  name:'Mobile Fabrik F-II',  code:'SPC-119', mass:1820, power:-380, hp:680, slot:'back2', note:'Schmiedet Bots aus Schrott',  tier:'PRO' },
    { id:'rep-1',   cat:'spezial',  name:'Repair-Swarm R-S1',   code:'SPC-150', mass:380,  power:-140, hp:200, slot:'aux',   note:'Auto-Reparatur im Feld',     tier:'STD' },
  ];

  // Default loadout (the "Matroschka" hybrid)
  const DEFAULT_EQUIPPED = ['tx-mk4', 'kn-88', 'lcs-3', 'rkt-12', 'arm-a', 'hgr-6', 'rep-1'];

  const CHASSIS = {
    name: 'OMNI-FORGE T-7 «KLEIO»',
    designation: 'CHS-7041-MATR',
    role: 'Hybrid-Träger · Land/Luft',
    powerMax: 2400,
    massMax:  12000,
    armorMax: 5000,
  };

  // Drones in the hangar (for battlefield)
  const DRONES = [
    { id:'scout', name:'Späher SCT-1', code:'DRN-A', state:'ready',    eta:0 },
    { id:'rk-1',  name:'Sprenger RK-1', code:'DRN-B', state:'ready',    eta:0 },
    { id:'rk-2',  name:'Sprenger RK-2', code:'DRN-B', state:'ready',    eta:0 },
    { id:'med',   name:'Medic MD-9',    code:'DRN-C', state:'building', eta:18 },
    { id:'bot-1', name:'Boden-Bot BB-3',code:'DRN-D', state:'queued',   eta:46 },
    { id:'bot-2', name:'Boden-Bot BB-3',code:'DRN-D', state:'queued',   eta:74 },
  ];

  return { CATEGORIES, MODULES, DEFAULT_EQUIPPED, CHASSIS, DRONES };
})();
