// js/effects.js — voortgang, toasts en confetti (divs in één rAF-loop).

var Effects = (function () {
  var confettiLoop = null;
  var toastTimer = null;

  function setProgress(pct) {
    var w = $('walker');
    w.style.left = Math.round(pct * 100) + '%';
    $('voortgang-vul').style.width = Math.round(pct * 100) + '%';
    $('finish').classList.toggle('feest', pct >= 1);
    if (pct > 0 && pct < 1) {
      w.classList.remove('hup');
      void w.offsetWidth; // animatie herstarten
      w.classList.add('hup');
    }
  }

  function toast(tekst) {
    var t = $('toast');
    t.textContent = tekst;
    t.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.add('hidden'); }, 1800);
  }

  function confetti() {
    stopConfetti();
    var bak = $('confetti');
    var kleuren = ['#ff8fb6', '#ffd166', '#7bd1ff', '#9ef0a0', '#cba6ff', '#ff9d76'];
    var deeltjes = [];
    for (var i = 0; i < 120; i++) {
      var el = document.createElement('div');
      el.className = 'confetto';
      var b = 6 + Math.random() * 8;
      el.style.width = b + 'px';
      el.style.height = b * (0.6 + Math.random() * 0.9) + 'px';
      el.style.background = kleuren[i % kleuren.length];
      bak.appendChild(el);
      deeltjes.push({
        el: el,
        x: Math.random() * window.innerWidth,
        y: -30 - Math.random() * window.innerHeight * 0.6,
        vx: (Math.random() - 0.5) * 2.4,
        vy: 1.5 + Math.random() * 3,
        fase: Math.random() * 6.28,
        rot: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 14
      });
    }
    var start = performance.now();
    function stap(nu) {
      for (var i = 0; i < deeltjes.length; i++) {
        var d = deeltjes[i];
        d.vy += 0.02;
        d.x += d.vx + Math.sin(d.fase + nu / 350) * 1.2;
        d.y += d.vy;
        d.rot += d.vrot;
        d.el.style.transform = 'translate(' + d.x + 'px,' + d.y + 'px) rotate(' + d.rot + 'deg)';
      }
      if (nu - start < 4200) confettiLoop = requestAnimationFrame(stap);
      else stopConfetti();
    }
    confettiLoop = requestAnimationFrame(stap);
  }

  function stopConfetti() {
    if (confettiLoop) cancelAnimationFrame(confettiLoop);
    confettiLoop = null;
    $('confetti').innerHTML = '';
  }

  return {
    setProgress: setProgress,
    toast: toast,
    confetti: confetti,
    stopConfetti: stopConfetti
  };
})();
