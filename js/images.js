// js/images.js — manifest van puzzelplaten.
//
// De platen worden door de app zelf getekend (type 'draw'): emoji-figuren op
// rijk gelaagde canvas-achtergronden. Echte foto's toevoegen kan altijd: zet
// het bestand in img/ en voeg een entry toe met type:'photo' en file:'…'.

var CATS = [
  { id: 'eenhoorn', naam: 'Eenhoorns', emoji: '\u{1F984}' },
  { id: 'bloem', naam: 'Bloemen', emoji: '\u{1F338}' },
  { id: 'dier', naam: 'Dieren', emoji: '\u{1F436}' },
  { id: 'zee', naam: 'Zee', emoji: '\u{1F420}' }
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
  // Figuur mét zachte slagschaduw eronder: geeft de scène diepte.
  function figuur(ctx, ch, x, y, size) {
    blob(ctx, x, y + size * 0.42, size * 0.36, size * 0.07, 'rgba(40,30,70,0.16)');
    emoji(ctx, ch, x, y, size);
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
  // Zachte gloed (zon, maanlicht, toverlicht).
  function gloed(ctx, x, y, r, kleur) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, kleur);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
  }
  function zon(ctx, x, y, size) {
    gloed(ctx, x, y, size * 1.6, 'rgba(255,236,150,0.85)');
    emoji(ctx, '☀️', x, y, size);
  }
  function cloud(ctx, x, y, s) {
    disc(ctx, x, y, s, '#ffffff');
    disc(ctx, x - s * 0.9, y + s * 0.25, s * 0.7, '#ffffff');
    disc(ctx, x + s * 0.9, y + s * 0.25, s * 0.75, '#ffffff');
  }
  // Gelaagde heuvels: van achter (licht) naar voor (donkerder) = diepte.
  function heuvels(ctx, w, h, lagen) {
    for (var i = 0; i < lagen.length; i++) {
      var l = lagen[i]; // [middenX, topY, kleur]
      blob(ctx, l[0], h + 320, w * 0.75, h + 320 - l[1], l[2]);
    }
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
  // Heel subtiel vignet: trekt de blik naar het midden, oogt "af".
  function vignet(ctx, w, h) {
    var g = ctx.createRadialGradient(w / 2, h / 2, h * 0.45, w / 2, h / 2, h * 0.95);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, 'rgba(60,40,100,0.13)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
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
        grad(ctx, w, h, ['#8fd4ff', '#d7f4ff', '#eafbe0']);
        zon(ctx, 1060, 130, 140);
        rainbow(ctx, 600, 590, 430);
        heuvels(ctx, w, h, [[150, 700, '#a9e09b'], [1000, 730, '#8ed18a'], [550, 800, '#79c277']]);
        cloud(ctx, 220, 150, 60);
        cloud(ctx, 660, 110, 44);
        figuur(ctx, '\u{1F984}', 600, 580, 430);
        emoji(ctx, '✨', 950, 400, 95);
        emoji(ctx, '⭐', 185, 400, 85);
        emoji(ctx, '\u{1F338}', 250, 790, 80);
        emoji(ctx, '\u{1F33C}', 920, 815, 75);
        emoji(ctx, '\u{1F344}', 1090, 760, 65);
        emoji(ctx, '\u{1F98B}', 330, 540, 75);
        vignet(ctx, w, h);
      }
    },
    {
      id: 'eenhoorn2', cat: 'eenhoorn', title: 'Eenhoorn in de sterrennacht', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#1c1450', '#4b3399', '#9a6fd0']);
        spread(44, function (x, y, i) {
          if (y < 560) disc(ctx, x, y, 2 + (i % 3), 'rgba(255,255,255,' + (0.5 + (i % 5) * 0.1) + ')');
        });
        gloed(ctx, 1010, 140, 260, 'rgba(255,250,210,0.45)');
        blob(ctx, 250, 1000, 700, 330, '#332a68');
        blob(ctx, 950, 1010, 720, 300, '#3a2f73');
        emoji(ctx, '\u{1F319}', 1010, 140, 145);
        emoji(ctx, '\u{1F3F0}', 245, 545, 270);
        gloed(ctx, 700, 600, 330, 'rgba(203,166,255,0.35)');
        figuur(ctx, '\u{1F984}', 700, 600, 400);
        emoji(ctx, '✨', 980, 440, 95);
        emoji(ctx, '✨', 430, 280, 80);
        emoji(ctx, '\u{1F31F}', 555, 170, 90);
        vignet(ctx, w, h);
      }
    },
    {
      id: 'eenhoorn3', cat: 'eenhoorn', title: 'Eenhoornfeestje', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#ffd9ec', '#fff2cf', '#ffe9f4']);
        var kleuren = ['#ff8fb6', '#ffd166', '#7bd1ff', '#9ef0a0', '#cba6ff'];
        spread(46, function (x, y, i) {
          ctx.globalAlpha = 0.85;
          disc(ctx, x, y, 8 + (i % 4) * 3, kleuren[i % kleuren.length]);
          ctx.globalAlpha = 1;
        });
        // Slinger met vlaggetjes langs de bovenrand.
        ctx.strokeStyle = '#b48ae0'; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(0, 70); ctx.quadraticCurveTo(600, 200, 1200, 70); ctx.stroke();
        for (var i = 0; i < 9; i++) {
          var t = (i + 0.5) / 9, vx = 1200 * t;
          var vy = 70 + (200 - 70) * 4 * t * (1 - t) * 0.97;
          ctx.fillStyle = kleuren[i % kleuren.length];
          ctx.beginPath(); ctx.moveTo(vx - 26, vy); ctx.lineTo(vx + 26, vy); ctx.lineTo(vx, vy + 46); ctx.closePath(); ctx.fill();
        }
        emoji(ctx, '\u{1F388}', 165, 320, 165);
        emoji(ctx, '\u{1F388}', 1035, 290, 150);
        figuur(ctx, '\u{1F9C1}', 235, 740, 155);
        figuur(ctx, '\u{1F381}', 985, 745, 150);
        gloed(ctx, 600, 580, 320, 'rgba(255,255,255,0.5)');
        figuur(ctx, '\u{1F984}', 600, 580, 400);
        vignet(ctx, w, h);
      }
    },
    // ── Bloemen ────────────────────────────────────────────────────────
    {
      id: 'bloem1', cat: 'bloem', title: 'Vrolijke bloementuin', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#9edcff', '#dff6ff', '#e6fbda']);
        zon(ctx, 145, 135, 145);
        cloud(ctx, 560, 140, 55);
        cloud(ctx, 980, 180, 45);
        heuvels(ctx, w, h, [[300, 610, '#a8de8f'], [950, 640, '#90d27e']]);
        emoji(ctx, '\u{1F337}', 160, 700, 190);
        emoji(ctx, '\u{1F33B}', 390, 660, 215);
        emoji(ctx, '\u{1F33C}', 620, 700, 185);
        emoji(ctx, '\u{1F338}', 845, 670, 200);
        emoji(ctx, '\u{1F339}', 1065, 700, 185);
        emoji(ctx, '\u{1F41E}', 530, 840, 70);
        emoji(ctx, '\u{1F98B}', 320, 380, 125);
        emoji(ctx, '\u{1F98B}', 900, 330, 135);
        emoji(ctx, '\u{1F41D}', 640, 470, 90);
        vignet(ctx, w, h);
      }
    },
    {
      id: 'bloem2', cat: 'bloem', title: 'Grote zonnebloem', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#b3e4ff', '#e9f7ff', '#fdf6cd']);
        gloed(ctx, 600, 400, 460, 'rgba(255,244,170,0.6)');
        ctx.fillStyle = '#5fae4e';
        ctx.fillRect(578, 540, 44, 340);
        blob(ctx, 500, 700, 95, 42, '#6cbf58');
        blob(ctx, 705, 770, 95, 42, '#6cbf58');
        heuvels(ctx, w, h, [[250, 800, '#9bd887'], [950, 830, '#8ed18a']]);
        emoji(ctx, '\u{1F33B}', 600, 420, 470);
        emoji(ctx, '\u{1F41D}', 350, 330, 115);
        emoji(ctx, '\u{1F41D}', 880, 545, 100);
        emoji(ctx, '\u{1F33C}', 170, 790, 135);
        emoji(ctx, '\u{1F33C}', 1035, 805, 120);
        emoji(ctx, '\u{1F40C}', 870, 845, 85);
        cloud(ctx, 220, 140, 50);
        cloud(ctx, 1000, 120, 42);
        vignet(ctx, w, h);
      }
    },
    {
      id: 'bloem3', cat: 'bloem', title: 'Tulpen en vlinders', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#ffd9ee', '#ffeef7', '#dff4ff']);
        gloed(ctx, 600, 200, 420, 'rgba(255,255,255,0.7)');
        cloud(ctx, 250, 150, 55);
        cloud(ctx, 760, 110, 48);
        cloud(ctx, 1060, 200, 42);
        heuvels(ctx, w, h, [[260, 640, '#a8e093'], [930, 670, '#9bd887']]);
        emoji(ctx, '\u{1F337}', 150, 720, 205);
        emoji(ctx, '\u{1F337}', 380, 755, 235);
        emoji(ctx, '\u{1F337}', 610, 710, 215);
        emoji(ctx, '\u{1F337}', 845, 755, 240);
        emoji(ctx, '\u{1F337}', 1070, 720, 205);
        emoji(ctx, '\u{1F98B}', 260, 360, 135);
        emoji(ctx, '\u{1F98B}', 620, 300, 115);
        emoji(ctx, '\u{1F98B}', 960, 385, 145);
        emoji(ctx, '\u{1F31E}', 1080, 120, 110);
        vignet(ctx, w, h);
      }
    },
    // ── Dieren ─────────────────────────────────────────────────────────
    {
      id: 'dier1', cat: 'dier', title: 'Boerderijvriendjes', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#a5e0ff', '#dff3ff', '#e2f6c8']);
        zon(ctx, 140, 125, 135);
        cloud(ctx, 520, 150, 50);
        cloud(ctx, 1080, 130, 40);
        heuvels(ctx, w, h, [[250, 560, '#b6e098'], [950, 590, '#a8d989']]);
        // schuurtje met raam
        ctx.fillStyle = '#d9534f';
        ctx.fillRect(830, 470, 250, 200);
        ctx.fillStyle = '#a33f3c';
        ctx.beginPath();
        ctx.moveTo(810, 480); ctx.lineTo(955, 360); ctx.lineTo(1100, 480);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#8a5a3b';
        ctx.fillRect(920, 560, 70, 110);
        ctx.fillStyle = '#fff2cf';
        disc(ctx, 955, 510, 26, '#fff2cf');
        // hekje
        ctx.fillStyle = '#b08050';
        for (var i = 0; i < 5; i++) ctx.fillRect(40 + i * 52, 600, 14, 80);
        ctx.fillRect(30, 620, 250, 12);
        figuur(ctx, '\u{1F404}', 300, 700, 265);
        figuur(ctx, '\u{1F437}', 645, 740, 205);
        figuur(ctx, '\u{1F411}', 930, 760, 175);
        figuur(ctx, '\u{1F414}', 1110, 715, 125);
        emoji(ctx, '\u{1F426}', 700, 300, 80);
        vignet(ctx, w, h);
      }
    },
    {
      id: 'dier2', cat: 'dier', title: 'Lieve huisdieren', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#ffe8c7', '#fff3e0', '#ffdcec']);
        gloed(ctx, 600, 240, 380, 'rgba(255,255,255,0.7)');
        blob(ctx, 280, 620, 260, 200, 'rgba(255,255,255,0.5)');
        blob(ctx, 640, 640, 250, 195, 'rgba(255,255,255,0.5)');
        blob(ctx, 960, 620, 255, 200, 'rgba(255,255,255,0.5)');
        figuur(ctx, '\u{1F415}', 280, 580, 305);
        figuur(ctx, '\u{1F408}', 645, 600, 285);
        figuur(ctx, '\u{1F407}', 965, 580, 280);
        emoji(ctx, '⚽', 180, 815, 110);
        emoji(ctx, '\u{1F9B4}', 820, 835, 100);
        emoji(ctx, '\u{1F955}', 1110, 830, 90);
        emoji(ctx, '\u{1F495}', 600, 200, 145);
        emoji(ctx, '\u{1F49B}', 220, 290, 80);
        emoji(ctx, '\u{1F49A}', 990, 270, 80);
        vignet(ctx, w, h);
      }
    },
    {
      id: 'dier3', cat: 'dier', title: 'Junglefeest', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#a4e3c4', '#d9f2b8', '#f8f3b5']);
        zon(ctx, 600, 120, 125);
        heuvels(ctx, w, h, [[250, 760, '#8fd486'], [950, 790, '#7ec97a']]);
        emoji(ctx, '\u{1F334}', 160, 545, 330);
        emoji(ctx, '\u{1F334}', 1050, 530, 305);
        figuur(ctx, '\u{1F981}', 450, 645, 290);
        figuur(ctx, '\u{1F435}', 770, 585, 235);
        emoji(ctx, '\u{1F99C}', 955, 295, 160);
        emoji(ctx, '\u{1F98E}', 950, 800, 95);
        emoji(ctx, '\u{1F33A}', 90, 800, 90);
        vignet(ctx, w, h);
      }
    },
    // ── Zee ────────────────────────────────────────────────────────────
    {
      id: 'zee1', cat: 'zee', title: 'Onder de zee', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#5dc9e8', '#3f9fd4', '#2a6fb0']);
        // lichtstralen van boven
        ctx.globalAlpha = 0.18;
        for (var i = 0; i < 4; i++) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.moveTo(180 + i * 280, -20);
          ctx.lineTo(330 + i * 280, -20);
          ctx.lineTo(260 + i * 280, 620);
          ctx.lineTo(140 + i * 280, 620);
          ctx.closePath(); ctx.fill();
        }
        ctx.globalAlpha = 1;
        // zandbodem + wier
        blob(ctx, 600, 980, 760, 200, '#e8cf96');
        ctx.strokeStyle = '#3e8f5a'; ctx.lineWidth = 16; ctx.lineCap = 'round';
        for (var s = 0; s < 4; s++) {
          var bx = 90 + s * 340;
          ctx.beginPath(); ctx.moveTo(bx, 880);
          ctx.quadraticCurveTo(bx - 40, 760, bx + 10, 660);
          ctx.stroke();
        }
        spread(16, function (x, y, i) {
          if (y < 700) disc(ctx, x, y, 5 + (i % 4) * 3, 'rgba(255,255,255,0.35)');
        });
        figuur(ctx, '\u{1F420}', 330, 420, 230);
        figuur(ctx, '\u{1F419}', 820, 520, 280);
        emoji(ctx, '\u{1F41F}', 1050, 250, 130);
        emoji(ctx, '\u{1F422}', 180, 770, 150);
        emoji(ctx, '\u{2B50}', 620, 845, 90);
        emoji(ctx, '\u{1F41A}', 950, 855, 80);
        vignet(ctx, w, h);
      }
    },
    {
      id: 'zee2', cat: 'zee', title: 'Dolfijnen in de golven', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#9fdcff', '#cfeeff', '#4fb3e0']);
        zon(ctx, 1040, 140, 150);
        cloud(ctx, 260, 150, 55);
        cloud(ctx, 660, 110, 42);
        // zee met drie golflagen
        var blauw = ['#5fc0ea', '#3f9fd4', '#2f86c0'];
        for (var l = 0; l < 3; l++) {
          ctx.fillStyle = blauw[l];
          ctx.beginPath();
          ctx.moveTo(0, 560 + l * 110);
          for (var x = 0; x <= 1200; x += 100) {
            ctx.quadraticCurveTo(x + 50, 560 + l * 110 - 35, x + 100, 560 + l * 110);
          }
          ctx.lineTo(1200, 900); ctx.lineTo(0, 900);
          ctx.closePath(); ctx.fill();
        }
        emoji(ctx, '\u{1F42C}', 420, 430, 330);
        emoji(ctx, '\u{1F42C}', 850, 560, 240);
        emoji(ctx, '\u{1F4A6}', 580, 560, 90);
        emoji(ctx, '\u{26F5}', 130, 520, 150);
        emoji(ctx, '\u{1F419}', 1080, 790, 130);
        vignet(ctx, w, h);
      }
    },
    {
      id: 'zee3', cat: 'zee', title: 'Zeemeerminnenpaleis', type: 'draw',
      credit: 'Getekend door de app',
      draw: function (ctx, w, h) {
        grad(ctx, w, h, ['#7bd1ff', '#5aa9e0', '#3a6cc0']);
        gloed(ctx, 600, 180, 400, 'rgba(255,255,255,0.4)');
        spread(22, function (x, y, i) {
          disc(ctx, x, y, 4 + (i % 4) * 2.5, 'rgba(255,255,255,0.3)');
        });
        blob(ctx, 600, 990, 760, 190, '#e8cf96');
        emoji(ctx, '\u{1F3F0}', 870, 470, 380);
        gloed(ctx, 380, 560, 280, 'rgba(255,210,240,0.4)');
        figuur(ctx, '\u{1F9DC}‍♀️', 380, 540, 330);
        emoji(ctx, '\u{1F420}', 150, 330, 120);
        emoji(ctx, '\u{1F41F}', 620, 720, 110);
        emoji(ctx, '\u{1F48E}', 200, 845, 85);
        emoji(ctx, '\u{1F41A}', 1010, 860, 80);
        emoji(ctx, '✨', 560, 300, 85);
        vignet(ctx, w, h);
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
