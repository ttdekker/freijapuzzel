// js/sounds.js — WebAudio-synthese, geen audiobestanden nodig.
// AudioContext wordt pas aangemaakt/geresumed bij een gebruikersgebaar (iOS-eis);
// game.js roept ensure() aan op elk pointerdown en bij visibilitychange.

var Sounds = (function () {
  var ctx = null;
  var master = null;
  var uit = (function () {
    try { return localStorage.getItem('fp_muted') === '1'; } catch (e) { return false; }
  })();

  function ensure() {
    try {
      if (!ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = uit ? 0 : 1;
        master.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) {}
  }

  // Eén toon: van freqVan naar freqNaar in `duur` s, met exp. uitsterven.
  function toon(freqVan, freqNaar, duur, golf, sterkte, start) {
    if (!ctx || !master) return;
    try {
      var t0 = ctx.currentTime + (start || 0);
      var osc = ctx.createOscillator();
      var g = ctx.createGain();
      osc.type = golf;
      osc.frequency.setValueAtTime(freqVan, t0);
      if (freqNaar !== freqVan) osc.frequency.exponentialRampToValueAtTime(freqNaar, t0 + duur);
      g.gain.setValueAtTime(sterkte, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + duur);
      osc.connect(g);
      g.connect(master);
      osc.start(t0);
      osc.stop(t0 + duur + 0.05);
    } catch (e) {}
  }

  return {
    ensure: ensure,
    klik: function () { ensure(); toon(880, 660, 0.06, 'sine', 0.12); },
    // Stukje oppakken: kort blipje omhoog (zacht, anders wordt het vermoeiend).
    pickup: function () { ensure(); toon(330, 520, 0.07, 'sine', 0.1); },
    // Stukje vast: dof "plopje" + hoog tikje erbovenop = extra bevredigend.
    plop: function () {
      ensure();
      toon(560, 160, 0.13, 'triangle', 0.3);
      toon(1900, 1400, 0.05, 'sine', 0.12, 0.01);
    },
    twinkel: function () {
      ensure();
      // Pentatonisch loopje omhoog: klinkt altijd vrolijk, nooit vals.
      var p = [1046.5, 1174.7, 1318.5, 1568, 1760];
      for (var i = 0; i < p.length; i++) toon(p[i], p[i], 0.1, 'sine', 0.14, i * 0.06);
    },
    tada: function () {
      ensure();
      // Fanfaretje: arpeggio omhoog en dan een vol C-akkoord met sprankel.
      var arp = [523.25, 659.25, 783.99, 1046.5];
      for (var i = 0; i < arp.length; i++) toon(arp[i], arp[i], 0.22, 'triangle', 0.22, i * 0.11);
      var akkoord = [523.25, 659.25, 783.99, 1046.5];
      for (var j = 0; j < akkoord.length; j++) toon(akkoord[j], akkoord[j], 0.7, 'triangle', 0.14, 0.5);
      toon(2093, 2093, 0.5, 'sine', 0.1, 0.5);
      toon(1568, 1760, 0.3, 'sine', 0.1, 0.85);
    },
    muted: function () { return uit; },
    toggleMuted: function () {
      uit = !uit;
      try { localStorage.setItem('fp_muted', uit ? '1' : '0'); } catch (e) {}
      if (master) master.gain.value = uit ? 0 : 1;
      return uit;
    },
    debug: function () { return { created: !!ctx, state: ctx ? ctx.state : 'geen' }; }
  };
})();
