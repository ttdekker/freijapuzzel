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
    klik: function () { ensure(); toon(880, 880, 0.05, 'sine', 0.15); },
    plop: function () { ensure(); toon(600, 180, 0.12, 'triangle', 0.3); },
    twinkel: function () {
      ensure();
      toon(1320, 1320, 0.08, 'sine', 0.18);
      toon(1760, 1760, 0.08, 'sine', 0.18, 0.09);
    },
    tada: function () {
      ensure();
      var arp = [523.25, 659.25, 783.99, 1046.5];
      for (var i = 0; i < arp.length; i++) toon(arp[i], arp[i], 0.22, 'triangle', 0.22, i * 0.12);
      toon(523.25, 523.25, 0.5, 'triangle', 0.16, 0.55);
      toon(659.25, 659.25, 0.5, 'triangle', 0.16, 0.55);
      toon(783.99, 783.99, 0.5, 'triangle', 0.16, 0.55);
      toon(1046.5, 1046.5, 0.5, 'sine', 0.2, 0.55);
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
