// js/board.js — stukjes maken, slepen, snappen, husselen, hint, win-detectie.

var Board = (function () {
  var KAN_PATH = typeof CSS !== 'undefined' && CSS.supports &&
    CSS.supports('clip-path', "path('M 0 0 H 1 V 1 Z')");
  var PREVIEW_RECT = { x: 30, y: 152, b: 240, h: 180 };

  var stukjes = [];        // {el, r, c, x, y, tx, ty, b, h, locked}
  var cel = null;          // {b, h, pad}
  var edges = null;
  var opties = null;
  var geteld = 0;
  var drag = null;         // {st, id, dx, dy}
  var topZ = 100;
  var hintActief = false;

  function klem(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function zet(st, x, y) {
    st.x = x;
    st.y = y;
    st.el.style.transform = 'translate(' + x + 'px,' + y + 'px)' +
      (st.el.classList.contains('dragging') ? ' scale(1.05)' : '');
  }

  function overlap(x, y, b, h, rect) {
    var dx = Math.min(x + b, rect.x + rect.b) - Math.max(x, rect.x);
    var dy = Math.min(y + h, rect.y + rect.h) - Math.max(y, rect.y);
    return (dx > 0 && dy > 0) ? dx * dy : 0;
  }

  // Willekeurige plek: binnen stage (12px marge), onder de HUD (y≥110),
  // niet over de voorbeeld-thumb, kader-overlap ≤ 60% van het stukje.
  function scatterPos(st) {
    var x = 12, y = 110;
    for (var poging = 0; poging < 40; poging++) {
      x = 12 + Math.random() * (STAGE.b - st.b - 24);
      y = 110 + Math.random() * (STAGE.h - st.h - 12 - 110);
      if (overlap(x, y, st.b, st.h, PREVIEW_RECT) > 0) continue;
      if (overlap(x, y, st.b, st.h, FRAME) > 0.6 * st.b * st.h) continue;
      break;
    }
    return { x: x, y: y };
  }

  // ── Slepen ──────────────────────────────────────────────────────────
  function onDown(e) {
    var st = this._st;
    if (st.locked || drag) return;
    try { st.el.setPointerCapture(e.pointerId); } catch (err) {}
    StageXY.refresh();
    drag = {
      st: st, id: e.pointerId,
      dx: StageXY.x(e.clientX) - st.x,
      dy: StageXY.y(e.clientY) - st.y
    };
    st.el.style.zIndex = (topZ = Math.min(topZ + 1, 8999));
    st.el.classList.add('dragging');
    zet(st, st.x, st.y);
    e.preventDefault();
  }

  function onMove(e) {
    if (!drag || e.pointerId !== drag.id || drag.st !== this._st) return;
    var st = drag.st;
    zet(st,
      klem(StageXY.x(e.clientX) - drag.dx, 0, STAGE.b - st.b),
      klem(StageXY.y(e.clientY) - drag.dy, 0, STAGE.h - st.h));
  }

  // pointerup ÉN pointercancel: zelfde pad (stukje blijft anders liggen).
  function onUp(e) {
    if (!drag || e.pointerId !== drag.id || drag.st !== this._st) return;
    var st = drag.st;
    drag = null;
    st.el.classList.remove('dragging');
    zet(st, st.x, st.y);
    var radius = 0.42 * Math.min(cel.b, cel.h);
    if (Math.hypot(st.x - st.tx, st.y - st.ty) <= radius) vergrendel(st);
  }

  function cancelDrag() {
    if (!drag) return;
    drag.st.el.classList.remove('dragging');
    zet(drag.st, drag.st.x, drag.st.y);
    drag = null;
  }

  // ── Snappen ─────────────────────────────────────────────────────────
  function vergrendel(st) {
    st.locked = true;
    st.el.classList.add('snap-anim');
    zet(st, st.tx, st.ty);
    st.el.classList.add('locked');
    st.el.style.zIndex = 1;
    setTimeout(function () { st.el.classList.remove('snap-anim'); }, 160);
    geteld++;
    Sounds.plop();
    Effects.setProgress(geteld / stukjes.length);
    if (Board.onSnap) Board.onSnap(geteld, stukjes.length);
    if (geteld === stukjes.length && Board.onWin) Board.onWin();
  }

  // ── Bouwen ──────────────────────────────────────────────────────────
  function clear() {
    cancelDrag();
    stukjes.forEach(function (st) { st.el.remove(); });
    stukjes.length = 0;
    geteld = 0;
    topZ = 100;
    hintActief = false;
    $('knop-hint').disabled = false;
    $('ghost').classList.add('hidden');
    $('doelglow').classList.add('hidden');
  }

  // opts: {url, natB, natH, cols, rows, hervat, savedEdges, savedPos}
  function build(opts) {
    clear();
    opties = opts;
    var cols = opts.cols, rows = opts.rows;
    var cb = FRAME.b / cols, ch = FRAME.h / rows;
    var pad = 0.25 * Math.min(cb, ch);
    cel = { b: cb, h: ch, pad: pad };
    edges = opts.savedEdges || Jigsaw.newEdges(cols, rows);

    // Cover-fit van de plaat in het kader.
    var sc = Math.max(FRAME.b / opts.natB, FRAME.h / opts.natH);
    var bgB = opts.natB * sc, bgH = opts.natH * sc;
    var offX = (bgB - FRAME.b) / 2, offY = (bgH - FRAME.h) / 2;

    $('ghost').style.backgroundImage = 'url("' + opts.url + '")';

    var stage = $('stage');
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var el = document.createElement('div');
        el.className = 'stukje';
        var st = {
          el: el, r: r, c: c, locked: false,
          b: cb + 2 * pad, h: ch + 2 * pad,
          tx: FRAME.x + c * cb - pad,
          ty: FRAME.y + r * ch - pad,
          x: 0, y: 0
        };
        el._st = st;
        el.style.width = st.b + 'px';
        el.style.height = st.h + 'px';
        el.style.backgroundImage = 'url("' + opts.url + '")';
        el.style.backgroundSize = bgB + 'px ' + bgH + 'px';
        el.style.backgroundPosition =
          -(c * cb - pad + offX) + 'px ' + -(r * ch - pad + offY) + 'px';
        if (KAN_PATH) {
          el.style.clipPath = "path('" + Jigsaw.piecePath(edges, r, c, cb, ch, pad) + "')";
        }
        el.style.zIndex = ++topZ;
        el.addEventListener('pointerdown', onDown);
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerup', onUp);
        el.addEventListener('pointercancel', onUp);
        stukjes.push(st);
        stage.appendChild(el);
      }
    }

    // Verspreiden (of herstellen bij hervatten — M5).
    var herstel = opts.savedPos || null;
    stukjes.forEach(function (st, i) {
      if (herstel && herstel.placed[i]) {
        zet(st, st.tx, st.ty);
        st.locked = true;
        st.el.classList.add('locked');
        st.el.style.zIndex = 1;
        geteld++;
      } else if (herstel) {
        zet(st, herstel.pos[i][0], herstel.pos[i][1]);
      } else {
        var p = scatterPos(st);
        zet(st, p.x, p.y);
      }
    });
    Effects.setProgress(geteld / stukjes.length);
    if (Board.onBuilt) Board.onBuilt();
  }

  // ── Husselen ────────────────────────────────────────────────────────
  function respread() {
    stukjes.forEach(function (st) {
      if (st.locked || (drag && drag.st === st)) return;
      var p = scatterPos(st);
      st.el.classList.add('respread');
      zet(st, p.x, p.y);
      setTimeout(function () { st.el.classList.remove('respread'); }, 350);
    });
    if (Board.onSnap) Board.onSnap(geteld, stukjes.length); // voor auto-save (M5)
  }

  // ── Hint: ghost 3s + doelvak van willekeurig los stukje licht op ────
  function hint() {
    if (hintActief || drag) return;
    var los = stukjes.filter(function (st) { return !st.locked; });
    if (!los.length) return;
    var st = los[Math.floor(Math.random() * los.length)];
    hintActief = true;
    $('knop-hint').disabled = true;
    Sounds.twinkel();
    $('ghost').classList.remove('hidden');
    var glow = $('doelglow');
    glow.style.left = FRAME.x + st.c * cel.b + 'px';
    glow.style.top = FRAME.y + st.r * cel.h + 'px';
    glow.style.width = cel.b + 'px';
    glow.style.height = cel.h + 'px';
    glow.classList.remove('hidden');
    st.el.classList.add('pulseert');
    setTimeout(function () {
      $('ghost').classList.add('hidden');
      glow.classList.add('hidden');
      st.el.classList.remove('pulseert');
      $('knop-hint').disabled = false;
      hintActief = false;
    }, 3000);
  }

  // Alles op één na oplossen (voor tests en de win-flow-check).
  function solveAllButOne() {
    var los = stukjes.filter(function (st) { return !st.locked; });
    los.slice(0, Math.max(0, los.length - 1)).forEach(function (st) { vergrendel(st); });
  }

  // ── Zelftest (M3+): synthetische drag van stukje 0 ──────────────────
  function zelftest(faal, slaag) {
    window.__FP.newGame(IMAGES[0].id, 12);
    var pogingen = 0;
    var timer = setInterval(function () {
      if (stukjes.length !== 12) {
        if (++pogingen > 40) { clearInterval(timer); faal('board niet gebouwd'); }
        return;
      }
      clearInterval(timer);
      try {
        var st = stukjes[0];
        var rect = $('stage').getBoundingClientRect();
        function cx(x) { return rect.left + x * rect.width / STAGE.b; }
        function cy(y) { return rect.top + y * rect.height / STAGE.h; }
        function ev(type, x, y) {
          st.el.dispatchEvent(new PointerEvent(type, {
            clientX: cx(x), clientY: cy(y), pointerId: 7,
            bubbles: true, cancelable: true
          }));
        }
        ev('pointerdown', st.x + st.b / 2, st.y + st.h / 2);
        ev('pointermove', st.tx + st.b / 2, st.ty + st.h / 2);
        ev('pointerup', st.tx + st.b / 2, st.ty + st.h / 2);
        if (!st.locked) return faal('stukje niet gelockt na drag');
        slaag('drag=locked clip=' + (!!st.el.style.clipPath) + ' (M3)');
      } catch (e) {
        faal(e.message);
      }
    }, 100);
  }

  return {
    pieces: stukjes,
    build: build,
    clear: clear,
    respread: respread,
    hint: hint,
    solveAllButOne: solveAllButOne,
    cancelDrag: cancelDrag,
    zelftest: zelftest,
    geteld: function () { return geteld; },
    edges: function () { return edges; },
    onSnap: null,
    onWin: null,
    onBuilt: null
  };
})();
