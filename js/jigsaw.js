// js/jigsaw.js — edge-maps en clip-path padstrings voor echte puzzelstukjes.
//
// Conventies (niet wijzigen, zie plan):
// - H is (rows+1)×cols; H[r][c] = rand tussen cel (r-1,c) en (r,c); +1 = nop OMHOOG.
// - V is rows×(cols+1); V[r][c] = rand tussen cel (r,c-1) en (r,c); +1 = nop naar LINKS.
// - Buitenranden 0 (recht). Uitsteek-teken per zijde van stukje (r,c):
//   boven +H[r][c] · rechts −V[r][c+1] · onder −H[r+1][c] · links +V[r][c]
//   ⇒ buurstukken zijn automatisch complementair.

var Jigsaw = (function () {

  function newEdges(cols, rows) {
    var H = [], V = [], r, c;
    for (r = 0; r <= rows; r++) {
      H[r] = [];
      for (c = 0; c < cols; c++) {
        H[r][c] = (r === 0 || r === rows) ? 0 : (Math.random() < 0.5 ? 1 : -1);
      }
    }
    for (r = 0; r < rows; r++) {
      V[r] = [];
      for (c = 0; c <= cols; c++) {
        V[r][c] = (c === 0 || c === cols) ? 0 : (Math.random() < 0.5 ? 1 : -1);
      }
    }
    return { H: H, V: V };
  }

  // Canonieke rand van (0,0) naar (L,0); buitenkant = -v bij o=+1.
  // De paren 0.35/0.65 en 0.3/0.7 zijn symmetrisch rond het midden — die
  // symmetrie maakt randen van buurstukken passend. Niet aanpassen.
  function randD(L, A, o, tf) {
    function p(u, v) {
      var q = tf(u, v);
      return q[0].toFixed(2) + ' ' + q[1].toFixed(2);
    }
    if (!o) return 'L ' + p(L, 0);
    var s = -o * A;
    return 'L ' + p(0.35 * L, 0) +
      ' C ' + p(0.5 * L, 0) + ' ' + p(0.3 * L, s) + ' ' + p(0.5 * L, s) +
      ' C ' + p(0.7 * L, s) + ' ' + p(0.5 * L, 0) + ' ' + p(0.65 * L, 0) +
      ' L ' + p(L, 0);
  }

  // Padstring voor stukje (r,c): met de klok mee vanaf (pad,pad), in de
  // coördinaten van de stukje-div (cel + pad rondom).
  function piecePath(edges, r, c, celB, celH, pad) {
    var A = 0.22 * Math.min(celB, celH);
    var oB = edges.H[r][c];
    var oR = -edges.V[r][c + 1];
    var oO = -edges.H[r + 1][c];
    var oL = edges.V[r][c];
    return 'M ' + pad.toFixed(2) + ' ' + pad.toFixed(2) + ' ' +
      randD(celB, A, oB, function (u, v) { return [pad + u, pad + v]; }) + ' ' +
      randD(celH, A, oR, function (u, v) { return [pad + celB - v, pad + u]; }) + ' ' +
      randD(celB, A, oO, function (u, v) { return [pad + celB - u, pad + celH - v]; }) + ' ' +
      randD(celH, A, oL, function (u, v) { return [pad + v, pad + celH - u]; }) + ' Z';
  }

  return { newEdges: newEdges, piecePath: piecePath };
})();
