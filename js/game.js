// js/game.js — schermen, state, navigatie, opslag en testhook.

function $(id) { return document.getElementById(id); }

// localStorage-helper: app moet ook werken als storage stuk is (file://-randgevallen).
var Opslag = {
  get: function (k, d) {
    try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; }
  },
  set: function (k, v) {
    try { localStorage.setItem(k, v); } catch (e) {}
  },
  del: function (k) {
    try { localStorage.removeItem(k); } catch (e) {}
  },
  getJSON: function (k, d) {
    try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; }
  },
  setJSON: function (k, v) { Opslag.set(k, JSON.stringify(v)); }
};

var PRESETS = [
  { n: 6, cols: 3, rows: 2, label: 'Mini' },
  { n: 12, cols: 4, rows: 3, label: 'Makkelijk' },
  { n: 24, cols: 6, rows: 4, label: 'Normaal' },
  { n: 48, cols: 8, rows: 6, label: 'Moeilijk' },
  { n: 100, cols: 10, rows: 10, label: 'Reuze' }
];

var FRAME = { x: 320, y: 152, b: 960, h: 720 };
var STAGE = { b: 1600, h: 1000 };

var G = {
  naam: Opslag.get('fp_name', 'Freija'),
  imgId: IMAGES[0].id,
  n: 12,
  cat: IMAGES[0].cat,
  scherm: 'start'
};
(function () {
  var laatst = Opslag.getJSON('fp_last', null);
  if (laatst && IMAGES.byId(laatst.imgId) && laatst.imgId) {
    if (IMAGES.byId(laatst.imgId).id === laatst.imgId) {
      G.imgId = laatst.imgId;
      G.cat = IMAGES.byId(laatst.imgId).cat;
    }
    for (var i = 0; i < PRESETS.length; i++) if (PRESETS[i].n === laatst.n) G.n = laatst.n;
  }
})();

// ── Pointer → stage-coördinaten (vaste formule; rect cachen) ──────────
var StageXY = {
  rect: null,
  refresh: function () { StageXY.rect = $('stage').getBoundingClientRect(); },
  x: function (clientX) { return (clientX - StageXY.rect.left) * STAGE.b / StageXY.rect.width; },
  y: function (clientY) { return (clientY - StageXY.rect.top) * STAGE.h / StageXY.rect.height; }
};

// ── Schermen ──────────────────────────────────────────────────────────
function toonScherm(naam) {
  G.scherm = naam;
  $('scherm-start').classList.toggle('hidden', naam !== 'start');
  $('scherm-spel').classList.toggle('hidden', naam !== 'spel' && naam !== 'win');
  $('scherm-win').classList.toggle('hidden', naam !== 'win');
  if (naam === 'start') bouwStartscherm();
  pasSchaalAan();
}

// ── Stage-schaling + draai-hint ───────────────────────────────────────
function pasSchaalAan() {
  var s = Math.min(window.innerWidth / STAGE.b, window.innerHeight / STAGE.h);
  var st = $('stage');
  st.style.transform = 'scale(' + s + ')';
  st.style.left = (window.innerWidth - STAGE.b * s) / 2 + 'px';
  st.style.top = (window.innerHeight - STAGE.h * s) / 2 + 'px';
  StageXY.refresh();
  var portret = window.innerHeight > window.innerWidth;
  $('draaihint').classList.toggle('hidden', !(portret && (G.scherm === 'spel' || G.scherm === 'win')));
}
window.addEventListener('resize', function () {
  pasSchaalAan();
  if (Board.cancelDrag) Board.cancelDrag(); // resize tijdens slepen ⇒ drag annuleren
});

// ── Startscherm ───────────────────────────────────────────────────────
function bouwStartscherm() {
  $('titel-naam').textContent = G.naam;

  var save = Opslag.getJSON('fp_save', null);
  var saveOk = !!(save && save.img && IMAGES.byId(save.img).id === save.img &&
    save.edges && save.placed && save.pos);
  $('knop-verder').classList.toggle('hidden', !saveOk);

  var cats = $('cats');
  cats.innerHTML = '';
  CATS.forEach(function (cat) {
    var b = document.createElement('button');
    b.className = 'cat-knop' + (cat.id === G.cat ? ' gekozen' : '');
    b.textContent = cat.emoji + ' ' + cat.naam;
    b.onclick = function () {
      Sounds.klik();
      G.cat = cat.id;
      var eerste = IMAGES.filter(function (im) { return im.cat === cat.id; })[0];
      if (eerste) G.imgId = eerste.id;
      bouwStartscherm();
    };
    cats.appendChild(b);
  });

  var sterren = Opslag.getJSON('fp_stars', {});
  var thumbs = $('thumbs');
  thumbs.innerHTML = '';
  IMAGES.filter(function (im) { return im.cat === G.cat; }).forEach(function (im) {
    var b = document.createElement('button');
    b.className = 'thumb' + (im.id === G.imgId ? ' gekozen' : '');
    b.title = im.title;
    IMAGES.getURL(im, function (url) { b.style.backgroundImage = 'url("' + url + '")'; });
    var ster = document.createElement('div');
    ster.className = 'thumb-sterren';
    ster.textContent = '⭐'.repeat((sterren[im.id] || []).length);
    b.appendChild(ster);
    b.onclick = function () {
      Sounds.klik();
      G.imgId = im.id;
      bouwStartscherm();
    };
    thumbs.appendChild(b);
  });

  var moeilijk = $('moeilijkheid');
  moeilijk.innerHTML = '';
  PRESETS.forEach(function (p, i) {
    var b = document.createElement('button');
    b.className = 'moeilijk-knop' + (p.n === G.n ? ' gekozen' : '');
    b.innerHTML = '<span class="mk-n">' + p.n + '</span>' +
      '<span class="mk-sterren">' + '⭐'.repeat(i + 1) + '</span>' +
      '<span class="mk-label">' + p.label + '</span>';
    b.onclick = function () {
      Sounds.klik();
      G.n = p.n;
      bouwStartscherm();
    };
    moeilijk.appendChild(b);
  });
}

// Naam aanpassen via ✏️ (inline input).
$('knop-naam').addEventListener('click', function () {
  Sounds.klik();
  var span = $('titel-naam');
  var input = document.createElement('input');
  input.id = 'titel-invoer';
  input.value = G.naam;
  input.maxLength = 14;
  span.replaceWith(input);
  input.focus();
  input.select();
  function klaar() {
    var naam = input.value.trim() || 'Freija';
    G.naam = naam;
    Opslag.set('fp_name', naam);
    var nieuw = document.createElement('span');
    nieuw.id = 'titel-naam';
    nieuw.textContent = naam;
    input.replaceWith(nieuw);
  }
  input.addEventListener('blur', klaar);
  input.addEventListener('keydown', function (e) { if (e.key === 'Enter') input.blur(); });
});

// ── Spel starten ──────────────────────────────────────────────────────
function preset() {
  for (var i = 0; i < PRESETS.length; i++) if (PRESETS[i].n === G.n) return PRESETS[i];
  return PRESETS[1];
}

function startSpel(hervat) {
  var save = hervat === true ? Opslag.getJSON('fp_save', null) : null;
  if (save) {
    G.imgId = save.img;
    G.n = save.n;
    if (IMAGES.byId(G.imgId).cat) G.cat = IMAGES.byId(G.imgId).cat;
  }
  var im = IMAGES.byId(G.imgId);
  var p = preset();
  if (save && (!save.placed || save.placed.length !== p.cols * p.rows)) save = null;
  Opslag.setJSON('fp_last', { imgId: G.imgId, n: G.n });
  toonScherm('spel');

  var stage = $('stage');
  stage.className = 'n-' + p.n;
  var catMeta = CATS.filter(function (c) { return c.id === im.cat; })[0];
  $('walker').textContent = catMeta ? catMeta.emoji : '🦄';
  $('finish').classList.remove('feest');
  Effects.setProgress(0);
  $('laden').classList.remove('hidden');
  $('ghost').classList.add('hidden');
  $('doelglow').classList.add('hidden');

  IMAGES.getURL(im, function (url) {
    $('preview').style.backgroundImage = 'url("' + url + '")';
    $('preview-groot').innerHTML = '<div style="background-image:url(\'' + url + '\')"></div>';
    // Preload: naturalWidth/Height zijn nodig vóór de board-bouw.
    var foto = new Image();
    foto.onload = function () {
      $('laden').classList.add('hidden');
      Board.build({
        url: url,
        natB: foto.naturalWidth,
        natH: foto.naturalHeight,
        cols: p.cols,
        rows: p.rows,
        savedEdges: save ? save.edges : null,
        savedPos: save ? { placed: save.placed, pos: save.pos } : null
      });
    };
    foto.onerror = function () { $('laden').textContent = 'Oeps, plaatje laden lukt niet 😢'; };
    foto.src = url;
  });
}

// ── HUD-knoppen ───────────────────────────────────────────────────────
$('knop-spelen').addEventListener('click', function () { Sounds.klik(); startSpel(false); });
$('knop-verder').addEventListener('click', function () { Sounds.klik(); startSpel(true); });
$('knop-home').addEventListener('click', function () {
  Sounds.klik();
  Board.clear();
  toonScherm('start');
});
$('knop-hint').addEventListener('click', function () { Board.hint(); });
$('knop-hussel').addEventListener('click', function () { Sounds.klik(); Board.respread(); });
$('knop-geluid').addEventListener('click', function () {
  var uit = Sounds.toggleMuted();
  $('knop-geluid').textContent = uit ? '🔇' : '🔊';
  Sounds.klik();
});
$('preview').addEventListener('click', function () {
  Sounds.klik();
  $('preview-groot').classList.remove('hidden');
});
$('preview-groot').addEventListener('click', function () {
  $('preview-groot').classList.add('hidden');
});

// ── Board-koppelingen: aanmoedigingen, win-flow, sterren ──────────────
var WIN_TEKSTEN = ['Wat een puzzelkampioen! 🏆', 'Supergoed gedaan! 🌟', 'Jij kunt dit zó goed! 🦄',
  'Knap gepuzzeld! 🧩', 'Wauw, helemaal af! 🎈'];
var encGehad = {};

Board.onBuilt = function () {
  encGehad = {};
  // Bij hervatten: al gehaalde mijlpalen niet opnieuw vieren.
  var pct = Board.pieces.length ? Board.geteld() / Board.pieces.length : 0;
  if (pct >= 0.25) encGehad.enc25 = true;
  if (pct >= 0.5) encGehad.enc50 = true;
  if (pct >= 0.75) encGehad.enc75 = true;
};

// Auto-save van de lopende puzzel (incl. edge-maps, anders kloppen de
// vormen na hervatten niet).
function bewaarVoortgang() {
  if (!Board.pieces.length) return;
  var placed = Board.pieces.map(function (st) { return st.locked; });
  if (placed.every(Boolean)) { Opslag.del('fp_save'); return; }
  Opslag.setJSON('fp_save', {
    img: G.imgId,
    n: G.n,
    edges: Board.edges(),
    placed: placed,
    pos: Board.pieces.map(function (st) { return [Math.round(st.x), Math.round(st.y)]; }),
    ts: Date.now()
  });
}

Board.onSnap = function (geteld, totaal) {
  var pct = geteld / totaal;
  var mijlpalen = [
    [0.25, 'enc25', 'Goed zo, ', ' 🌟'],
    [0.5, 'enc50', 'Super, ', ' ✨'],
    [0.75, 'enc75', 'Bijna klaar, ', ' 💪']
  ];
  for (var i = 0; i < mijlpalen.length; i++) {
    var m = mijlpalen[i];
    if (pct >= m[0] && pct < 1 && !encGehad[m[1]]) {
      encGehad[m[1]] = true;
      window.__FP.events.push(m[1]);
      Effects.toast(m[2] + G.naam + '!' + m[3]);
      Sounds.twinkel();
    }
  }
  bewaarVoortgang();
};

Board.onWin = function () {
  G.scherm = 'win';
  window.__FP.events.push('win');
  Opslag.del('fp_save');
  var im = IMAGES.byId(G.imgId);

  // Ster verdienen (per plaat × moeilijkheid, gededupliceerd).
  var sterren = Opslag.getJSON('fp_stars', {});
  var lijst = sterren[im.id] || [];
  var nieuw = lijst.indexOf(G.n) === -1;
  if (nieuw) {
    lijst.push(G.n);
    lijst.sort(function (a, b) { return a - b; });
    sterren[im.id] = lijst;
    Opslag.setJSON('fp_stars', sterren);
  }

  $('win-titel').textContent = 'Hoera, ' + G.naam + '! 🎉';
  $('win-tekst').textContent = WIN_TEKSTEN[Math.floor(Math.random() * WIN_TEKSTEN.length)];
  IMAGES.getURL(im, function (url) { $('win-foto').src = url; });
  var bak = $('win-sterren');
  bak.innerHTML = '';
  lijst.forEach(function (n) {
    var s = document.createElement('span');
    s.textContent = '⭐';
    if (n === G.n && nieuw) s.className = 'nieuw';
    bak.appendChild(s);
  });

  // Eerst even de afgemaakte plaat "schoon" laten zien (kader-versiering
  // weg, witte lijst + gloed), dán pas de kaart met confetti.
  $('frame').classList.add('af');
  Sounds.tada();
  setTimeout(function () {
    if (G.scherm !== 'win') return; // intussen op huis gedrukt
    toonScherm('win');
    Effects.confetti();
  }, 1300);
};

$('knop-nogeens').addEventListener('click', function () {
  Sounds.klik();
  Effects.stopConfetti();
  startSpel(false); // zelfde plaat + aantal, nieuwe edge-map
});
$('knop-nieuw').addEventListener('click', function () {
  Sounds.klik();
  Effects.stopConfetti();
  Board.clear();
  toonScherm('start');
});

// ── iOS/touch-verharding + audio-unlock ───────────────────────────────
document.addEventListener('pointerdown', function () { Sounds.ensure(); }, true);
document.addEventListener('visibilitychange', function () { Sounds.ensure(); });
document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
document.addEventListener('dblclick', function (e) { e.preventDefault(); });
document.addEventListener('gesturestart', function (e) { e.preventDefault(); });

// ── Testhook ──────────────────────────────────────────────────────────
window.__FP = {
  state: function () { return G.scherm === 'win' ? 'won' : G.scherm; },
  grid: function () { var p = preset(); return { n: p.n, cols: p.cols, rows: p.rows }; },
  pieces: function () {
    return Board.pieces.map(function (st) {
      return { x: st.x, y: st.y, tx: st.tx, ty: st.ty, locked: st.locked };
    });
  },
  newGame: function (id, n) {
    if (id) G.imgId = id;
    if (n) G.n = n;
    startSpel(false);
  },
  solveAllButOne: function () { Board.solveAllButOne(); },
  audio: function () { return Sounds.debug(); },
  events: []
};

// ── Zelftest (?selftest=1) ────────────────────────────────────────────
function zelftest() {
  var uit = $('selftest');
  function faal(reden) { uit.innerHTML = '<span id="selftest-fail">FAIL: ' + reden + '</span>'; }
  function slaag(info) { uit.innerHTML = '<span id="selftest-pass">PASS ' + info + '</span>'; }
  try {
    var thumbs = document.querySelectorAll('.thumb').length;
    var verwacht = IMAGES.filter(function (im) { return im.cat === G.cat; }).length;
    var knoppen = document.querySelectorAll('.moeilijk-knop').length;
    if (thumbs !== verwacht) return faal('thumbs ' + thumbs + '≠' + verwacht);
    if (knoppen !== 5) return faal('moeilijkheidsknoppen ' + knoppen + '≠5');
    if (!Board.zelftest) return slaag('thumbs=' + thumbs + ' knoppen=' + knoppen + ' (M2)');
    Board.zelftest(faal, function (extra) {
      slaag('thumbs=' + thumbs + ' knoppen=' + knoppen + ' ' + extra);
    });
  } catch (e) {
    faal(e.message);
  }
}

// ── Start ─────────────────────────────────────────────────────────────
$('knop-geluid').textContent = Sounds.muted() ? '🔇' : '🔊';
toonScherm('start');
if (/[?&]selftest=1/.test(location.search)) {
  setTimeout(zelftest, 300);
}
