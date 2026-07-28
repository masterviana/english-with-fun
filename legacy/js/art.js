/* =====================================================================
   art.js — Ilustrações SVG estilo lápis de cera

   Todos os desenhos são SVG inline (viewBox 0 0 100 100) desenhados
   com traço grosso, cantos redondos e preenchimentos ligeiramente
   transparentes. O filtro #crayon (definido no index.html com
   feTurbulence + feDisplacementMap) dá o tremido de desenho à mão.

   ART.svg(id) devolve o SVG de qualquer palavra ou mascote.
   Para migrar para Nuxt: cada desenho vira um componente <ArtXxx/>.
   ===================================================================== */

var ART = (function () {

  /* escurece uma cor hex (para os contornos) */
  function escurecer(hex, f) {
    f = f === undefined ? 0.65 : f;
    var n = parseInt(hex.slice(1), 16);
    var r = Math.round(((n >> 16) & 255) * f);
    var g = Math.round(((n >> 8) & 255) * f);
    var b = Math.round((n & 255) * f);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  function wrap(inner) {
    return '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
           '<g filter="url(#crayon)" stroke-linecap="round" stroke-linejoin="round">' +
           inner + "</g></svg>";
  }

  /* traço padrão */
  function S(cor, extra) {
    return 'stroke="' + cor + '" stroke-width="4" fill="none" ' + (extra || "");
  }
  function F(fill, stroke, extra) {
    return 'fill="' + fill + '" fill-opacity="0.82" stroke="' + stroke +
           '" stroke-width="4" ' + (extra || "");
  }

  /* ---- cartão de cor: lápis de cera + rabisco --------------------- */
  function corCard(cor) {
    var esc = escurecer(cor);
    return wrap(
      // rabisco
      '<path d="M18 78 q10 -14 20 -2 q10 12 20 -2 q10 -12 22 0" ' + S(cor, 'stroke-width="7" stroke-opacity="0.9"') + "/>" +
      '<path d="M22 86 q12 -10 24 0 q12 10 24 -2" ' + S(cor, 'stroke-width="7" stroke-opacity="0.55"') + "/>" +
      // lápis de cera inclinado
      '<g transform="rotate(-35 50 40)">' +
      '<rect x="38" y="14" width="24" height="52" rx="4" ' + F(cor, esc) + "/>" +
      '<path d="M50 2 L40 16 L60 16 Z" ' + F(cor, esc) + "/>" +
      '<rect x="38" y="30" width="24" height="12" fill="#ffffff" fill-opacity="0.45" stroke="' + esc + '" stroke-width="2.5"/>' +
      "</g>"
    );
  }

  /* ---- objetos ----------------------------------------------------- */
  var D = {};

  D.car = wrap(
    '<path d="M14 62 L18 48 Q20 42 27 42 L40 42 L48 32 Q50 30 54 30 L66 30 Q70 30 72 34 L78 44 L84 46 Q88 48 88 52 L88 62 Z" ' + F("#e94f4f", "#96302f") + "/>" +
    '<path d="M50 33 L45 42 L58 42 L58 33 Z" fill="#cfe6f7" fill-opacity="0.9" stroke="#96302f" stroke-width="3"/>' +
    '<path d="M62 33 L62 42 L71 42 L67 34 Z" fill="#cfe6f7" fill-opacity="0.9" stroke="#96302f" stroke-width="3"/>' +
    '<circle cx="30" cy="64" r="9" ' + F("#4a4344", "#231f20") + "/>" +
    '<circle cx="70" cy="64" r="9" ' + F("#4a4344", "#231f20") + "/>" +
    '<circle cx="30" cy="64" r="3.5" fill="#f7f3e8"/>' +
    '<circle cx="70" cy="64" r="3.5" fill="#f7f3e8"/>'
  );

  D.ball = wrap(
    '<circle cx="50" cy="52" r="30" ' + F("#f2c94c", "#b78f22") + "/>" +
    '<path d="M22 45 Q50 28 78 45" ' + S("#e0596e", 'stroke-width="5"') + "/>" +
    '<path d="M22 60 Q50 76 78 60" ' + S("#4f7fe9", 'stroke-width="5"') + "/>"
  );

  D.cup = wrap(
    '<path d="M28 32 L34 78 Q34 82 40 82 L60 82 Q66 82 66 78 L72 32 Z" ' + F("#9b6dd6", "#5f3f8c") + "/>" +
    '<path d="M28 32 Q50 40 72 32" ' + S("#5f3f8c", 'stroke-width="3.5"') + "/>" +
    '<path d="M72 40 Q86 42 82 54 Q79 63 68 62" ' + S("#5f3f8c", 'stroke-width="4.5"') + "/>" +
    '<path d="M40 46 q8 5 20 0" ' + S("#f7f3e8", 'stroke-width="3" stroke-opacity="0.7"') + "/>"
  );

  D.water = wrap(
    '<path d="M32 24 L36 80 Q36 84 42 84 L58 84 Q64 84 64 80 L68 24 Z" ' + S("#5b8fd6", 'stroke-width="4.5"') + "/>" +
    '<path d="M35 46 L38 79 Q38 81 43 81 L57 81 Q62 81 62 79 L65 46 Q50 54 35 46 Z" ' + F("#8fc1ee", "#5b8fd6", 'stroke-width="3"') + "/>" +
    '<path d="M40 58 q10 6 20 0" ' + S("#ffffff", 'stroke-width="3" stroke-opacity="0.8"') + "/>" +
    '<path d="M76 22 q8 12 0 16 q-8 -4 0 -16" ' + F("#8fc1ee", "#5b8fd6", 'stroke-width="3"') + "/>"
  );

  D.bed = wrap(
    '<path d="M12 30 L12 74 M88 42 L88 74" ' + S("#8a5a33", 'stroke-width="6"') + "/>" +
    '<rect x="12" y="52" width="76" height="14" rx="4" ' + F("#a76b3d", "#6d4423") + "/>" +
    '<rect x="16" y="40" width="22" height="12" rx="6" ' + F("#f7f3e8", "#b7ac95") + "/>" +
    '<path d="M40 44 L84 44 Q88 44 88 50 L88 52 L40 52 Z" ' + F("#f27fb2", "#b04f7e") + "/>" +
    '<path d="M46 48 h30 M50 44 v8" stroke="#b04f7e" stroke-width="2" stroke-opacity="0.6"/>'
  );

  D.chair = wrap(
    '<path d="M30 14 L30 84 M30 50 L68 50 L68 84" ' + S("#a76b3d", 'stroke-width="6"') + "/>" +
    '<rect x="28" y="46" width="44" height="9" rx="4" ' + F("#c98a52", "#6d4423") + "/>" +
    '<rect x="27" y="14" width="8" height="34" rx="3" ' + F("#c98a52", "#6d4423") + "/>" +
    '<rect x="30" y="18" width="34" height="8" rx="4" ' + F("#c98a52", "#6d4423") + "/>"
  );

  D.table = wrap(
    '<rect x="12" y="36" width="76" height="10" rx="5" ' + F("#c98a52", "#6d4423") + "/>" +
    '<path d="M22 46 L20 82 M78 46 L80 82" ' + S("#8a5a33", 'stroke-width="6"') + "/>" +
    '<path d="M50 46 L50 78" ' + S("#8a5a33", 'stroke-width="5" stroke-opacity="0.5"') + "/>"
  );

  D.door = wrap(
    '<rect x="28" y="14" width="44" height="72" rx="4" ' + F("#a76b3d", "#6d4423") + "/>" +
    '<rect x="35" y="24" width="30" height="22" rx="2" ' + S("#6d4423", 'stroke-width="3"') + "/>" +
    '<rect x="35" y="54" width="30" height="22" rx="2" ' + S("#6d4423", 'stroke-width="3"') + "/>" +
    '<circle cx="66" cy="50" r="3.5" ' + F("#f2c94c", "#b78f22", 'stroke-width="2.5"') + "/>" +
    '<path d="M22 86 L78 86" ' + S("#6d4423", 'stroke-width="4"') + "/>"
  );

  D.apple = wrap(
    '<path d="M50 34 Q38 22 28 34 Q18 46 28 66 Q36 82 50 76 Q64 82 72 66 Q82 46 72 34 Q62 22 50 34 Z" ' + F("#e94f4f", "#96302f") + "/>" +
    '<path d="M50 32 Q49 20 56 14" ' + S("#6d4423", 'stroke-width="4.5"') + "/>" +
    '<path d="M56 20 Q68 14 70 24 Q60 30 56 20 Z" ' + F("#5fbb63", "#37743a", 'stroke-width="3"') + "/>" +
    '<path d="M36 42 q-2 8 2 14" ' + S("#ffffff", 'stroke-width="3" stroke-opacity="0.6"') + "/>"
  );

  D.banana = wrap(
    '<path d="M24 30 Q20 62 44 74 Q68 84 82 62 Q84 58 80 58 Q60 70 42 56 Q28 44 32 30 Q32 26 28 27 Z" ' + F("#f2c94c", "#b78f22") + "/>" +
    '<path d="M26 26 L31 24 L33 30 L28 32 Z" ' + F("#8a5a33", "#5c3a1e", 'stroke-width="2.5"') + "/>" +
    '<path d="M80 60 q3 1 3 4" ' + S("#8a5a33", 'stroke-width="3"') + "/>" +
    '<path d="M36 38 q4 16 20 24" ' + S("#b78f22", 'stroke-width="2.5" stroke-opacity="0.6"') + "/>"
  );

  D.pencil = wrap(
    '<g transform="rotate(40 50 50)">' +
    '<rect x="41" y="8" width="18" height="58" ' + F("#f2c94c", "#b78f22") + "/>" +
    '<path d="M41 66 L50 88 L59 66 Z" ' + F("#e8c79b", "#a3835c") + "/>" +
    '<path d="M46.5 79 L50 88 L53.5 79 Z" fill="#4a4344" stroke="#231f20" stroke-width="2"/>' +
    '<rect x="41" y="8" width="18" height="9" rx="3" ' + F("#f27fb2", "#b04f7e", 'stroke-width="3"') + "/>" +
    '<path d="M47 20 L47 62 M53 20 L53 62" stroke="#b78f22" stroke-width="1.8" stroke-opacity="0.6"/>' +
    "</g>"
  );

  D.crayon = wrap(
    '<g transform="rotate(35 50 50)">' +
    '<rect x="40" y="14" width="20" height="60" rx="4" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
    '<path d="M50 2 L42 16 L58 16 Z" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
    '<rect x="40" y="32" width="20" height="16" fill="#ffffff" fill-opacity="0.5" stroke="#2c4f9e" stroke-width="2.5"/>' +
    '<path d="M45 38 q5 3 10 0" ' + S("#2c4f9e", 'stroke-width="2"') + "/>" +
    "</g>"
  );

  D.book = wrap(
    '<path d="M50 26 Q34 16 16 22 L16 74 Q34 68 50 78 Q66 68 84 74 L84 22 Q66 16 50 26 Z" ' + F("#5fbb63", "#37743a") + "/>" +
    '<path d="M50 26 L50 78" ' + S("#37743a", 'stroke-width="3.5"') + "/>" +
    '<path d="M24 32 q10 -3 20 1 M24 42 q10 -3 20 1 M24 52 q10 -3 20 1" ' + S("#f7f3e8", 'stroke-width="2.5" stroke-opacity="0.85"') + "/>" +
    '<path d="M56 33 q10 -4 20 -1 M56 43 q10 -4 20 -1 M56 53 q10 -4 20 -1" ' + S("#f7f3e8", 'stroke-width="2.5" stroke-opacity="0.85"') + "/>"
  );

  D.backpack = wrap(
    '<rect x="24" y="28" width="52" height="54" rx="14" ' + F("#9b6dd6", "#5f3f8c") + "/>" +
    '<path d="M38 28 Q38 14 50 14 Q62 14 62 28" ' + S("#5f3f8c", 'stroke-width="5"') + "/>" +
    '<rect x="34" y="52" width="32" height="24" rx="8" ' + F("#f27fb2", "#b04f7e", 'stroke-width="3.5"') + "/>" +
    '<path d="M34 64 L66 64" ' + S("#b04f7e", 'stroke-width="3"') + "/>" +
    '<circle cx="50" cy="64" r="3" fill="#f2c94c" stroke="#b78f22" stroke-width="2"/>' +
    '<path d="M30 36 Q50 44 70 36" ' + S("#5f3f8c", 'stroke-width="3.5"') + "/>"
  );

  D.scissors = wrap(
    '<path d="M30 22 L62 62" ' + S("#8b97a6", 'stroke-width="6"') + "/>" +
    '<path d="M70 22 L38 62" ' + S("#aab6c4", 'stroke-width="6"') + "/>" +
    '<circle cx="50" cy="44" r="3.2" fill="#f2c94c" stroke="#b78f22" stroke-width="2"/>' +
    '<ellipse cx="34" cy="72" rx="9" ry="11" ' + S("#e94f4f", 'stroke-width="5.5"') + "/>" +
    '<ellipse cx="66" cy="72" rx="9" ry="11" ' + S("#4f7fe9", 'stroke-width="5.5"') + "/>"
  );

  /* ---- mascotes ---------------------------------------------------- */

  /* Kika, a cadelinha azul */
  D.mascote_kika = wrap(
    '<ellipse cx="50" cy="86" rx="22" ry="8" fill="#000" fill-opacity="0.06"/>' +
    // orelhas compridas e caídas, de cadelinha
    '<path d="M30 26 Q18 30 16 48 Q15 62 24 62 Q32 61 33 46 Q34 34 36 28 Z" ' + F("#3a66c4", "#24417e") + "/>" +
    '<path d="M70 26 Q82 30 84 48 Q85 62 76 62 Q68 61 67 46 Q66 34 64 28 Z" ' + F("#3a66c4", "#24417e") + "/>" +
    // cabeça
    '<circle cx="50" cy="44" r="26" ' + F("#6f9bee", "#2c4f9e") + "/>" +
    // focinho
    '<ellipse cx="50" cy="54" rx="13" ry="10" fill="#dbe7fb" fill-opacity="0.95" stroke="#2c4f9e" stroke-width="3"/>' +
    '<ellipse cx="50" cy="50" rx="5" ry="4" fill="#2c3a55" stroke="#1c2740" stroke-width="2"/>' +
    '<path d="M50 54 L50 58 M50 58 Q45 62 42 59 M50 58 Q55 62 58 59" ' + S("#2c3a55", 'stroke-width="2.5"') + "/>" +
    // olhos
    '<circle cx="39" cy="38" r="4.5" fill="#2c3a55"/><circle cx="61" cy="38" r="4.5" fill="#2c3a55"/>' +
    '<circle cx="40.5" cy="36.5" r="1.6" fill="#fff"/><circle cx="62.5" cy="36.5" r="1.6" fill="#fff"/>' +
    // sobrancelhas alegres
    '<path d="M34 30 q5 -4 10 -1 M56 29 q5 -3 10 1" ' + S("#2c4f9e", 'stroke-width="2.5"') + "/>" +
    // corpo pequenino + cauda
    '<path d="M34 66 Q32 84 44 84 L56 84 Q68 84 66 66" ' + F("#6f9bee", "#2c4f9e") + "/>" +
    '<path d="M66 76 Q78 74 76 64" ' + S("#2c4f9e", 'stroke-width="5"') + "/>"
  );

  /* Lulu, a porquinha cor-de-rosa */
  D.mascote_lulu = wrap(
    '<ellipse cx="50" cy="86" rx="22" ry="8" fill="#000" fill-opacity="0.06"/>' +
    // orelhas
    '<path d="M32 24 L26 10 Q36 12 40 22 Z" ' + F("#ef9ec4", "#b04f7e") + "/>" +
    '<path d="M68 24 L74 10 Q64 12 60 22 Z" ' + F("#ef9ec4", "#b04f7e") + "/>" +
    // cabeça
    '<circle cx="50" cy="44" r="25" ' + F("#f5b8d4", "#c9628f") + "/>" +
    // focinho
    '<ellipse cx="50" cy="50" rx="11" ry="8" ' + F("#ef9ec4", "#b04f7e", 'stroke-width="3"') + "/>" +
    '<circle cx="46" cy="50" r="2" fill="#8c3560"/><circle cx="54" cy="50" r="2" fill="#8c3560"/>' +
    // olhos e sorriso
    '<circle cx="38" cy="37" r="4" fill="#4a2a3a"/><circle cx="62" cy="37" r="4" fill="#4a2a3a"/>' +
    '<circle cx="39.4" cy="35.6" r="1.4" fill="#fff"/><circle cx="63.4" cy="35.6" r="1.4" fill="#fff"/>' +
    '<path d="M40 60 Q50 66 60 60" ' + S("#8c3560", 'stroke-width="3"') + "/>" +
    // bochechas
    '<circle cx="31" cy="47" r="4" fill="#f27fb2" fill-opacity="0.6"/>' +
    '<circle cx="69" cy="47" r="4" fill="#f27fb2" fill-opacity="0.6"/>' +
    // corpo + rabinho
    '<path d="M35 66 Q33 84 45 84 L55 84 Q67 84 65 66" ' + F("#f5b8d4", "#c9628f") + "/>" +
    '<path d="M65 76 q8 -2 6 4 q-2 5 3 3" ' + S("#c9628f", 'stroke-width="3.5"') + "/>"
  );

  /* estrela de recompensa */
  D.estrela = wrap(
    '<path d="M50 12 L59 36 L85 38 L65 55 L72 81 L50 66 L28 81 L35 55 L15 38 L41 36 Z" ' + F("#f2c94c", "#b78f22", 'stroke-width="4.5"') + "/>" +
    '<circle cx="43" cy="46" r="2.5" fill="#4a2a3a"/><circle cx="57" cy="46" r="2.5" fill="#4a2a3a"/>' +
    '<path d="M44 55 Q50 60 56 55" ' + S("#4a2a3a", 'stroke-width="2.5"') + "/>"
  );

  function svg(id) {
    var w = WORDS_BY_ID[id];
    if (w && w.pack === "cores") return corCard(w.cor);
    return D[id] || wrap('<circle cx="50" cy="50" r="30" ' + S("#999") + "/>");
  }

  return { svg: svg, escurecer: escurecer };
})();
