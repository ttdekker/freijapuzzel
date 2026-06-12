// js/images.js — manifest van puzzelplaten.
//
// Tijdens de bouw waren de fotosites geblokkeerd; daarom 9 getekende platen
// (type 'draw'). Echte foto's toevoegen kan altijd: zet het bestand in img/
// en voeg een entry toe met type:'photo' en file:'img/naam.jpg'.

var CATS = [
  { id: 'eenhoorn', naam: 'Eenhoorns', emoji: '\u{1F984}' },
  { id: 'bloem', naam: 'Bloemen', emoji: '\u{1F338}' },
  { id: 'dier', naam: 'Dieren', emoji: '\u{1F436}' }
];

var IMAGES = (function () {
  var TAU = Math.PI * 2;
  var EMOJI_FONT = '"Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",sans-serif';

  function grad(ctx, w, h, stops) {
    var g = ctx.createLinearGradient(0, 0, 0, h);
    for (var i = 0; i < stops.length; i++) g.addColorStop(i / (stops.length - 1), stops[i]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }
  function emoji(ctx, ch, x, y, size) {
    ctx.font = size + 'px ' + EMOJI_FONT;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ch, x, y);
  }
  function disc(ctx, x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
  }
  function blob(ctx, x, y, rx, ry, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, TAU);
    ctx.fill();
  }
  function cloud(ctx, x, y, s) {
    disc(ctx, x, y, s, '#ffffff');
    disc(ctx, x - s * 0.9, y + s * 0.25, s * 0.7, '#ffffff');
    disc(ctx, x + s * 0.9, y + s * 0.25, s * 0.75, '#ffffff');
  }
  function rainbow(ctx, x, y, r) {
    var colors = ['#e53e51', '#f49d37', '#f7d038', '#5bbd4e', '#3f88c5', '#7b4fa6'];
    for (var i = 0; i < colors.length; i++) {
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = 24;
      ctx.beginPath();
      ctx.arc(x, y, r - i * 24, Math.PI, TAU);
      ctx.stroke();
    }
  }
  // Deterministische "willekeur" zodat een plaat er altijd hetzelfde uitziet.
  function spread(n, fn) {
    for (var i = 0; i < n; i++) fn((i * 397 + 71) % 1200, (i * 233 + 37) % 900, i);
  }

  var list = [
    // ── Eenhoorns ──────────────────────────────────────────────────────
    {
      id: 'eenhoorn1', cat: 'eenhoorn', title: 'Eenhoorn op de regenboogwei', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#9fdcff', '#d7f4ff', '#eafbe0']);
        rainbow(ctx, 600, 590, 430);
        blob(ctx, 280, 950, 560, 230, '#8ed18a');
        blob(ctx, 950, 970, 620, 260, '#a4dd8f');
        cloud(ctx, 220, 150, 60);
        cloud(ctx, 870, 120, 50);
        emoji(ctx, '☀️', 1060, 140, 150);
        emoji(ctx, '\u{1F984}', 600, 600, 430);
        emoji(ctx, '✨', 960, 420, 95);
        emoji(ctx, '⭐', 185, 420, 85);
        emoji(ctx, '\u{1F338}', 300, 805, 75);
        emoji(ctx, '\u{1F33C}', 890, 825, 75);
      }
    },
    {
      id: 'eenhoorn2', cat: 'eenhoorn', title: 'Eenhoorn in de sterrennacht', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#231a5e', '#5b3fa8', '#9a6fd0']);
        spread(36, function (x, y, i) {
          if (y < 560) disc(ctx, x, y, 2.5 + (i % 3), 'rgba(255,255,255,0.9)');
        });
        blob(ctx, 600, 990, 760, 250, '#3a2f73');
        emoji(ctx, '\u{1F319}', 1010, 140, 145);
        emoji(ctx, '\u{1F3F0}', 250, 560, 270);
        emoji(ctx, '\u{1F984}', 700, 620, 400);
        emoji(ctx, '✨', 980, 460, 95);
        emoji(ctx, '✨', 430, 290, 80);
      }
    },
    {
      id: 'eenhoorn3', cat: 'eenhoorn', title: 'Eenhoornfeestje', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#ffd9ec', '#fff2cf']);
        var kleuren = ['#ff8fb6', '#ffd166', '#7bd1ff', '#9ef0a0', '#cba6ff'];
        spread(40, function (x, y, i) {
          disc(ctx, x, y, 9 + (i % 4) * 3, kleuren[i % kleuren.length]);
        });
        emoji(ctx, '\u{1F388}', 175, 270, 165);
        emoji(ctx, '\u{1F388}', 1025, 230, 150);
        emoji(ctx, '\u{1F9C1}', 235, 730, 155);
        emoji(ctx, '\u{1F381}', 985, 740, 150);
        emoji(ctx, '\u{1F380}', 600, 230, 120);
        emoji(ctx, '\u{1F984}', 600, 580, 400);
      }
    },
    // ── Bloemen ────────────────────────────────────────────────────────
    {
      id: 'bloem1', cat: 'bloem', title: 'Vrolijke bloementuin', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#aee4ff', '#e6fbda']);
        ctx.fillStyle = '#90d27e';
        ctx.fillRect(0, 620, w, 280);
        emoji(ctx, '☀️', 145, 140, 150);
        cloud(ctx, 560, 140, 55);
        cloud(ctx, 980, 180, 45);
        emoji(ctx, '\u{1F337}', 160, 700, 190);
        emoji(ctx, '\u{1F33B}', 390, 665, 215);
        emoji(ctx, '\u{1F33C}', 620, 700, 185);
        emoji(ctx, '\u{1F338}', 845, 675, 200);
        emoji(ctx, '\u{1F339}', 1065, 700, 185);
        emoji(ctx, '\u{1F98B}', 320, 380, 125);
        emoji(ctx, '\u{1F98B}', 900, 330, 135);
      }
    },
    {
      id: 'bloem2', cat: 'bloem', title: 'Grote zonnebloem', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#c9ecff', '#fdf6cd']);
        ctx.fillStyle = '#5fae4e';
        ctx.fillRect(578, 540, 44, 340);
        blob(ctx, 500, 700, 95, 42, '#6cbf58');
        blob(ctx, 705, 770, 95, 42, '#6cbf58');
        blob(ctx, 600, 970, 700, 160, '#8ed18a');
        emoji(ctx, '\u{1F33B}', 600, 420, 470);
        emoji(ctx, '\u{1F41D}', 350, 330, 115);
        emoji(ctx, '\u{1F41D}', 880, 545, 100);
        emoji(ctx, '\u{1F33C}', 170, 790, 135);
        emoji(ctx, '\u{1F33C}', 1035, 805, 120);
      }
    },
    {
      id: 'bloem3', cat: 'bloem', title: 'Tulpen en vlinders', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#ffe1f1', '#dff4ff']);
        ctx.fillStyle = '#9bd887';
        ctx.fillRect(0, 650, w, 250);
        cloud(ctx, 250, 150, 55);
        cloud(ctx, 760, 110, 48);
        cloud(ctx, 1060, 200, 42);
        emoji(ctx, '\u{1F337}', 150, 720, 205);
        emoji(ctx, '\u{1F337}', 380, 758, 235);
        emoji(ctx, '\u{1F337}', 610, 712, 215);
        emoji(ctx, '\u{1F337}', 845, 758, 240);
        emoji(ctx, '\u{1F337}', 1070, 720, 205);
        emoji(ctx, '\u{1F98B}', 260, 360, 135);
        emoji(ctx, '\u{1F98B}', 620, 300, 115);
        emoji(ctx, '\u{1F98B}', 960, 385, 145);
      }
    },
    // ── Dieren ─────────────────────────────────────────────────────────
    {
      id: 'dier1', cat: 'dier', title: 'Boerderijvriendjes', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#b5e6ff', '#e2f6c8']);
        ctx.fillStyle = '#a8d989';
        ctx.fillRect(0, 580, w, 320);
        // schuurtje
        ctx.fillStyle = '#d9534f';
        ctx.fillRect(830, 470, 250, 200);
        ctx.fillStyle = '#a33f3c';
        ctx.beginPath();
        ctx.moveTo(810, 480);
        ctx.lineTo(955, 360);
        ctx.lineTo(1100, 480);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#8a5a3b';
        ctx.fillRect(920, 560, 70, 110);
        emoji(ctx, '☀️', 140, 130, 140);
        cloud(ctx, 520, 150, 50);
        emoji(ctx, '\u{1F404}', 300, 700, 265);
        emoji(ctx, '\u{1F437}', 645, 740, 205);
        emoji(ctx, '\u{1F411}', 930, 760, 175);
        emoji(ctx, '\u{1F414}', 1110, 715, 125);
      }
    },
    {
      id: 'dier2', cat: 'dier', title: 'Lieve huisdieren', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#ffe8c7', '#ffdcec']);
        blob(ctx, 280, 620, 260, 200, 'rgba(255,255,255,0.45)');
        blob(ctx, 640, 640, 250, 195, 'rgba(255,255,255,0.45)');
        blob(ctx, 960, 620, 255, 200, 'rgba(255,255,255,0.45)');
        emoji(ctx, '\u{1F415}', 280, 580, 305);
        emoji(ctx, '\u{1F408}', 645, 600, 285);
        emoji(ctx, '\u{1F407}', 965, 580, 280);
        emoji(ctx, '⚽', 180, 810, 110);
        emoji(ctx, '\u{1F9B4}', 820, 830, 100);
        emoji(ctx, '\u{1F495}', 600, 220, 145);
      }
    },
    {
      id: 'dier3', cat: 'dier', title: 'Junglefeest', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#b9ecca', '#f8f3b5']);
        blob(ctx, 600, 960, 720, 180, '#7ec97a');
        emoji(ctx, '☀️', 600, 125, 130);
        emoji(ctx, '\u{1F334}', 160, 560, 330);
        emoji(ctx, '\u{1F334}', 1050, 545, 305);
        emoji(ctx, '\u{1F981}', 450, 650, 290);
        emoji(ctx, '\u{1F435}', 770, 580, 235);
        emoji(ctx, '\u{1F99C}', 955, 300, 160);
      }
    }
  ];

  // Geeft (asynchroon) de URL van een plaat: foto's direct, getekende platen
  // eenmalig naar een offscreen canvas renderen en als dataURL cachen.
  list.getURL = function (entry, cb) {
    if (entry.type === 'photo') { cb(entry.file); return; }
    if (entry._url) { cb(entry._url); return; }
    var c = document.createElement('canvas');
    c.width = 1200;
    c.height = 900;
    entry.draw(c.getContext('2d'), c.width, c.height);
    entry._url = c.toDataURL('image/png');
    cb(entry._url);
  };

  list.byId = function (id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return list[0];
  };

  return list;
})();
