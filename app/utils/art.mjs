/* Ilustrações SVG estilo lápis de cera.
   Módulo puro (sem DOM, sem Nuxt) — é importado pela app E pelo
   scripts/check.mjs em Node. Manter assim. */

export function escurecer(hex, f = 0.65) {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.round(((n >> 16) & 255) * f)
  const g = Math.round(((n >> 8) & 255) * f)
  const b = Math.round((n & 255) * f)
  return `rgb(${r},${g},${b})`
}

function wrap(inner) {
  return (
    '<svg class="art" viewBox="0 0 100 100" aria-hidden="true">' +
    '<g filter="url(#crayon)" stroke-linecap="round" stroke-linejoin="round">' +
    inner +
    '</g></svg>'
  )
}

function S(cor, extra = '') {
  return `stroke="${cor}" stroke-width="4" fill="none" ${extra}`
}

function F(fill, stroke, extra = '') {
  return `fill="${fill}" fill-opacity="0.82" stroke="${stroke}" stroke-width="4" ${extra}`
}

/* ---- cartão de cor: lápis de cera + rabisco --------------------- */
function luminancia(hex) {
  const n = parseInt(hex.slice(1), 16)
  return (((n >> 16) & 255) * 0.299 + ((n >> 8) & 255) * 0.587 + (n & 255) * 0.114) / 255
}

function corCard(cor) {
  // contorno na MESMA cor do lápis — exceto cores claras (ex.: branco), onde
  // o traço fica invisível; nesse caso escurece-se só o traço, o fill mantém
  // a cor original
  const traco = luminancia(cor) > 0.82 ? escurecer(cor, 0.72) : cor
  return wrap(
    // rabisco
    '<path d="M18 78 q10 -14 20 -2 q10 12 20 -2 q10 -12 22 0" ' + S(traco, 'stroke-width="7" stroke-opacity="0.9"') + "/>" +
    '<path d="M22 86 q12 -10 24 0 q12 10 24 -2" ' + S(traco, 'stroke-width="7" stroke-opacity="0.55"') + "/>" +
    // lápis de cera inclinado
    '<g transform="rotate(-35 50 40)">' +
    '<rect x="38" y="14" width="24" height="52" rx="4" ' + F(cor, traco) + "/>" +
    '<path d="M50 2 L40 16 L60 16 Z" ' + F(cor, traco) + "/>" +
    '<rect x="38" y="30" width="24" height="12" fill="#ffffff" fill-opacity="0.45" stroke="' + traco + '" stroke-width="2.5"/>' +
    "</g>"
  );
}

/* ---- objetos ----------------------------------------------------- */
const D = {}

D.car = wrap(
  '<path d="M14 62 L18 48 Q20 42 27 42 L40 42 L48 32 Q50 30 54 30 L66 30 Q70 30 72 34 L78 44 L84 46 Q88 48 88 52 L88 62 Z" ' + F("#e94f4f", "#96302f") + "/>" +
  '<path d="M50 33 L45 42 L58 42 L58 33 Z" fill="#cfe6f7" fill-opacity="0.9" stroke="#96302f" stroke-width="3"/>' +
  '<path d="M62 33 L62 42 L71 42 L67 34 Z" fill="#cfe6f7" fill-opacity="0.9" stroke="#96302f" stroke-width="3"/>' +
  '<circle cx="30" cy="64" r="9" ' + F("#4a4344", "#231f20") + "/>" +
  '<circle cx="70" cy="64" r="9" ' + F("#4a4344", "#231f20") + "/>" +
  '<circle cx="30" cy="64" r="3.5" fill="#f7f3e8"/>' +
  '<circle cx="70" cy="64" r="3.5" fill="#f7f3e8"/>'
);

D.bus = wrap(
  // autocarro escolar amarelo: corpo retangular, teto arredondado, faixa, janelas, rodas
  '<path d="M12 30 Q12 22 20 22 L80 22 Q88 22 88 30 L88 64 L12 64 Z" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M14 44 L86 44" ' + S("#b78f22", 'stroke-width="4"') + "/>" +
  '<rect x="18" y="28" width="14" height="12" rx="2" fill="#cfe6f7" fill-opacity="0.9" stroke="#b78f22" stroke-width="2.5"/>' +
  '<rect x="36" y="28" width="14" height="12" rx="2" fill="#cfe6f7" fill-opacity="0.9" stroke="#b78f22" stroke-width="2.5"/>' +
  '<rect x="54" y="28" width="14" height="12" rx="2" fill="#cfe6f7" fill-opacity="0.9" stroke="#b78f22" stroke-width="2.5"/>' +
  '<rect x="72" y="28" width="12" height="12" rx="2" fill="#cfe6f7" fill-opacity="0.9" stroke="#b78f22" stroke-width="2.5"/>' +
  '<rect x="12" y="52" width="12" height="10" fill="#e94f4f" fill-opacity="0.85" stroke="#96302f" stroke-width="2.5"/>' +
  '<circle cx="28" cy="66" r="9" ' + F("#4a4344", "#231f20") + "/>" +
  '<circle cx="72" cy="66" r="9" ' + F("#4a4344", "#231f20") + "/>" +
  '<circle cx="28" cy="66" r="3.5" fill="#f7f3e8"/>' +
  '<circle cx="72" cy="66" r="3.5" fill="#f7f3e8"/>'
);

D.truck = wrap(
  // camião: cabine curta à frente + caixa de carga longa atrás
  '<path d="M10 58 L10 40 Q10 36 14 36 L34 36 L44 46 L44 58 Z" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<rect x="44" y="26" width="42" height="32" rx="3" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<rect x="18" y="42" width="18" height="12" rx="2" fill="#cfe6f7" fill-opacity="0.9" stroke="#2c4f9e" stroke-width="2.5"/>' +
  '<circle cx="26" cy="66" r="9" ' + F("#4a4344", "#231f20") + "/>" +
  '<circle cx="70" cy="66" r="9" ' + F("#4a4344", "#231f20") + "/>" +
  '<circle cx="26" cy="66" r="3.5" fill="#f7f3e8"/>' +
  '<circle cx="70" cy="66" r="3.5" fill="#f7f3e8"/>' +
  '<path d="M10 58 L86 58" ' + S("#2c4f9e", 'stroke-width="4"') + "/>"
);

D.train = wrap(
  // locomotiva de brinquedo, perfil: caldeira cilíndrica à frente + cabine mais alta atrás + chaminé em cima da caldeira com fumo + apara-vacas triangular à frente + 3 rodas (2 pequenas à frente, 1 maior sob a cabine)
  // cabine (retângulo alto atrás, com janela)
  '<rect x="58" y="24" width="26" height="38" rx="4" ' + F("#5fbb63", "#37743a") + "/>" +
  '<rect x="65" y="30" width="12" height="12" rx="2" fill="#cfe6f7" fill-opacity="0.9" stroke="#37743a" stroke-width="2.5"/>' +
  // caldeira (retângulo arredondado deitado à frente)
  '<rect x="18" y="38" width="46" height="24" rx="12" ' + F("#5fbb63", "#37743a") + "/>" +
  // apara-vacas triangular à frente
  '<path d="M18 62 L10 74 L26 74 L22 62 Z" ' + F("#37743a", "#22492a") + "/>" +
  // chaminé + fumo
  '<rect x="30" y="20" width="10" height="18" rx="3" ' + F("#37743a", "#22492a") + "/>" +
  '<path d="M35 18 Q30 8 36 4 Q44 9 38 14" ' + S("#8b97a6", 'stroke-width="4" stroke-opacity="0.7"') + "/>" +
  // rodas: 2 pequenas à frente + 1 maior sob a cabine
  '<circle cx="30" cy="76" r="8" ' + F("#4a4344", "#231f20") + "/>" +
  '<circle cx="30" cy="76" r="3" fill="#f7f3e8"/>' +
  '<circle cx="50" cy="76" r="8" ' + F("#4a4344", "#231f20") + "/>" +
  '<circle cx="50" cy="76" r="3" fill="#f7f3e8"/>' +
  '<circle cx="74" cy="76" r="11" ' + F("#4a4344", "#231f20") + "/>" +
  '<circle cx="74" cy="76" r="4.5" fill="#f7f3e8"/>'
);

D.plane = wrap(
  // avião de perfil: fuselagem em silhueta única (nariz arredondado à esquerda, cauda a apontar para cima à direita), uma asa triangular por baixo do corpo, janelinhas
  '<path d="M8 56 Q8 46 18 46 L70 46 L82 26 L90 26 L84 46 Q94 48 94 56 Q94 64 82 64 L18 64 Q8 64 8 56 Z" ' + F("#8fc1ee", "#5b8fd6") + "/>" +
  '<path d="M40 64 L30 82 L44 82 L52 64 Z" ' + F("#5b8fd6", "#2c4f9e") + "/>" +
  '<circle cx="24" cy="55" r="3" fill="#5b8fd6" stroke="#2c4f9e" stroke-width="1.5"/>' +
  '<circle cx="34" cy="55" r="3" fill="#5b8fd6" stroke="#2c4f9e" stroke-width="1.5"/>' +
  '<circle cx="44" cy="55" r="3" fill="#5b8fd6" stroke="#2c4f9e" stroke-width="1.5"/>' +
  '<circle cx="54" cy="55" r="3" fill="#5b8fd6" stroke="#2c4f9e" stroke-width="1.5"/>'
);

D.motorbike = wrap(
  // trotinete/mota, perfil: 2 rodas pretas grandes, corpo baixo a descer da frente para trás, banco atrás em cima, coluna de direção alta e inclinada à frente com guiador em T no topo, farol redondo à frente
  '<circle cx="26" cy="78" r="14" ' + F("#4a4344", "#231f20") + "/>" +
  '<circle cx="74" cy="78" r="14" ' + F("#4a4344", "#231f20") + "/>" +
  '<circle cx="26" cy="78" r="5" fill="#f7f3e8"/>' +
  '<circle cx="74" cy="78" r="5" fill="#f7f3e8"/>' +
  // corpo: mais alto perto do farol/direção, a descer para um banco baixo atrás
  '<path d="M22 64 L30 64 L36 70 L82 70 Q86 70 86 74 L86 78 L20 78 L20 70 Q20 64 22 64 Z" ' + F("#e94f4f", "#96302f") + "/>" +
  // banco em cima, atrás
  '<rect x="64" y="62" width="20" height="9" rx="4" ' + F("#231f20", "#000000", 'stroke-width="3"') + "/>" +
  // coluna de direção alta e inclinada (sai do corpo, à frente)
  '<path d="M26 64 L40 16" ' + S("#96302f", 'stroke-width="7"') + "/>" +
  // guiador em T no topo
  '<path d="M28 18 L52 14" ' + S("#96302f", 'stroke-width="6"') + "/>" +
  // farol redondo, sobre a coluna, perto do topo do corpo
  '<circle cx="34" cy="56" r="8" ' + F("#f2c94c", "#b78f22", 'stroke-width="3"') + "/>"
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
  // cadeira vista de frente: costas com ripas, assento e quatro pernas
  '<rect x="32" y="10" width="36" height="36" rx="10" ' + F("#c98a52", "#6d4423") + "/>" +
  '<path d="M39 22 h22 M39 32 h22" ' + S("#6d4423", 'stroke-width="3" stroke-opacity="0.5"') + "/>" +
  '<rect x="24" y="44" width="52" height="11" rx="5" ' + F("#a76b3d", "#6d4423") + "/>" +
  '<path d="M30 55 L27 84 M70 55 L73 84" ' + S("#8a5a33", 'stroke-width="6"') + "/>" +
  '<path d="M39 55 L38 76 M61 55 L62 76" ' + S("#8a5a33", 'stroke-width="5" stroke-opacity="0.55"') + "/>"
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

D.eraser = wrap(
  // borracha: bloco arredondado, rosa, com faixa a meio
  '<rect x="24" y="34" width="52" height="32" rx="8" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<rect x="24" y="46" width="52" height="8" fill="#ffffff" fill-opacity="0.5" stroke="#b04f7e" stroke-width="2"/>' +
  '<path d="M32 40 q8 -3 16 0" ' + S("#ffffff", 'stroke-width="2.5" stroke-opacity="0.7"') + "/>"
);

D.pen = wrap(
  // caneta: corpo azul, ponta metálica, tampa
  '<g transform="rotate(40 50 50)">' +
  '<rect x="42" y="10" width="16" height="52" rx="4" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<path d="M42 62 L50 84 L58 62 Z" ' + F("#8b97a6", "#5c6b7a") + "/>" +
  '<rect x="42" y="10" width="16" height="10" rx="3" ' + F("#2c4f9e", "#2c4f9e", 'stroke-width="3"') + "/>" +
  '<path d="M46 24 L46 58 M54 24 L54 58" stroke="#2c4f9e" stroke-width="1.8" stroke-opacity="0.6"/>' +
  "</g>"
);

D.notebook = wrap(
  // caderno: capa reta com espiral no topo, linhas dentro
  '<rect x="20" y="18" width="60" height="66" rx="4" ' + F("#5fbb63", "#37743a") + "/>" +
  '<path d="M28 14 L28 22 M38 14 L38 22 M48 14 L48 22 M58 14 L58 22 M68 14 L68 22 M78 14 L78 22" ' + S("#37743a", 'stroke-width="3.5"') + "/>" +
  '<path d="M30 36 L70 36 M30 46 L70 46 M30 56 L70 56 M30 66 L70 66" ' + S("#f7f3e8", 'stroke-width="2.5" stroke-opacity="0.85"') + "/>"
);

D.computer = wrap(
  // computador: ecrã + base + teclado
  '<rect x="16" y="14" width="68" height="46" rx="5" ' + F("#8b97a6", "#5c6b7a") + "/>" +
  '<rect x="23" y="21" width="54" height="32" rx="2" ' + F("#8fc1ee", "#5b8fd6", 'stroke-width="3"') + "/>" +
  '<path d="M50 60 L50 68" ' + S("#5c6b7a", 'stroke-width="6"') + "/>" +
  '<rect x="20" y="70" width="60" height="14" rx="4" ' + F("#c8ced6", "#5c6b7a") + "/>" +
  '<path d="M30 77 h40" ' + S("#5c6b7a", 'stroke-width="2.5" stroke-opacity="0.6"') + "/>"
);

D.desk = wrap(
  // secretária: tampo, pernas, gaveta com puxador, livro em cima (diferente da table simples)
  '<rect x="12" y="40" width="76" height="10" rx="4" ' + F("#c98a52", "#6d4423") + "/>" +
  '<path d="M22 50 L20 82 M78 50 L80 82" ' + S("#8a5a33", 'stroke-width="6"') + "/>" +
  '<rect x="56" y="50" width="24" height="16" rx="2" ' + F("#a76b3d", "#6d4423", 'stroke-width="3"') + "/>" +
  '<circle cx="68" cy="58" r="2.4" fill="#6d4423"/>' +
  '<path d="M26 40 Q22 28 30 24 L58 24 Q66 28 62 40 Z" ' + F("#5fbb63", "#37743a") + "/>" +
  '<path d="M32 30 q9 -3 18 0" ' + S("#f7f3e8", 'stroke-width="2.5" stroke-opacity="0.85"') + "/>"
);

D.bell = wrap(
  // sino escolar: cúpula, badalo, argola no topo
  '<path d="M50 16 L50 22" ' + S("#b78f22", 'stroke-width="4"') + "/>" +
  '<circle cx="50" cy="12" r="5" fill="none" stroke="#b78f22" stroke-width="4"/>' +
  '<path d="M30 62 Q26 34 50 30 Q74 34 70 62 Z" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M24 62 L76 62 Q76 70 68 70 L32 70 Q24 70 24 62 Z" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<circle cx="50" cy="80" r="6" ' + F("#b78f22", "#6d4423") + "/>" +
  '<path d="M50 70 L50 74" ' + S("#b78f22", 'stroke-width="4"') + "/>" +
  '<path d="M38 40 q6 -6 12 0" ' + S("#ffffff", 'stroke-width="2.5" stroke-opacity="0.7"') + "/>"
);

D.lunchbox = wrap(
  // lancheira: caixa com tampa, pega no topo, fecho à frente
  '<path d="M28 22 Q28 12 50 12 Q72 12 72 22" ' + S("#96302f", 'stroke-width="5"') + "/>" +
  '<rect x="18" y="22" width="64" height="52" rx="8" ' + F("#e94f4f", "#96302f") + "/>" +
  '<rect x="42" y="40" width="16" height="14" rx="3" ' + F("#f2c94c", "#b78f22", 'stroke-width="2.5"') + "/>" +
  '<path d="M22 38 h60" ' + S("#96302f", 'stroke-width="2.5" stroke-opacity="0.6"') + "/>"
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

D.pillow = wrap(
  '<path d="M16 40 Q16 26 32 26 L68 26 Q84 26 84 40 L84 60 Q84 74 68 74 L32 74 Q16 74 16 60 Z" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<path d="M30 30 Q26 50 32 70 M70 30 Q74 50 68 70" ' + S("#b04f7e", 'stroke-width="2.5" stroke-opacity="0.5"') + "/>" +
  '<path d="M40 26 Q50 34 60 26 M40 74 Q50 66 60 74" ' + S("#b04f7e", 'stroke-width="3" stroke-opacity="0.6"') + "/>"
);

D.blanket = wrap(
  '<path d="M12 20 L76 20 L76 66 L88 78 L34 78 L12 56 Z" ' + F("#9b6dd6", "#5f3f8c") + "/>" +
  '<path d="M76 66 L88 78 L76 78 Z" ' + F("#7a52ab", "#5f3f8c", 'stroke-width="3"') + "/>" +
  '<path d="M22 32 Q50 28 66 32 M20 44 Q50 40 68 44 M20 56 Q50 52 68 56 M22 68 Q46 64 60 68" ' + S("#f7f3e8", 'stroke-width="4.5" stroke-opacity="0.85"') + "/>"
);

D.lamp = wrap(
  '<path d="M30 16 L70 16 L82 46 Q83 50 78 50 L22 50 Q17 50 18 46 Z" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M50 50 L50 82" ' + S("#8a5a33", 'stroke-width="6"') + "/>" +
  '<ellipse cx="50" cy="88" rx="24" ry="7" ' + F("#a76b3d", "#6d4423") + "/>" +
  '<path d="M36 24 L34 42 M50 22 L49 44 M64 24 L66 42" ' + S("#b78f22", 'stroke-width="2.5" stroke-opacity="0.6"') + "/>" +
  '<path d="M8 8 L16 16 M50 4 L50 12 M92 8 L84 16" ' + S("#f2c94c", 'stroke-width="3" stroke-opacity="0.5"') + "/>"
);

D.teddy = wrap(
  '<circle cx="30" cy="24" r="11" ' + F("#c98a52", "#6d4423") + "/>" +
  '<circle cx="70" cy="24" r="11" ' + F("#c98a52", "#6d4423") + "/>" +
  '<circle cx="30" cy="24" r="5" ' + F("#e8c79b", "#6d4423", 'stroke-width="2.5"') + "/>" +
  '<circle cx="70" cy="24" r="5" ' + F("#e8c79b", "#6d4423", 'stroke-width="2.5"') + "/>" +
  '<circle cx="50" cy="42" r="24" ' + F("#c98a52", "#6d4423") + "/>" +
  '<ellipse cx="50" cy="48" rx="12" ry="9" ' + F("#e8c79b", "#6d4423", 'stroke-width="3"') + "/>" +
  '<circle cx="50" cy="44" r="3" fill="#4a2a3a"/>' +
  '<circle cx="41" cy="36" r="3" fill="#4a2a3a"/><circle cx="59" cy="36" r="3" fill="#4a2a3a"/>' +
  '<path d="M50 47 Q46 52 42 50 M50 47 Q54 52 58 50" ' + S("#6d4423", 'stroke-width="2.5"') + "/>" +
  '<ellipse cx="50" cy="76" rx="26" ry="20" ' + F("#c98a52", "#6d4423") + "/>" +
  '<ellipse cx="50" cy="78" rx="12" ry="10" ' + F("#e8c79b", "#6d4423", 'stroke-width="2.5"') + "/>" +
  '<circle cx="18" cy="70" r="8" ' + F("#c98a52", "#6d4423") + "/>" +
  '<circle cx="82" cy="70" r="8" ' + F("#c98a52", "#6d4423") + "/>"
);

D.window = wrap(
  '<rect x="16" y="14" width="68" height="64" rx="6" ' + F("#f7f3e8", "#b7ac95") + "/>" +
  '<rect x="24" y="22" width="52" height="48" ' + F("#8fc1ee", "#5b8fd6") + "/>" +
  '<path d="M50 22 L50 70 M24 46 L76 46" ' + S("#f7f3e8", 'stroke-width="4"') + "/>" +
  '<path d="M30 30 Q36 26 42 30" ' + S("#ffffff", 'stroke-width="3" stroke-opacity="0.7"') + "/>" +
  '<path d="M14 14 L26 14 Q22 26 25 38 Q27 48 20 54 L14 54 Q19 44 17 34 Q15 24 14 14 Z" ' + F("#f27fb2", "#b04f7e", 'stroke-width="3"') + "/>" +
  '<path d="M18 20 Q21 30 19 40" ' + S("#b04f7e", 'stroke-width="2" stroke-opacity="0.6"') + "/>"
);

D.wardrobe = wrap(
  '<path d="M20 12 L80 12 Q84 12 84 16 L84 84 Q84 88 80 88 L20 88 Q16 88 16 84 L16 16 Q16 12 20 12 Z" ' + F("#a76b3d", "#6d4423") + "/>" +
  '<path d="M50 12 L50 88" ' + S("#6d4423", 'stroke-width="4"') + "/>" +
  '<rect x="22" y="20" width="24" height="60" rx="3" ' + S("#6d4423", 'stroke-width="3"') + "/>" +
  '<rect x="54" y="20" width="24" height="60" rx="3" ' + S("#6d4423", 'stroke-width="3"') + "/>" +
  '<circle cx="44" cy="50" r="3" ' + F("#f2c94c", "#b78f22", 'stroke-width="2.5"') + "/>" +
  '<circle cx="56" cy="50" r="3" ' + F("#f2c94c", "#b78f22", 'stroke-width="2.5"') + "/>"
);

D.rug = wrap(
  '<ellipse cx="50" cy="50" rx="38" ry="22" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<ellipse cx="50" cy="50" rx="28" ry="15" fill="none" stroke="#b04f7e" stroke-width="3.5" stroke-opacity="0.7"/>' +
  '<ellipse cx="50" cy="50" rx="16" ry="9" fill="none" stroke="#b04f7e" stroke-width="3" stroke-opacity="0.6"/>' +
  '<path d="M14 46 l-6 2 M14 50 l-7 0 M14 54 l-6 -2 M86 46 l6 2 M86 50 l7 0 M86 54 l6 -2" ' + S("#b04f7e", 'stroke-width="3.5"') + "/>"
);

D.curtain = wrap(
  '<path d="M14 12 L86 12" ' + S("#6d4423", 'stroke-width="6"') + "/>" +
  '<path d="M20 12 Q14 46 24 88 L36 88 Q28 46 32 12 Z" ' + F("#9b6dd6", "#5f3f8c") + "/>" +
  '<path d="M68 12 Q64 46 72 88 L84 88 Q80 46 84 12 Z" ' + F("#9b6dd6", "#5f3f8c") + "/>" +
  '<path d="M25 20 Q21 46 28 80 M76 20 Q80 46 77 80" ' + S("#5f3f8c", 'stroke-width="2.5" stroke-opacity="0.6"') + "/>" +
  '<circle cx="17" cy="12" r="4" fill="#5f3f8c"/><circle cx="35" cy="12" r="4" fill="#5f3f8c"/>' +
  '<circle cx="65" cy="12" r="4" fill="#5f3f8c"/><circle cx="83" cy="12" r="4" fill="#5f3f8c"/>'
);

D.doll = wrap(
  '<circle cx="50" cy="28" r="17" ' + F("#e8c79b", "#a3835c") + "/>" +
  '<path d="M32 24 Q30 6 50 6 Q70 6 68 24 Q68 13 50 13 Q32 13 32 24 Z" ' + F("#a76b3d", "#6d4423") + "/>" +
  '<circle cx="43" cy="29" r="2.8" fill="#4a2a3a"/><circle cx="57" cy="29" r="2.8" fill="#4a2a3a"/>' +
  '<path d="M44 36 Q50 40 56 36" ' + S("#96302f", 'stroke-width="2.5"') + "/>" +
  '<circle cx="36" cy="32" r="3.5" fill="#f27fb2" fill-opacity="0.6"/><circle cx="64" cy="32" r="3.5" fill="#f27fb2" fill-opacity="0.6"/>' +
  '<path d="M50 44 L36 52 Q28 80 32 90 L68 90 Q72 80 64 52 Z" ' + F("#f5b8d4", "#c9628f") + "/>" +
  '<path d="M32 90 L24 62 M68 90 L76 62" ' + S("#e8c79b", 'stroke-width="7"') + "/>" +
  '<path d="M42 60 h16" ' + S("#c9628f", 'stroke-width="3" stroke-opacity="0.6"') + "/>" +
  '<path d="M50 66 L38 58 Q34 56 34 62 Q34 68 38 70 L50 66 Z" ' + F("#f27fb2", "#b04f7e", 'stroke-width="3"') + "/>" +
  '<path d="M50 66 L62 58 Q66 56 66 62 Q66 68 62 70 L50 66 Z" ' + F("#f27fb2", "#b04f7e", 'stroke-width="3"') + "/>" +
  '<circle cx="50" cy="66" r="4" ' + F("#b04f7e", "#8c3560") + "/>"
);

D.moon = wrap(
  '<path d="M62 14 Q34 20 34 50 Q34 80 62 86 Q40 76 40 50 Q40 24 62 14 Z" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M74 24 L77 30 L83 32 L77 34 L74 40 L71 34 L65 32 L71 30 Z" ' + F("#f2c94c", "#b78f22", 'stroke-width="3"') + "/>"
);

D.star = wrap(
  '<path d="M50 12 L59 36 L85 38 L65 55 L72 81 L50 66 L28 81 L35 55 L15 38 L41 36 Z" ' + F("#f2c94c", "#b78f22", 'stroke-width="4.5"') + "/>"
);

D.scissors = wrap(
  '<path d="M30 22 L62 62" ' + S("#8b97a6", 'stroke-width="6"') + "/>" +
  '<path d="M70 22 L38 62" ' + S("#aab6c4", 'stroke-width="6"') + "/>" +
  '<circle cx="50" cy="44" r="3.2" fill="#f2c94c" stroke="#b78f22" stroke-width="2"/>' +
  '<ellipse cx="34" cy="72" rx="9" ry="11" ' + S("#e94f4f", 'stroke-width="5.5"') + "/>" +
  '<ellipse cx="66" cy="72" rx="9" ry="11" ' + S("#4f7fe9", 'stroke-width="5.5"') + "/>"
);

D.spoon = wrap(
  '<g transform="rotate(35 50 50)">' +
  '<ellipse cx="50" cy="26" rx="14" ry="19" ' + F("#aab6c4", "#5c6b7a") + "/>" +
  '<rect x="46" y="42" width="8" height="46" rx="4" ' + F("#8b97a6", "#5c6b7a", 'stroke-width="3.5"') + "/>" +
  '<path d="M44 20 q6 -6 12 0" ' + S("#f7f3e8", 'stroke-width="3" stroke-opacity="0.8"') + "/>" +
  "</g>"
);

D.fork = wrap(
  '<path d="M34 14 L34 40 M42 14 L42 42 M50 14 L50 42 M58 14 L58 40" ' + S("#8b97a6", 'stroke-width="6"') + "/>" +
  '<path d="M34 40 Q34 48 50 48 Q58 48 58 40" ' + S("#8b97a6", 'stroke-width="6"') + "/>" +
  '<path d="M50 44 L50 86" ' + S("#5a6572", 'stroke-width="8"') + "/>"
);

D.plate = wrap(
  '<circle cx="50" cy="50" r="36" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<circle cx="50" cy="50" r="24" fill="#f7f3e8" fill-opacity="0.9" stroke="#2c4f9e" stroke-width="3"/>' +
  '<circle cx="50" cy="50" r="24" fill="none" stroke="#4f7fe9" stroke-width="1.5" stroke-opacity="0.4"/>' +
  '<path d="M28 34 Q34 28 40 30" ' + S("#ffffff", 'stroke-width="3" stroke-opacity="0.6"') + "/>"
);

D.milk = wrap(
  '<path d="M36 18 L64 18 L64 30 L74 44 L74 82 Q74 86 70 86 L30 86 Q26 86 26 82 L26 44 L36 30 Z" ' + F("#f7f3e8", "#b7ac95") + "/>" +
  '<path d="M36 18 L36 30 L64 30 L64 18 Z" ' + F("#8fc1ee", "#5b8fd6", 'stroke-width="3"') + "/>" +
  '<path d="M26 44 L74 44" ' + S("#b7ac95", 'stroke-width="2.5"') + "/>" +
  '<rect x="34" y="54" width="32" height="16" rx="3" ' + F("#8fc1ee", "#5b8fd6", 'stroke-width="2.5"') + "/>"
);

D.bread = wrap(
  '<path d="M16 58 Q14 30 50 26 Q86 30 84 58 Q86 78 68 80 L32 80 Q14 78 16 58 Z" ' + F("#c98a52", "#6d4423") + "/>" +
  '<path d="M34 34 Q30 50 34 66 M50 30 Q46 50 50 70 M66 34 Q70 50 66 66" ' + S("#6d4423", 'stroke-width="3" stroke-opacity="0.65"') + "/>" +
  '<path d="M26 44 Q30 40 36 42" ' + S("#e8c79b", 'stroke-width="2.5" stroke-opacity="0.7"') + "/>"
);

D.egg = wrap(
  '<path d="M14 56 Q10 40 30 34 Q46 30 58 38 Q72 32 84 42 Q94 50 84 60 Q88 72 70 74 Q50 78 30 72 Q12 70 14 56 Z" ' + F("#f7f3e8", "#b7ac95") + "/>" +
  '<circle cx="58" cy="52" r="16" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M50 46 Q54 42 60 44" ' + S("#ffffff", 'stroke-width="2.5" stroke-opacity="0.6"') + "/>"
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

/* ---- sala ---------------------------------------------------------- */

D.sofa = wrap(
  '<rect x="14" y="42" width="72" height="26" rx="8" ' + F("#5fbb63", "#37743a") + "/>" +
  '<rect x="18" y="20" width="64" height="26" rx="8" ' + F("#5fbb63", "#37743a") + "/>" +
  '<circle cx="18" cy="52" r="12" ' + F("#5fbb63", "#37743a") + "/>" +
  '<circle cx="82" cy="52" r="12" ' + F("#5fbb63", "#37743a") + "/>" +
  '<path d="M22 68 L22 80 M78 68 L78 80" ' + S("#37743a", 'stroke-width="6"') + "/>" +
  '<path d="M30 30 Q50 24 70 30" ' + S("#37743a", 'stroke-width="2.5" stroke-opacity="0.5"') + "/>"
);

D.tv = wrap(
  '<rect x="14" y="18" width="72" height="48" rx="8" ' + F("#8b97a6", "#5c6b7a") + "/>" +
  '<rect x="22" y="26" width="56" height="32" rx="3" ' + F("#8fc1ee", "#5b8fd6", 'stroke-width="3"') + "/>" +
  '<path d="M50 66 L50 78" ' + S("#5c6b7a", 'stroke-width="7"') + "/>" +
  '<ellipse cx="50" cy="82" rx="22" ry="6" ' + F("#5c6b7a", "#5c6b7a") + "/>" +
  '<path d="M30 34 Q40 30 50 34" ' + S("#ffffff", 'stroke-width="3" stroke-opacity="0.6"') + "/>"
);

D.clock = wrap(
  '<circle cx="50" cy="50" r="34" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<circle cx="50" cy="50" r="26" fill="#f7f3e8" fill-opacity="0.9" stroke="#b78f22" stroke-width="2.5"/>' +
  '<path d="M50 24 L50 30 M50 70 L50 76 M24 50 L30 50 M70 50 L76 50" ' + S("#b78f22", 'stroke-width="3.5"') + "/>" +
  '<path d="M50 50 L50 32" ' + S("#6d4423", 'stroke-width="4"') + "/>" +
  '<path d="M50 50 L64 54" ' + S("#6d4423", 'stroke-width="4"') + "/>" +
  '<circle cx="50" cy="50" r="3.5" fill="#6d4423"/>'
);

D.phone = wrap(
  '<rect x="30" y="10" width="40" height="80" rx="10" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<rect x="35" y="20" width="30" height="52" rx="2" ' + F("#dbe7fb", "#2c4f9e", 'stroke-width="2.5"') + "/>" +
  '<circle cx="50" cy="80" r="4" fill="#dbe7fb" stroke="#2c4f9e" stroke-width="2"/>' +
  '<path d="M40 30 Q46 26 52 30" ' + S("#ffffff", 'stroke-width="2.5" stroke-opacity="0.7"') + "/>"
);

D.key = wrap(
  '<circle cx="30" cy="34" r="16" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<circle cx="30" cy="34" r="6" fill="#f7f3e8" fill-opacity="0.95" stroke="#b78f22" stroke-width="3"/>' +
  '<path d="M42 44 L78 80" ' + S("#b78f22", 'stroke-width="7"') + "/>" +
  '<path d="M64 66 L72 58 M70 72 L78 64" ' + S("#b78f22", 'stroke-width="6"') + "/>"
);

/* ---- casa de banho -------------------------------------------------- */

D.soap = wrap(
  '<path d="M20 42 Q20 30 34 30 L66 30 Q80 30 80 42 L80 62 Q80 74 66 74 L34 74 Q20 74 20 62 Z" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<path d="M30 42 Q50 36 70 42" ' + S("#ffffff", 'stroke-width="3" stroke-opacity="0.7"') + "/>" +
  '<circle cx="24" cy="18" r="5" ' + F("#f27fb2", "#b04f7e", 'stroke-width="2.5"') + "/>" +
  '<circle cx="40" cy="10" r="4" ' + F("#f27fb2", "#b04f7e", 'stroke-width="2.5"') + "/>" +
  '<circle cx="60" cy="14" r="3.5" ' + F("#f27fb2", "#b04f7e", 'stroke-width="2.5"') + "/>"
);

D.towel = wrap(
  '<path d="M14 18 L86 18" ' + S("#8a5a33", 'stroke-width="6"') + "/>" +
  '<circle cx="16" cy="18" r="4" fill="#8a5a33"/><circle cx="84" cy="18" r="4" fill="#8a5a33"/>' +
  '<path d="M28 18 L28 82 Q28 86 32 86 L68 86 Q72 86 72 82 L72 18 Z" ' + F("#8fc1ee", "#5b8fd6") + "/>" +
  '<path d="M28 40 L72 40" ' + S("#5b8fd6", 'stroke-width="4"') + "/>" +
  '<path d="M44 46 L44 80 M56 46 L56 80" ' + S("#5b8fd6", 'stroke-width="2.5" stroke-opacity="0.6"') + "/>"
);

D.toothbrush = wrap(
  '<g transform="rotate(35 50 50)">' +
  '<rect x="44" y="30" width="12" height="56" rx="5" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<rect x="38" y="8" width="24" height="26" rx="6" ' + F("#e94f4f", "#96302f") + "/>" +
  '<path d="M42 12 L42 30 M50 10 L50 30 M58 12 L58 30" ' + S("#f7f3e8", 'stroke-width="3"') + "/>" +
  '<rect x="44" y="38" width="12" height="10" fill="#ffffff" fill-opacity="0.4" stroke="#2c4f9e" stroke-width="2"/>' +
  "</g>"
);

D.bathtub = wrap(
  '<path d="M14 50 L86 50 Q86 76 66 76 L34 76 Q14 76 14 50 Z" ' + F("#8fc1ee", "#5b8fd6") + "/>" +
  '<path d="M10 46 Q10 38 18 38 L82 38 Q90 38 90 46 Q90 54 82 54 L18 54 Q10 54 10 46 Z" ' + F("#dbe7fb", "#5b8fd6", 'stroke-width="3.5"') + "/>" +
  '<path d="M26 76 L24 84 M74 76 L76 84" ' + S("#5b8fd6", 'stroke-width="6"') + "/>" +
  '<path d="M30 60 q6 4 12 0 q6 -4 12 0 q6 4 12 0" ' + S("#ffffff", 'stroke-width="3" stroke-opacity="0.75"') + "/>" +
  '<circle cx="70" cy="30" r="4" ' + F("#ffffff", "#5b8fd6", 'stroke-width="2"') + "/>" +
  '<circle cx="78" cy="24" r="3" ' + F("#ffffff", "#5b8fd6", 'stroke-width="2"') + "/>"
);

D.toilet = wrap(
  '<rect x="30" y="10" width="40" height="24" rx="6" ' + F("#dbe7fb", "#8b97a6") + "/>" +
  '<rect x="26" y="32" width="48" height="9" rx="3" ' + F("#8fc1ee", "#5b8fd6", 'stroke-width="3"') + "/>" +
  '<path d="M22 46 Q22 41 28 41 L72 41 Q78 41 78 46 Q80 62 68 70 Q58 76 50 76 Q42 76 32 70 Q20 62 22 46 Z" ' + F("#f7f3e8", "#8b97a6") + "/>" +
  '<ellipse cx="50" cy="49" rx="20" ry="9" fill="#dbe7fb" fill-opacity="0.95" stroke="#8b97a6" stroke-width="3.5"/>' +
  '<ellipse cx="50" cy="49" rx="12" ry="5" fill="#8fc1ee" fill-opacity="0.9" stroke="#5b8fd6" stroke-width="2"/>' +
  '<path d="M38 74 L34 90 L66 90 L62 74 Z" ' + F("#f7f3e8", "#8b97a6") + "/>" +
  '<path d="M30 90 L70 90" ' + S("#8b97a6", 'stroke-width="4"') + "/>"
);

D.shower = wrap(
  // braço + cabeça de chuveiro + gotas a cair
  '<path d="M50 10 L50 20" ' + S("#5b8fd6", 'stroke-width="6"') + "/>" +
  '<path d="M50 20 Q50 8 66 8" ' + S("#5b8fd6", 'stroke-width="6"') + "/>" +
  '<ellipse cx="50" cy="30" rx="26" ry="10" ' + F("#8fc1ee", "#5b8fd6", 'stroke-width="4"') + "/>" +
  '<path d="M32 38 L28 46 M42 40 L40 48 M50 41 L50 49 M58 40 L60 48 M68 38 L72 46" ' + S("#5b8fd6", 'stroke-width="3.5"') + "/>" +
  '<path d="M30 58 L27 68 M42 60 L40 72 M54 61 L54 74 M66 60 L68 72 M76 58 L79 68" ' + S("#8fc1ee", 'stroke-width="3.5"') + "/>"
);

D.shampoo = wrap(
  // frasco com tampa e rótulo
  '<rect x="34" y="10" width="16" height="12" rx="3" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<path d="M32 22 Q30 26 32 30 L36 36 L36 88 Q36 92 40 92 L60 92 Q64 92 64 88 L64 36 L68 30 Q70 26 68 22 Z" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<rect x="38" y="48" width="24" height="26" rx="3" fill="#ffffff" fill-opacity="0.85" stroke="#b04f7e" stroke-width="2.5"/>' +
  '<path d="M42 56 Q50 52 58 56" ' + S("#b04f7e", 'stroke-width="2.5"') + "/>"
);

D.comb = wrap(
  // pente: cabo curvo + dentes retos
  '<path d="M16 30 Q16 16 30 16 L78 16 Q84 16 84 22 Q84 28 78 28 L30 28 Q28 28 28 30 Z" ' + F("#9b6dd6", "#5f3f8c") + "/>" +
  '<path d="M32 30 L32 84 M40 30 L40 84 M48 30 L48 84 M56 30 L56 84 M64 30 L64 84 M72 30 L72 84" ' + S("#5f3f8c", 'stroke-width="4.5"') + "/>"
);

D.duck = wrap(
  // patinho de borracha mascote: silhueta única (cabeça+corpo), bico plano, olho, sorriso, asa
  '<ellipse cx="50" cy="90" rx="26" ry="5" fill="#000" fill-opacity="0.08"/>' +
  '<path d="M50 84 Q26 84 24 62 Q22 44 38 40 Q34 28 44 20 Q56 12 62 22 Q66 30 60 38 Q78 40 80 56 Q82 68 74 76 Q78 80 76 84 Q64 90 50 84 Z" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M64 48 Q80 46 82 54 Q80 60 66 58 Z" ' + F("#f2994a", "#b5622a", 'stroke-width="3"') + "/>" +
  '<circle cx="52" cy="34" r="3.5" fill="#4a2a3a"/><circle cx="53.3" cy="32.5" r="1.3" fill="#fff"/>' +
  '<path d="M44 44 Q52 50 60 44" ' + S("#b78f22", 'stroke-width="2.5"') + "/>" +
  '<path d="M34 62 Q46 68 42 78" ' + S("#b78f22", 'stroke-width="2.5" stroke-opacity="0.6"') + "/>"
);

D.sink = wrap(
  // lavatório com pedestal + torneira
  '<path d="M50 12 L50 24" ' + S("#8b97a6", 'stroke-width="6"') + "/>" +
  '<path d="M50 24 Q64 24 64 34" ' + S("#8b97a6", 'stroke-width="6"') + "/>" +
  '<path d="M14 36 Q14 30 20 30 L80 30 Q86 30 86 36 Q88 46 78 48 Q78 58 66 58 L34 58 Q22 58 22 48 Q12 46 14 36 Z" ' + F("#dbe7fb", "#8b97a6") + "/>" +
  '<ellipse cx="50" cy="40" rx="22" ry="7" fill="#8fc1ee" fill-opacity="0.9" stroke="#5b8fd6" stroke-width="2.5"/>' +
  '<rect x="40" y="58" width="20" height="22" ' + F("#dbe7fb", "#8b97a6") + "/>" +
  '<path d="M30 80 L70 80" ' + S("#8b97a6", 'stroke-width="6"') + "/>"
);

D.toilet_paper = wrap(
  // rolo com folha ondulada a cair, riscas de picotado
  '<ellipse cx="50" cy="30" rx="30" ry="16" ' + F("#f7f3e8", "#b7ac95") + "/>" +
  '<ellipse cx="50" cy="30" rx="12" ry="7" fill="#e8dfc8" stroke="#b7ac95" stroke-width="3"/>' +
  '<path d="M20 30 L20 66 Q20 74 30 76 L70 76 Q80 74 80 66 L80 30" ' + F("#f7f3e8", "#b7ac95") + "/>" +
  '<path d="M20 66 Q30 72 40 66 Q50 60 60 66 Q70 72 80 66" ' + S("#b7ac95", 'stroke-width="3"') + "/>" +
  '<path d="M28 42 L28 58 M38 44 L38 60 M62 44 L62 60 M72 42 L72 58" ' + S("#b7ac95", 'stroke-width="2" stroke-opacity="0.5"') + "/>"
);

D.mirror = wrap(
  '<ellipse cx="50" cy="42" rx="32" ry="36" ' + F("#8fc1ee", "#5b8fd6", 'stroke-width="8"') + "/>" +
  '<ellipse cx="50" cy="42" rx="24" ry="28" fill="#dbe7fb" fill-opacity="0.85" stroke="#5b8fd6" stroke-width="2.5"/>' +
  '<path d="M38 24 L44 60" ' + S("#ffffff", 'stroke-width="4" stroke-opacity="0.8"') + "/>" +
  '<path d="M50 78 L50 88" ' + S("#5b8fd6", 'stroke-width="6"') + "/>" +
  '<ellipse cx="50" cy="90" rx="16" ry="4" ' + F("#5b8fd6", "#5b8fd6") + "/>"
);

D.plant = wrap(
  '<path d="M32 78 L36 50 L64 50 L68 78 Q68 82 64 82 L36 82 Q32 82 32 78 Z" ' + F("#c98a52", "#6d4423") + "/>" +
  '<path d="M38 50 L40 40 M62 50 L60 40" ' + S("#6d4423", 'stroke-width="2.5" stroke-opacity="0.6"') + "/>" +
  '<path d="M50 50 Q50 24 50 14" ' + S("#37743a", 'stroke-width="5"') + "/>" +
  '<path d="M50 30 Q30 24 26 40 Q42 42 50 30 Z" ' + F("#5fbb63", "#37743a", 'stroke-width="3"') + "/>" +
  '<path d="M50 22 Q70 16 74 32 Q58 34 50 22 Z" ' + F("#5fbb63", "#37743a", 'stroke-width="3"') + "/>" +
  '<path d="M50 40 Q34 38 30 50 Q44 52 50 40 Z" ' + F("#5fbb63", "#37743a", 'stroke-width="3"') + "/>" +
  '<path d="M50 32 Q66 28 70 44 Q54 44 50 32 Z" ' + F("#5fbb63", "#37743a", 'stroke-width="3"') + "/>"
);

D.picture = wrap(
  '<rect x="14" y="14" width="72" height="60" rx="4" ' + F("#c98a52", "#6d4423") + "/>" +
  '<rect x="22" y="22" width="56" height="44" fill="#8fc1ee" fill-opacity="0.9" stroke="#6d4423" stroke-width="3"/>' +
  '<circle cx="65" cy="34" r="7" ' + F("#f2c94c", "#b78f22", 'stroke-width="2.5"') + "/>" +
  '<path d="M22 62 Q34 44 46 56 Q56 44 78 60 L78 66 L22 66 Z" ' + F("#5fbb63", "#37743a", 'stroke-width="3"') + "/>" +
  '<path d="M50 82 L50 86" ' + S("#6d4423", 'stroke-width="4"') + "/>"
);

D.remote = wrap(
  '<rect x="36" y="10" width="28" height="80" rx="12" ' + F("#8b97a6", "#5c6b7a") + "/>" +
  '<rect x="42" y="20" width="16" height="12" rx="3" ' + F("#4f7fe9", "#2c4f9e", 'stroke-width="2.5"') + "/>" +
  '<circle cx="50" cy="42" r="6" ' + F("#e94f4f", "#96302f", 'stroke-width="2.5"') + "/>" +
  '<circle cx="43" cy="58" r="4" fill="#dbe7fb" stroke="#5c6b7a" stroke-width="2"/>' +
  '<circle cx="57" cy="58" r="4" fill="#dbe7fb" stroke="#5c6b7a" stroke-width="2"/>' +
  '<circle cx="43" cy="70" r="4" fill="#dbe7fb" stroke="#5c6b7a" stroke-width="2"/>' +
  '<circle cx="57" cy="70" r="4" fill="#dbe7fb" stroke="#5c6b7a" stroke-width="2"/>'
);

D.shelf = wrap(
  '<path d="M20 30 L20 88 M80 30 L80 88" ' + S("#6d4423", 'stroke-width="6"') + "/>" +
  '<rect x="16" y="30" width="68" height="9" rx="3" ' + F("#a76b3d", "#6d4423") + "/>" +
  '<rect x="16" y="66" width="68" height="9" rx="3" ' + F("#a76b3d", "#6d4423") + "/>" +
  '<rect x="26" y="10" width="16" height="20" rx="2" ' + F("#5fbb63", "#37743a", 'stroke-width="3"') + "/>" +
  '<path d="M30 14 h8 M30 18 h8 M30 22 h8" stroke="#f7f3e8" stroke-width="1.8" stroke-opacity="0.8"/>' +
  '<path d="M58 46 L52 66 L70 66 L64 46 Q61 42 58 46 Z" ' + F("#f2c94c", "#b78f22", 'stroke-width="3"') + "/>" +
  '<path d="M56 46 Q61 40 66 46" ' + S("#b78f22", 'stroke-width="3"') + "/>"
);

D.vase = wrap(
  '<path d="M38 10 L62 10 L58 34 Q72 44 70 60 Q68 84 50 84 Q32 84 30 60 Q28 44 42 34 Z" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<ellipse cx="50" cy="10" rx="12" ry="4" ' + F("#dbe7fb", "#2c4f9e", 'stroke-width="3"') + "/>" +
  '<path d="M40 50 Q50 58 60 50" ' + S("#dbe7fb", 'stroke-width="3" stroke-opacity="0.7"') + "/>" +
  '<path d="M38 66 Q50 72 62 66" ' + S("#dbe7fb", 'stroke-width="3" stroke-opacity="0.5"') + "/>"
);

D.candle = wrap(
  '<rect x="38" y="38" width="24" height="48" rx="4" ' + F("#f7f3e8", "#b7ac95") + "/>" +
  '<path d="M44 44 h12 M44 56 h12 M44 68 h12" stroke="#b7ac95" stroke-width="2.5" stroke-opacity="0.6"/>' +
  '<path d="M50 38 L50 24" ' + S("#4a4344", 'stroke-width="3.5"') + "/>" +
  '<path d="M50 10 Q40 20 46 30 Q50 34 54 30 Q60 20 50 10 Z" ' + F("#f2c94c", "#b78f22", 'stroke-width="3"') + "/>" +
  '<path d="M50 16 Q46 22 49 27" ' + S("#e94f4f", 'stroke-width="2.5" stroke-opacity="0.7"') + "/>"
);

/* ---- parque ---------------------------------------------------------- */

D.swing = wrap(
  // A-frame de postes de madeira + barra de topo + duas cordas + assento
  '<path d="M18 88 L34 20 M50 20 L34 20" ' + S("#a76b3d", 'stroke-width="7"') + "/>" +
  '<path d="M82 88 L66 20 M50 20 L66 20" ' + S("#a76b3d", 'stroke-width="7"') + "/>" +
  '<path d="M34 20 L66 20" ' + S("#8a5a33", 'stroke-width="7"') + "/>" +
  '<path d="M42 20 L38 70" ' + S("#6d4423", 'stroke-width="4"') + "/>" +
  '<path d="M58 20 L62 70" ' + S("#6d4423", 'stroke-width="4"') + "/>" +
  '<path d="M34 70 L66 70 Q68 70 68 74 L68 78 Q68 82 64 82 L36 82 Q32 82 32 78 L32 74 Q32 70 34 70 Z" ' + F("#e94f4f", "#96302f") + "/>"
);

D.slide = wrap(
  // escada de um lado (dois postes retos + degraus) + rampa inclinada com curva final
  '<path d="M22 88 L22 22 M34 88 L34 22" ' + S("#8a5a33", 'stroke-width="7"') + "/>" +
  '<path d="M22 76 L34 76 M22 62 L34 62 M22 48 L34 48 M22 34 L34 34" ' + S("#6d4423", 'stroke-width="5"') + "/>" +
  '<path d="M34 26 L80 52 Q90 58 84 68 Q78 78 68 72 L54 64 Z" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M40 32 L72 51" ' + S("#f7f3e8", 'stroke-width="3" stroke-opacity="0.6"') + "/>"
);

D.tree = wrap(
  // copa em nuvem grande + tronco sólido
  '<path d="M50 76 L46 92 M50 76 L54 92" ' + S("#6d4423", 'stroke-width="8"') + "/>" +
  '<rect x="44" y="60" width="12" height="22" ' + F("#a76b3d", "#6d4423") + "/>" +
  '<path d="M28 56 Q14 54 16 40 Q17 26 32 28 Q34 14 50 14 Q66 14 68 28 Q83 26 84 40 Q86 54 72 56 Q74 66 60 68 Q50 70 40 68 Q26 66 28 56 Z" ' + F("#5fbb63", "#37743a") + "/>" +
  '<path d="M34 34 Q44 28 54 34 M50 24 Q60 22 66 30" ' + S("#7fd083", 'stroke-width="3" stroke-opacity="0.6"') + "/>"
);

D.flower = wrap(
  // centro redondo + 5-6 pétalas + caule com folha
  '<path d="M50 60 L50 92" ' + S("#37743a", 'stroke-width="6"') + "/>" +
  '<path d="M50 76 Q64 74 66 62 Q54 64 50 76 Z" ' + F("#5fbb63", "#37743a", 'stroke-width="3"') + "/>" +
  '<ellipse cx="50" cy="30" rx="13" ry="15" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<ellipse cx="30" cy="42" rx="13" ry="15" transform="rotate(-60 30 42)" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<ellipse cx="70" cy="42" rx="13" ry="15" transform="rotate(60 70 42)" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<ellipse cx="38" cy="18" rx="13" ry="15" transform="rotate(-25 38 18)" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<ellipse cx="62" cy="18" rx="13" ry="15" transform="rotate(25 62 18)" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<circle cx="50" cy="32" r="12" ' + F("#f2c94c", "#b78f22") + "/>"
);

D.sun = wrap(
  // círculo + raios triangulares + carinha feliz (estilo mascote)
  '<path d="M50 4 L50 18 M50 82 L50 96 M4 50 L18 50 M82 50 L96 50 M17 17 L27 27 M73 73 L83 83 M83 17 L73 27 M27 73 L17 83" ' + S("#f2c94c", 'stroke-width="7"') + "/>" +
  '<circle cx="50" cy="50" r="30" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<circle cx="41" cy="46" r="3.5" fill="#6d4423"/><circle cx="59" cy="46" r="3.5" fill="#6d4423"/>' +
  '<path d="M40 58 Q50 66 60 58" ' + S("#6d4423", 'stroke-width="3.5"') + "/>"
);

D.dog = wrap(
  // cachorrinho castanho ao estilo das mascotes: cabeça grande, orelhas caídas, focinho
  '<ellipse cx="50" cy="90" rx="24" ry="7" fill="#000" fill-opacity="0.06"/>' +
  '<path d="M28 30 Q16 34 15 50 Q14 64 24 63 Q32 62 33 48 Q34 36 36 31 Z" ' + F("#c98a52", "#6d4423") + "/>" +
  '<path d="M72 30 Q84 34 85 50 Q86 64 76 63 Q68 62 67 48 Q66 36 64 31 Z" ' + F("#c98a52", "#6d4423") + "/>" +
  '<circle cx="50" cy="48" r="26" ' + F("#e8c79b", "#6d4423") + "/>" +
  '<ellipse cx="50" cy="58" rx="13" ry="10" fill="#f7f3e8" fill-opacity="0.95" stroke="#6d4423" stroke-width="3"/>' +
  '<ellipse cx="50" cy="54" rx="5" ry="4" fill="#4a2a2a"/>' +
  '<path d="M50 58 L50 62 M50 62 Q45 66 41 63 M50 62 Q55 66 59 63" ' + S("#4a2a2a", 'stroke-width="2.5"') + "/>" +
  '<circle cx="39" cy="42" r="4.5" fill="#3a2a1a"/><circle cx="61" cy="42" r="4.5" fill="#3a2a1a"/>' +
  '<circle cx="40.5" cy="40.5" r="1.6" fill="#fff"/><circle cx="62.5" cy="40.5" r="1.6" fill="#fff"/>' +
  '<path d="M46 68 Q50 72 54 68 L53 76 Q50 79 47 76 Z" fill="#e0596e" fill-opacity="0.85" stroke="#96302f" stroke-width="2"/>'
);

D.cat = wrap(
  // gato laranja: orelhas pontiagudas, bigodes, nariz rosa
  '<ellipse cx="50" cy="90" rx="24" ry="7" fill="#000" fill-opacity="0.06"/>' +
  '<path d="M26 34 L20 12 L42 26 Z" ' + F("#f2994a", "#b5622a") + "/>" +
  '<path d="M74 34 L80 12 L58 26 Z" ' + F("#f2994a", "#b5622a") + "/>" +
  '<path d="M28 26 L24 16 L36 24 Z" ' + F("#f5b8d4", "#b5622a", 'stroke-width="2"') + "/>" +
  '<path d="M72 26 L76 16 L64 24 Z" ' + F("#f5b8d4", "#b5622a", 'stroke-width="2"') + "/>" +
  '<circle cx="50" cy="48" r="26" ' + F("#f2994a", "#b5622a") + "/>" +
  '<circle cx="39" cy="44" r="4.5" fill="#2c3a1a"/><circle cx="61" cy="44" r="4.5" fill="#2c3a1a"/>' +
  '<circle cx="40.5" cy="42.5" r="1.6" fill="#fff"/><circle cx="62.5" cy="42.5" r="1.6" fill="#fff"/>' +
  '<path d="M50 54 L46 58 L54 58 Z" fill="#f5b8d4" stroke="#b5622a" stroke-width="2"/>' +
  '<path d="M50 58 Q45 63 40 61 M50 58 Q55 63 60 61" ' + S("#7a4520", 'stroke-width="2.5"') + "/>" +
  '<path d="M14 46 L30 50 M14 56 L30 54 M86 46 L70 50 M86 56 L70 54" ' + S("#7a4520", 'stroke-width="2.5"') + "/>"
);

D.bird = wrap(
  // corpo redondo azul + asa + bico + patas de palito, de pé
  '<path d="M42 78 L42 88 M58 78 L58 88 M38 88 L46 88 M54 88 L62 88" ' + S("#b78f22", 'stroke-width="3.5"') + "/>" +
  '<circle cx="50" cy="46" r="26" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<path d="M30 44 Q19 46 21 58 Q23 67 33 63 Q39 59 37 48 Z" ' + F("#3a66c4", "#24417e") + "/>" +
  '<circle cx="63" cy="38" r="4" fill="#1c2740"/>' +
  '<circle cx="64.3" cy="36.7" r="1.4" fill="#fff"/>' +
  '<path d="M78 40 L90 44 L78 48 Z" ' + F("#f2c94c", "#b78f22") + "/>"
);

D.butterfly = wrap(
  // borboleta simétrica: 4 asas roxas com pintas, corpo e antenas ao centro
  '<path d="M48 30 Q20 6 8 26 Q2 42 22 46 Q40 48 48 34 Z" ' + F("#9b6dd6", "#5f3f8c") + "/>" +
  '<path d="M52 30 Q80 6 92 26 Q98 42 78 46 Q60 48 52 34 Z" ' + F("#9b6dd6", "#5f3f8c") + "/>" +
  '<path d="M48 46 Q26 52 20 70 Q16 84 32 82 Q44 78 48 60 Z" ' + F("#b98be0", "#5f3f8c") + "/>" +
  '<path d="M52 46 Q74 52 80 70 Q84 84 68 82 Q56 78 52 60 Z" ' + F("#b98be0", "#5f3f8c") + "/>" +
  '<circle cx="20" cy="26" r="4.5" fill="#5f3f8c" fill-opacity="0.6"/>' +
  '<circle cx="80" cy="26" r="4.5" fill="#5f3f8c" fill-opacity="0.6"/>' +
  '<circle cx="30" cy="68" r="4" fill="#5f3f8c" fill-opacity="0.6"/>' +
  '<circle cx="70" cy="68" r="4" fill="#5f3f8c" fill-opacity="0.6"/>' +
  '<path d="M50 22 L50 74" ' + S("#3a2a1a", 'stroke-width="5"') + "/>" +
  '<path d="M50 22 Q44 12 38 10 M50 22 Q56 12 62 10" ' + S("#3a2a1a", 'stroke-width="3.5"') + "/>" +
  '<circle cx="38" cy="10" r="2.5" fill="#3a2a1a"/><circle cx="62" cy="10" r="2.5" fill="#3a2a1a"/>'
);

D.bee = wrap(
  // abelha simples e amigável, de frente: corpo oval às riscas ao centro,
  // 2 asas atrás por cima, cabecinha redonda por cima do corpo com olhos e
  // antenas, ferrão pequeno em baixo — como as mascotes dog/cat/bird
  '<ellipse cx="28" cy="38" rx="20" ry="14" fill="#dbe7fb" fill-opacity="0.75" stroke="#8fc1ee" stroke-width="2.5" transform="rotate(-15 28 38)"/>' +
  '<ellipse cx="72" cy="38" rx="20" ry="14" fill="#dbe7fb" fill-opacity="0.75" stroke="#8fc1ee" stroke-width="2.5" transform="rotate(15 72 38)"/>' +
  '<ellipse cx="50" cy="66" rx="30" ry="22" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M24 54 Q26 66 24 78 M38 50 Q40 66 38 82 M62 50 Q60 66 62 82 M76 54 Q74 66 76 78" ' +
  S("#3a2a1a", 'stroke-width="6"') + "/>" +
  '<circle cx="50" cy="34" r="18" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<circle cx="43" cy="32" r="3.5" fill="#3a2a1a"/><circle cx="57" cy="32" r="3.5" fill="#3a2a1a"/>' +
  '<circle cx="44.3" cy="30.6" r="1.3" fill="#fff"/><circle cx="58.3" cy="30.6" r="1.3" fill="#fff"/>' +
  '<path d="M44 40 Q50 44 56 40" ' + S("#96302f", 'stroke-width="2.5"') + "/>" +
  '<path d="M42 18 Q38 8 32 6 M58 18 Q62 8 68 6" ' + S("#3a2a1a", 'stroke-width="3.5"') + "/>" +
  '<circle cx="32" cy="6" r="2.4" fill="#3a2a1a"/><circle cx="68" cy="6" r="2.4" fill="#3a2a1a"/>' +
  '<path d="M50 88 L50 96" ' + S("#3a2a1a", 'stroke-width="4"') + "/>"
);

D.cloud = wrap(
  // nuvem fofa: 3 bolhas sobrepostas
  '<path d="M22 68 Q10 68 10 54 Q10 42 24 42 Q26 26 46 26 Q64 26 68 40 Q86 40 86 56 Q86 68 72 68 Z" ' + F("#8fc1ee", "#5b8fd6") + "/>" +
  '<path d="M28 56 Q40 50 52 56 Q64 50 76 56" ' + S("#ffffff", 'stroke-width="3" stroke-opacity="0.6"') + "/>"
);

D.rain = wrap(
  // nuvem em cima + pingas azuis em queda
  '<path d="M20 44 Q10 44 10 32 Q10 22 22 22 Q24 10 42 10 Q58 10 62 22 Q78 22 78 36 Q78 44 66 44 Z" ' + F("#8fc1ee", "#5b8fd6") + "/>" +
  '<path d="M28 56 Q24 64 28 70 Q32 76 28 82" ' + S("#5b8fd6", 'stroke-width="6"') + "/>" +
  '<path d="M50 56 Q46 64 50 70 Q54 76 50 82" ' + S("#5b8fd6", 'stroke-width="6"') + "/>" +
  '<path d="M72 56 Q68 64 72 70 Q76 76 72 82" ' + S("#5b8fd6", 'stroke-width="6"') + "/>"
);

D.rainbow = wrap(
  // arco de 4 faixas de cor entre duas nuvens pequenas
  '<path d="M8 82 Q8 14 50 14 Q92 14 92 82" ' + S("#e94f4f", 'stroke-width="9"') + "/>" +
  '<path d="M16 82 Q16 22 50 22 Q84 22 84 82" ' + S("#f2c94c", 'stroke-width="9"') + "/>" +
  '<path d="M24 82 Q24 30 50 30 Q76 30 76 82" ' + S("#5fbb63", 'stroke-width="9"') + "/>" +
  '<path d="M32 82 Q32 38 50 38 Q68 38 68 82" ' + S("#4f7fe9", 'stroke-width="9"') + "/>" +
  '<path d="M12 78 Q4 78 4 70 Q4 63 12 63 Q13 55 22 55 Q30 55 31 63 Q38 63 38 71 Q38 78 30 78 Z" ' + F("#ffffff", "#c9c2ae", 'stroke-width="3"') + "/>" +
  '<path d="M70 78 Q62 78 62 70 Q62 63 70 63 Q71 55 80 55 Q88 55 89 63 Q96 63 96 71 Q96 78 88 78 Z" ' + F("#ffffff", "#c9c2ae", 'stroke-width="3"') + "/>"
);

D.kite = wrap(
  // losango às cores com cruz interna, riscas e cauda de laços — tudo
  // dentro do viewBox 100x100
  '<path d="M50 4 L78 34 L50 76 L22 34 Z" ' + F("#f2994a", "#b5622a") + "/>" +
  '<path d="M50 4 L78 34 L50 34 Z" fill="#f2c94c" fill-opacity="0.82" stroke="#b5622a" stroke-width="4"/>' +
  '<path d="M50 34 L78 34 L50 76 Z" fill="#e94f4f" fill-opacity="0.82" stroke="#b5622a" stroke-width="4"/>' +
  '<path d="M50 4 L50 76 M22 34 L78 34" ' + S("#b5622a", 'stroke-width="3"') + "/>" +
  '<path d="M50 76 Q46 80 50 84 Q54 87 50 90 Q46 93 50 96" ' + S("#5f3f8c", 'stroke-width="4"') + "/>" +
  '<circle cx="50" cy="80" r="3.5" fill="#9b6dd6"/><circle cx="50" cy="87" r="3.5" fill="#9b6dd6"/><circle cx="50" cy="94" r="3.5" fill="#9b6dd6"/>'
);

D.bike = wrap(
  // 2 rodas grandes + quadro simples com tubos retos (triângulo traseiro +
  // tubo do selim + tubo do guiador) + selim e guiador retos
  '<circle cx="24" cy="74" r="19" fill="none" stroke="#231f20" stroke-width="6"/>' +
  '<circle cx="76" cy="74" r="19" fill="none" stroke="#231f20" stroke-width="6"/>' +
  '<circle cx="24" cy="74" r="4" fill="#8b97a6"/><circle cx="76" cy="74" r="4" fill="#8b97a6"/>' +
  '<path d="M24 74 L50 74 M24 74 L58 30 M50 74 L58 30 M50 74 L76 74 M58 30 L76 74" ' +
  S("#e94f4f", 'stroke-width="6"') + "/>" +
  '<path d="M50 74 L52 62" ' + S("#96302f", 'stroke-width="6"') + "/>" +
  '<rect x="42" y="56" width="20" height="7" rx="3" ' + F("#231f20", "#231f20") + "/>" +
  '<path d="M58 30 L58 20" ' + S("#96302f", 'stroke-width="6"') + "/>" +
  '<rect x="46" y="14" width="24" height="7" rx="3" ' + F("#231f20", "#231f20") + "/>" +
  '<rect x="46" y="70" width="10" height="8" rx="3" ' + F("#231f20", "#231f20") + "/>"
);

D.grass = wrap(
  // tufo de relva: várias lâminas verdes em leque, saindo de uma base
  '<path d="M10 92 Q10 60 20 40 Q22 60 24 92 Z" ' + F("#5fbb63", "#37743a") + "/>" +
  '<path d="M30 92 Q26 50 40 24 Q38 56 38 92 Z" ' + F("#5fbb63", "#37743a") + "/>" +
  '<path d="M46 92 Q46 54 50 20 Q54 54 54 92 Z" ' + F("#71cf74", "#37743a") + "/>" +
  '<path d="M62 92 Q62 56 60 24 Q74 50 70 92 Z" ' + F("#5fbb63", "#37743a") + "/>" +
  '<path d="M76 92 Q76 60 78 40 Q88 60 90 92 Z" ' + F("#5fbb63", "#37743a") + "/>"
);

/* ---- carro (extra) ------------------------------------------------- */

D.wheel = wrap(
  // pneu maior + jante com raios (reutiliza estilo da roda do carro)
  '<circle cx="50" cy="50" r="34" ' + F("#4a4344", "#231f20") + "/>" +
  '<circle cx="50" cy="50" r="18" fill="#8b97a6" fill-opacity="0.9" stroke="#5c6b7a" stroke-width="3.5"/>' +
  '<path d="M50 50 L50 34 M50 50 L64 58 M50 50 L36 58" ' + S("#5c6b7a", 'stroke-width="4"') + "/>" +
  '<circle cx="50" cy="50" r="5" fill="#f7f3e8" stroke="#5c6b7a" stroke-width="2.5"/>'
);

D.seat_belt = wrap(
  // cadeira de carro vista de frente: apoio de cabeça + costas + assento,
  // com o cinto cinzento em diagonal POR CIMA e fivela dourada
  '<rect x="34" y="8" width="32" height="24" rx="12" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<path d="M22 30 Q20 28 22 24 L26 20 Q30 18 34 22 L34 68 Q34 74 28 74 Q22 74 22 68 Z" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<path d="M78 30 Q80 28 78 24 L74 20 Q70 18 66 22 L66 68 Q66 74 72 74 Q78 74 78 68 Z" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<rect x="26" y="24" width="48" height="50" rx="10" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<rect x="22" y="74" width="56" height="16" rx="8" ' + F("#3a66c4", "#2c4f9e") + "/>" +
  '<path d="M32 24 Q50 44 54 74" ' + S("#8b97a6", 'stroke-width="10"') + "/>" +
  '<rect x="44" y="62" width="18" height="18" rx="4" ' + F("#f2c94c", "#b78f22", 'stroke-width="3"') + "/>" +
  '<circle cx="53" cy="71" r="3.5" fill="#6d4423"/>'
);

D.road = wrap(
  // estrada em perspetiva + linha central tracejada + laterais verdes
  '<path d="M0 90 Q50 88 100 90 L100 100 L0 100 Z" ' + F("#5fbb63", "#37743a", 'stroke-width="0"') + "/>" +
  '<path d="M0 22 Q50 20 100 22 L100 8 L0 8 Z" ' + F("#5fbb63", "#37743a", 'stroke-width="0"') + "/>" +
  '<path d="M12 90 Q30 50 42 20 L58 20 Q70 50 88 90 Z" ' + F("#8b97a6", "#5c6b7a") + "/>" +
  '<path d="M50 26 L50 38 M50 48 L50 60 M50 70 L50 82" ' + S("#f7f3e8", 'stroke-width="4"') + "/>"
);

D.traffic_light = wrap(
  // caixa arredondada escura numa haste, com 3 luzes
  '<path d="M50 62 L50 92" ' + S("#5c6b7a", 'stroke-width="7"') + "/>" +
  '<ellipse cx="50" cy="92" rx="16" ry="4" ' + F("#5c6b7a", "#5c6b7a") + "/>" +
  '<rect x="32" y="10" width="36" height="56" rx="12" ' + F("#4a4344", "#231f20") + "/>" +
  '<circle cx="50" cy="26" r="9" ' + F("#e94f4f", "#96302f") + "/>" +
  '<circle cx="50" cy="38" r="9" fill="#f2c94c" fill-opacity="0.4" stroke="#b78f22" stroke-width="3"/>' +
  '<circle cx="50" cy="50" r="9" ' + F("#5fbb63", "#37743a") + "/>"
);

/* ---- escola (extra) -------------------------------------------------- */

D.glue = wrap(
  // frasco de cola laranja: corpo, ombro estreitando, gargalo, tampa/bico cónico
  '<path d="M28 40 L28 82 Q28 88 34 88 L66 88 Q72 88 72 82 L72 40 Q72 30 60 26 L60 20 L40 20 L40 26 Q28 30 28 40 Z" ' + F("#f2994a", "#b5622a") + "/>" +
  '<rect x="38" y="10" width="24" height="12" rx="3" ' + F("#c98a52", "#6d4423") + "/>" +
  '<path d="M45 4 L55 4 L52 10 L48 10 Z" ' + F("#8b97a6", "#5c6b7a", 'stroke-width="2.5"') + "/>" +
  '<path d="M34 50 Q50 44 66 50" ' + S("#ffffff", 'stroke-width="3" stroke-opacity="0.7"') + "/>" +
  '<rect x="34" y="60" width="32" height="18" rx="3" fill="#ffffff" fill-opacity="0.85" stroke="#b5622a" stroke-width="2.5"/>'
);

D.paper = wrap(
  // folha branca com canto dobrado + linhas azuis claras (pauta)
  '<path d="M22 12 L66 12 L78 24 L78 88 L22 88 Z" ' + F("#f7f3e8", "#b7ac95") + "/>" +
  '<path d="M66 12 L66 24 L78 24 Z" fill="#dcd5c2" stroke="#b7ac95" stroke-width="2.5"/>' +
  '<path d="M32 34 L70 34 M32 44 L70 44 M32 54 L70 54 M32 64 L70 64 M32 74 L58 74" ' + S("#8fc1ee", 'stroke-width="3" stroke-opacity="0.85"') + "/>"
);

D.paint = wrap(
  // pote de tinta vermelho com tinta a transbordar pela borda + pincel encostado
  '<path d="M24 46 L28 82 Q28 88 34 88 L66 88 Q72 88 72 82 L76 46 Z" ' + F("#e94f4f", "#96302f") + "/>" +
  '<ellipse cx="50" cy="46" rx="26" ry="8" ' + F("#e94f4f", "#96302f") + "/>" +
  '<path d="M30 44 Q34 54 26 58 Q34 60 32 68" ' + F("#e94f4f", "#96302f", 'stroke-width="3"') + "/>" +
  '<ellipse cx="50" cy="45" rx="18" ry="5.5" fill="#f27272" fill-opacity="0.9" stroke="#96302f" stroke-width="2"/>' +
  '<g transform="rotate(28 74 40)">' +
  '<rect x="70" y="6" width="8" height="40" rx="3" ' + F("#c98a52", "#6d4423") + "/>" +
  '<path d="M70 46 L78 46 L76 60 Q74 64 70 60 Z" ' + F("#8b97a6", "#5c6b7a", 'stroke-width="2.5"') + "/>" +
  '<path d="M70 60 Q68 68 71 74 Q74 68 74 62 Q77 68 74 74" ' + F("#e94f4f", "#96302f", 'stroke-width="2.5"') + "/>" +
  "</g>"
);

/* ---- corpo ------------------------------------------------------- */

D.head = wrap(
  // cara redonda sorridente com cabelo, estilo mascote amigável
  '<path d="M28 26 Q50 8 72 26 Q80 30 76 22 Q66 8 50 8 Q34 8 24 22 Q20 30 28 26 Z" ' + F("#a76b3d", "#6d4423") + "/>" +
  '<circle cx="50" cy="52" r="34" ' + F("#e8c79b", "#a3835c") + "/>" +
  '<circle cx="39" cy="46" r="4.5" fill="#4a2a3a"/><circle cx="61" cy="46" r="4.5" fill="#4a2a3a"/>' +
  '<circle cx="40.5" cy="44.5" r="1.6" fill="#fff"/><circle cx="62.5" cy="44.5" r="1.6" fill="#fff"/>' +
  '<path d="M40 66 Q50 76 60 66" ' + S("#96302f", 'stroke-width="4"') + "/>" +
  '<circle cx="29" cy="58" r="5" fill="#f27fb2" fill-opacity="0.55"/>' +
  '<circle cx="71" cy="58" r="5" fill="#f27fb2" fill-opacity="0.55"/>'
);

D.hand = wrap(
  // palma aberta vista de frente: UM único path fechado (contorno exterior
  // com reentrâncias entre os dedos) — polegar à esquerda, 4 dedos de
  // alturas diferentes, pulso em baixo. Só vincos finos por dentro.
  '<path d="M34 86 L30 60 Q28 54 22 50 Q14 44 16 38 Q18 32 24 36 L32 42' +
  ' L32 24 Q32 16 37 16 Q42 16 42 24 L42 46 L44 46' +
  ' L44 16 Q44 8 49 8 Q54 8 54 16 L54 46 L56 46' +
  ' L56 20 Q56 12 61 12 Q66 12 66 20 L66 46 L68 46' +
  ' L68 30 Q68 23 72 23 Q76 23 76 30 L76 52 Q76 64 70 72 L66 86 Z" ' + F("#e8c79b", "#a3835c") + "/>" +
  '<path d="M34 50 Q50 56 66 50" ' + S("#a3835c", 'stroke-width="2.5" stroke-opacity="0.4"') + "/>"
);

D.foot = wrap(
  // pé descalço de perfil, apontado para a esquerda: tornozelo em cima à
  // direita, peito do pé a descer para a esquerda, dedão como bossa na
  // ponta esquerda, 2 dedos pequenos como bossas na sola à frente, sola
  // plana, calcanhar redondo à direita — UM único path fechado
  '<path d="M60 10 L56 42 Q42 46 30 56 Q20 64 19 71 Q19 77 25 78 Q29 81 33 78 Q37 81 42 78 L72 78 Q84 78 84 64 Q84 52 78 44 L76 10 Z" ' + F("#e8c79b", "#a3835c") + "/>" +
  '<path d="M34 62 q14 -6 30 -2" ' + S("#c9a97a", 'stroke-width="3" stroke-opacity="0.5"') + "/>"
);

D.eye = wrap(
  // olho grande com íris azul e pestanas
  '<path d="M8 50 Q50 12 92 50 Q50 88 8 50 Z" ' + F("#f7f3e8", "#6d4423") + "/>" +
  '<circle cx="50" cy="50" r="24" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<circle cx="50" cy="50" r="12" fill="#1c2740"/>' +
  '<circle cx="44" cy="43" r="4" fill="#fff"/>' +
  '<path d="M14 42 L4 34 M22 30 L16 20 M34 22 L32 10" ' + S("#6d4423", 'stroke-width="4.5"') + "/>" +
  '<path d="M86 42 L96 34 M78 30 L84 20 M66 22 L68 10" ' + S("#6d4423", 'stroke-width="4.5"') + "/>"
);

D.nose = wrap(
  // nariz visto de frente, bem simples: forma de sino (ponte estreita + bolbo largo em baixo) com 2 narinas grandes
  '<path d="M50 6 Q42 6 40 16 L34 52 Q14 58 14 76 Q14 92 50 92 Q86 92 86 76 Q86 58 66 52 L60 16 Q58 6 50 6 Z" ' + F("#e8c79b", "#a3835c") + "/>" +
  '<ellipse cx="34" cy="76" rx="10" ry="8" fill="#a3835c" fill-opacity="0.6"/>' +
  '<ellipse cx="66" cy="76" rx="10" ry="8" fill="#a3835c" fill-opacity="0.6"/>' +
  '<path d="M46 20 Q40 40 34 50" ' + S("#f7f3e8", 'stroke-width="4" stroke-opacity="0.6"') + "/>"
);

D.mouth = wrap(
  // sorriso grande com lábios e dentes
  '<path d="M12 42 Q50 26 88 42 Q86 66 50 74 Q14 66 12 42 Z" ' + F("#e0596e", "#96302f") + "/>" +
  '<path d="M18 44 Q50 34 82 44 L80 52 Q50 46 20 52 Z" fill="#ffffff" fill-opacity="0.95" stroke="#96302f" stroke-width="2.5"/>' +
  '<path d="M22 58 Q50 68 78 58 Q74 66 50 70 Q26 66 22 58 Z" ' + F("#c9425a", "#96302f", 'stroke-width="2.5"') + "/>"
);

D.ear = wrap(
  // orelha grande e simples: oval exterior + lóbulo saliente em baixo + espiral em C dentro (bem espaçada, sem confundir com feijão)
  '<ellipse cx="48" cy="46" rx="34" ry="40" ' + F("#e8c79b", "#a3835c") + "/>" +
  '<ellipse cx="46" cy="82" rx="13" ry="11" ' + F("#e8c79b", "#a3835c", 'stroke-width="4"') + "/>" +
  '<path d="M56 24 Q34 26 34 46 Q34 62 50 66" ' + S("#a3835c", 'stroke-width="5"') + "/>" +
  '<path d="M50 36 Q42 38 42 46" ' + S("#a3835c", 'stroke-width="4" stroke-opacity="0.7"') + "/>"
);

D.hair = wrap(
  // cabelo comprido como PROTAGONISTA: cara pequena e simples no centro, madeixas
  // castanhas volumosas e onduladas a cair dos dois lados até abaixo do queixo
  '<path d="M50 6 Q20 6 16 34 Q12 54 16 74 Q19 88 26 92 Q22 76 24 60 Q26 46 30 56 Q28 70 34 82 Q34 64 38 52 Q40 66 40 78 Q44 66 42 50 L58 50 Q56 66 60 78 Q60 66 62 52 Q66 64 66 82 Q72 70 70 56 Q74 46 76 60 Q78 76 74 92 Q81 88 84 74 Q88 54 84 34 Q80 6 50 6 Z" ' + F("#a76b3d", "#6d4423") + "/>" +
  '<circle cx="50" cy="46" r="22" ' + F("#e8c79b", "#a3835c") + "/>" +
  '<circle cx="43" cy="44" r="3" fill="#4a2a3a"/><circle cx="57" cy="44" r="3" fill="#4a2a3a"/>' +
  '<path d="M44 54 Q50 59 56 54" ' + S("#96302f", 'stroke-width="3"') + "/>" +
  '<path d="M30 30 Q40 20 50 22 Q60 20 70 30" ' + S("#6d4423", 'stroke-width="4"') + "/>"
);

D.arm = wrap(
  // braço em L, traçado num único sentido (sem voltar atrás — evita
  // auto-interseções): ombro redondo em baixo à esquerda, sobe pelo lado
  // de fora (reto), cotovelo, desce/vira para a direita pelo lado de fora,
  // MÃO FECHADA grande no topo à direita (com nós dos dedos), volta pelo
  // lado de dentro do antebraço, cotovelo interior, desce pelo lado de
  // dentro do braço com bossa do bíceps, fecha no ombro
  '<path d="M20 96 Q10 96 10 84 L10 40 Q10 22 28 22' +
  ' L58 22 Q56 4 76 4 Q98 4 98 26 Q98 46 76 44 L50 44' +
  ' Q40 44 34 52 L34 84 Q34 96 24 96 Z" ' +
  F("#e8c79b", "#a3835c") + "/>" +
  '<path d="M70 14 Q76 10 82 14 M70 22 L70 36 M78 22 L78 38 M86 22 L86 36" ' +
  S("#a3835c", 'stroke-width="2.5" stroke-opacity="0.45"') + "/>" +
  '<path d="M16 44 Q22 40 28 44" ' + S("#a3835c", 'stroke-width="2.2" stroke-opacity="0.4"') + "/>"
);

D.leg = wrap(
  // perna com pé, de pé — UM único path fechado: coxa em cima, joelho,
  // canela a descer, pé virado para a direita na base
  '<path d="M34 6 L66 6 L64 40 Q64 50 60 58 L60 78 Q78 80 84 86 Q86 92 78 92 L44 92 Q40 92 40 86' +
  ' L44 58 Q40 50 40 40 Z" ' + F("#e8c79b", "#a3835c") + "/>" +
  '<path d="M40 58 Q50 62 60 58" ' + S("#a3835c", 'stroke-width="2.5" stroke-opacity="0.5"') + "/>" +
  '<path d="M44 40 Q50 44 56 40" ' + S("#a3835c", 'stroke-width="2.5" stroke-opacity="0.4"') + "/>"
);

D.finger = wrap(
  // mão a apontar: punho fechado + indicador esticado em destaque — UM
  // único path fechado, dedo bem maior e separado dos outros dobrados
  '<path d="M50 6 Q58 6 58 16 L58 44 Q66 44 68 48 Q70 44 76 46 Q80 50 76 54' +
  ' Q80 58 76 62 Q78 66 72 68 Q72 74 64 74 L40 74 Q26 74 24 60 Q22 48 30 44' +
  ' L30 44 Q26 40 30 36 Q34 32 38 36 L42 40 L42 16 Q42 6 50 6 Z" ' + F("#e8c79b", "#a3835c") + "/>" +
  '<path d="M64 48 L64 62 M70 50 L70 62" ' + S("#a3835c", 'stroke-width="2.5" stroke-opacity="0.5"') + "/>"
);

D.tooth = wrap(
  // dente molar sorridente, branco-creme com raízes e cara feliz
  '<path d="M28 14 Q20 14 20 24 Q20 34 26 38 Q22 48 22 62 Q22 74 30 74 Q36 74 36 64' +
  ' Q36 56 40 56 Q44 56 44 64 Q44 74 50 74 Q56 74 56 64 Q56 56 60 56 Q64 56 64 64' +
  ' Q64 74 70 74 Q78 74 78 62 Q78 48 74 38 Q80 34 80 24 Q80 14 72 14 Q64 14 62 22' +
  ' Q56 16 50 16 Q44 16 38 22 Q36 14 28 14 Z" ' + F("#f7f3e8", "#b7ac95") + "/>" +
  '<circle cx="41" cy="34" r="3.2" fill="#4a2a3a"/><circle cx="59" cy="34" r="3.2" fill="#4a2a3a"/>' +
  '<path d="M40 44 Q50 50 60 44" ' + S("#96302f", 'stroke-width="3"') + "/>" +
  '<ellipse cx="36" cy="26" rx="6" ry="4" fill="#ffffff" fill-opacity="0.7"/>'
);

D.tongue = wrap(
  // boca bem aberta com língua rosa de fora, dentes em cima
  '<path d="M10 40 Q50 16 90 40 Q88 56 76 62 Q60 72 50 72 Q40 72 24 62 Q12 56 10 40 Z" ' + F("#e0596e", "#96302f") + "/>" +
  '<path d="M16 40 Q50 24 84 40 L80 46 Q50 34 20 46 Z" fill="#ffffff" fill-opacity="0.95" stroke="#96302f" stroke-width="2.5"/>' +
  '<path d="M30 52 Q50 40 70 52 Q72 68 50 76 Q28 68 30 52 Z" ' + F("#e94f4f", "#96302f", 'stroke-width="3"') + "/>" +
  '<path d="M50 56 L50 70" ' + S("#96302f", 'stroke-width="2.5" stroke-opacity="0.5"') + "/>"
);

D.belly = wrap(
  // barriga redonda e fofa com umbigo — só a barriga, sem nada em cima que
  // pareça olhos (não é uma cara)
  '<circle cx="50" cy="54" r="40" ' + F("#e8c79b", "#a3835c") + "/>" +
  '<ellipse cx="50" cy="56" rx="7" ry="5" fill="#a3835c" fill-opacity="0.55"/>' +
  '<path d="M22 44 Q50 34 78 44" ' + S("#f7f3e8", 'stroke-width="4" stroke-opacity="0.5"') + "/>" +
  '<path d="M28 70 Q50 78 72 70" ' + S("#f7f3e8", 'stroke-width="3" stroke-opacity="0.35"') + "/>"
);

D.knee = wrap(
  // perna dobrada em L de perfil: coxa horizontal a entrar pela esquerda,
  // dobra no joelho, canela vertical a descer até um pé simples na base —
  // UM único path fechado (mesma técnica seguro do braço); o joelho é
  // marcado no vértice por um círculo mais escuro (rótula) + 2 vincos
  '<path d="M4 22 Q4 8 18 8 L60 8 Q76 8 76 24 L76 56' +
  ' Q88 58 92 68 L92 78 Q92 90 80 90 L54 90 Q44 90 44 78' +
  ' L44 40 Q44 30 34 30 L18 30 Q4 30 4 22 Z" ' + F("#e8c79b", "#a3835c") + "/>" +
  '<ellipse cx="59" cy="33" rx="13" ry="12" fill="#c9a97a" fill-opacity="0.9" stroke="#a3835c" stroke-width="4"/>' +
  '<path d="M51 30 Q59 35 67 30" ' + S("#8a6c44", 'stroke-width="2.5" stroke-opacity="0.6"') + "/>" +
  '<path d="M52 39 Q59 43 66 39" ' + S("#8a6c44", 'stroke-width="2.2" stroke-opacity="0.5"') + "/>" +
  '<path d="M12 18 Q20 14 28 18" ' + S("#a3835c", 'stroke-width="2.5" stroke-opacity="0.4"') + "/>"
);

/* ---- roupa ------------------------------------------------------- */

D.shirt = wrap(
  // t-shirt aberta com gola em V e mangas curtas
  '<path d="M36 14 L20 26 L28 42 L36 36 L36 88 L64 88 L64 36 L72 42 L80 26 L64 14 Q50 26 36 14 Z" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<path d="M42 16 Q50 30 58 16" ' + S("#2c4f9e", 'stroke-width="3.5"') + "/>" +
  '<path d="M40 46 q10 4 20 0" ' + S("#dbe7fb", 'stroke-width="3" stroke-opacity="0.6"') + "/>"
);

D.pants = wrap(
  // calças com cós e duas pernas
  '<path d="M26 12 L74 12 L76 40 L70 88 L54 88 L50 46 L46 88 L30 88 L24 40 Z" ' + F("#2c4f9e", "#1c3670") + "/>" +
  '<rect x="24" y="10" width="52" height="12" rx="4" ' + F("#3a66c4", "#1c3670") + "/>" +
  '<path d="M50 24 L50 44" ' + S("#1c3670", 'stroke-width="3"') + "/>"
);

D.dress = wrap(
  // vestido com saia em A e mangas curtas
  '<path d="M40 10 L28 22 L34 32 L40 26 L36 46 Q22 56 20 84 Q50 94 80 84 Q78 56 64 46 L60 26 L66 32 L72 22 L60 10 Q50 20 40 10 Z" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<path d="M44 12 Q50 22 56 12" ' + S("#b04f7e", 'stroke-width="3"') + "/>" +
  '<path d="M38 48 Q50 44 62 48" ' + S("#b04f7e", 'stroke-width="2.5" stroke-opacity="0.6"') + "/>" +
  '<circle cx="50" cy="30" r="3" fill="#f2c94c" stroke="#b78f22" stroke-width="1.5"/>'
);

D.shoes = wrap(
  // um ténis grande e claro visto de lado (biqueira arredondada à direita, calcanhar alto à esquerda, língua e atacadores) + segundo par por trás, mais pequeno
  '<path d="M4 72 L4 44 Q4 34 14 34 Q22 34 22 44 L22 52 Q40 44 58 50 Q78 56 84 68 L84 72 Z" ' + F("#f2994a", "#b5622a", 'stroke-width="4" opacity="0.55"') + "/>" +
  '<path d="M14 84 L14 54 Q14 42 26 42 Q34 42 34 54 L34 62 Q54 52 74 60 Q96 68 96 80 L96 84 Z" ' + F("#e94f4f", "#96302f") + "/>" +
  '<path d="M14 78 L96 78 L96 86 Q96 92 90 92 L20 92 Q14 92 14 86 Z" fill="#f7f3e8" fill-opacity="0.95" stroke="#96302f" stroke-width="3.5"/>' +
  '<path d="M26 48 L26 62" ' + S("#96302f", 'stroke-width="4"') + "/>" +
  '<path d="M40 56 L46 66 M50 53 L55 64 M60 52 L64 63" ' + S("#f7f3e8", 'stroke-width="3.5"') + "/>" +
  '<circle cx="38" cy="55" r="2.6" fill="#f2c94c"/><circle cx="48" cy="52" r="2.6" fill="#f2c94c"/><circle cx="58" cy="51" r="2.6" fill="#f2c94c"/>'
);

D.socks = wrap(
  // par de meias às riscas
  '<path d="M22 8 L44 8 L44 52 Q44 68 34 74 Q22 80 16 72 Q12 66 18 60 Q26 56 26 44 L22 44 Z" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M22 20 L44 20 M22 30 L44 30 M22 40 L44 40" ' + S("#e94f4f", 'stroke-width="4"') + "/>" +
  '<path d="M56 8 L78 8 L78 44 L74 44 Q74 56 82 60 Q88 66 84 72 Q78 80 66 74 Q56 68 56 52 Z" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M56 20 L78 20 M56 30 L78 30 M56 40 L78 40" ' + S("#e94f4f", 'stroke-width="4"') + "/>"
);

D.hat = wrap(
  // chapéu de sol: copa arredondada + aba larga
  '<ellipse cx="50" cy="70" rx="46" ry="10" ' + F("#f2994a", "#b5622a") + "/>" +
  '<path d="M28 68 Q24 30 50 24 Q76 30 72 68 Z" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M28 60 Q50 66 72 60" ' + S("#e94f4f", 'stroke-width="6"') + "/>" +
  '<path d="M36 40 Q50 34 64 40" ' + S("#b78f22", 'stroke-width="2.5" stroke-opacity="0.6"') + "/>"
);

D.jacket = wrap(
  // casaco com fecho ao meio e mangas compridas
  '<path d="M40 12 L22 22 L14 44 L26 50 L32 34 L32 88 L50 88 L50 34 L50 88 L68 88 L68 34 L74 50 L86 44 L78 22 L60 12 Q50 22 40 12 Z" ' + F("#5fbb63", "#37743a") + "/>" +
  '<path d="M50 20 L50 88" ' + S("#37743a", 'stroke-width="3"') + "/>" +
  '<circle cx="50" cy="34" r="2.5" fill="#f2c94c"/><circle cx="50" cy="46" r="2.5" fill="#f2c94c"/><circle cx="50" cy="58" r="2.5" fill="#f2c94c"/>' +
  '<path d="M42 14 Q50 24 58 14" ' + S("#37743a", 'stroke-width="3"') + "/>"
);

D.skirt = wrap(
  // saia em A com cós
  '<rect x="30" y="10" width="40" height="12" rx="4" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<path d="M30 22 L70 22 L86 82 Q50 94 14 82 Z" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<path d="M28 46 Q50 52 72 46" ' + S("#b04f7e", 'stroke-width="2.5" stroke-opacity="0.6"') + "/>" +
  '<path d="M22 64 Q50 70 78 64" ' + S("#b04f7e", 'stroke-width="2.5" stroke-opacity="0.6"') + "/>"
);

D.shorts = wrap(
  // calções curtos com cós e duas pernas curtas
  '<path d="M28 12 L72 12 L74 34 L70 62 L54 62 L50 40 L46 62 L30 62 L26 34 Z" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<rect x="26" y="10" width="48" height="12" rx="4" ' + F("#6f9bee", "#2c4f9e") + "/>" +
  '<path d="M50 24 L50 40" ' + S("#2c4f9e", 'stroke-width="3"') + "/>"
);

D.gloves = wrap(
  // par de luvas com dedo polegar destacado
  '<path d="M20 34 Q20 22 30 22 Q34 22 34 28 L34 40 Q42 36 44 44 Q46 52 42 58 L42 78 Q42 86 34 86 L18 86 Q10 86 10 78 L10 46 Q10 34 20 34 Z" ' + F("#5fbb63", "#37743a") + "/>" +
  '<path d="M20 40 L20 24" ' + S("#37743a", 'stroke-width="4"') + "/>" +
  '<path d="M80 34 Q80 22 70 22 Q66 22 66 28 L66 40 Q58 36 56 44 Q54 52 58 58 L58 78 Q58 86 66 86 L82 86 Q90 86 90 78 L90 46 Q90 34 80 34 Z" ' + F("#5fbb63", "#37743a") + "/>" +
  '<path d="M80 40 L80 24" ' + S("#37743a", 'stroke-width="4"') + "/>"
);

D.scarf = wrap(
  // cachecol clássico: faixa larga e cheia em U invertido raso no topo (enrolada
  // ao pescoço) + uma ponta larga a cair à frente, com riscas e franjas
  '<path d="M14 30 Q14 16 28 16 L72 16 Q86 16 86 30 Q86 40 76 40 L76 30 Q76 26 70 26 L30 26 Q24 26 24 30 L24 40 Q14 40 14 30 Z" ' + F("#e94f4f", "#96302f") + "/>" +
  '<path d="M32 32 L68 32 Q72 32 72 36 L74 82 Q74 88 68 88 L32 88 Q26 88 26 82 L28 36 Q28 32 32 32 Z" ' + F("#e94f4f", "#96302f") + "/>" +
  '<path d="M28 48 L72 48.5 M28 60 L73 60.5 M28 72 L73.5 72.5" fill="none" stroke="#f7f3e8" stroke-width="4" stroke-opacity="0.85"/>' +
  '<path d="M30 88 L28 96 M38 88 L37 96 M46 88 L46 96 M54 88 L55 96 M62 88 L63 96 M70 88 L72 96" ' + S("#96302f", 'stroke-width="3"') + "/>"
);

D.boots = wrap(
  // duas botas altas lado a lado, sola grossa
  '<path d="M18 14 L38 14 L38 58 Q50 62 50 72 L50 84 L14 84 L14 66 Q14 58 18 58 Z" ' + F("#a76b3d", "#6d4423") + "/>" +
  '<path d="M14 76 L50 76 L50 84 Q50 90 44 90 L18 90 Q14 90 14 84 Z" ' + F("#6d4423", "#6d4423") + "/>" +
  '<path d="M62 14 L82 14 L82 58 Q94 62 94 72 L94 84 L58 84 L58 66 Q58 58 62 58 Z" ' + F("#a76b3d", "#6d4423") + "/>" +
  '<path d="M58 76 L94 76 L94 84 Q94 90 88 90 L62 90 Q58 90 58 84 Z" ' + F("#6d4423", "#6d4423") + "/>" +
  '<path d="M20 24 L36 24 M20 32 L36 32" ' + S("#6d4423", 'stroke-width="2.5" stroke-opacity="0.6"') + "/>" +
  '<path d="M64 24 L80 24 M64 32 L80 32" ' + S("#6d4423", 'stroke-width="2.5" stroke-opacity="0.6"') + "/>"
);

D.pyjamas = wrap(
  // camisa curta + calça, ambos às estrelinhas
  '<path d="M30 10 L16 20 L22 32 L30 27 L30 46 L70 46 L70 27 L78 32 L84 20 L70 10 Q50 20 30 10 Z" ' + F("#9b6dd6", "#5f3f8c") + "/>" +
  '<path d="M32 50 L68 50 L70 90 L54 90 L50 66 L46 90 L30 90 Z" ' + F("#9b6dd6", "#5f3f8c") + "/>" +
  '<path d="M38 18 l1.6 3.2 3.5 0.5 -2.5 2.5 0.6 3.5 -3.2 -1.7 -3.2 1.7 0.6 -3.5 -2.5 -2.5 3.5 -0.5 Z" fill="#f2c94c"/>' +
  '<path d="M58 30 l1.6 3.2 3.5 0.5 -2.5 2.5 0.6 3.5 -3.2 -1.7 -3.2 1.7 0.6 -3.5 -2.5 -2.5 3.5 -0.5 Z" fill="#f2c94c"/>' +
  '<path d="M44 64 l1.6 3.2 3.5 0.5 -2.5 2.5 0.6 3.5 -3.2 -1.7 -3.2 1.7 0.6 -3.5 -2.5 -2.5 3.5 -0.5 Z" fill="#f2c94c"/>' +
  '<path d="M58 76 l1.6 3.2 3.5 0.5 -2.5 2.5 0.6 3.5 -3.2 -1.7 -3.2 1.7 0.6 -3.5 -2.5 -2.5 3.5 -0.5 Z" fill="#f2c94c"/>'
);

D.ruler = wrap(
  // régua amarela diagonal com marcas de graduação (rotacionada como o lápis)
  '<g transform="rotate(-30 50 50)">' +
  '<rect x="14" y="40" width="72" height="20" rx="4" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M22 40 L22 50 M32 40 L32 54 M42 40 L42 50 M52 40 L52 54 M62 40 L62 50 M72 40 L72 54" ' + S("#b78f22", 'stroke-width="2.5"') + "/>" +
  '<path d="M18 60 L18 46 M78 60 L78 46" ' + S("#b78f22", 'stroke-width="2" stroke-opacity="0.6"') + "/>" +
  "</g>"
);

/* ---- comida ------------------------------------------------------- */

D.pizza = wrap(
  // fatia triangular com crosta arredondada + pepperoni redondo
  '<path d="M50 14 L86 82 Q50 92 14 82 Z" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M22 78 Q50 70 78 78 L86 82 Q50 92 14 82 Z" ' + F("#e8c79b", "#a3835c") + "/>" +
  '<circle cx="44" cy="46" r="7" ' + F("#e94f4f", "#96302f") + "/>" +
  '<circle cx="60" cy="58" r="7" ' + F("#e94f4f", "#96302f") + "/>" +
  '<circle cx="48" cy="68" r="7" ' + F("#e94f4f", "#96302f") + "/>" +
  '<path d="M50 14 L22 78 M50 14 L78 78" ' + S("#b78f22", 'stroke-width="2.5" stroke-opacity="0.5"') + "/>"
);

D.cake = wrap(
  // duas camadas com cobertura + vela acesa no topo
  '<rect x="18" y="56" width="64" height="26" rx="6" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<rect x="26" y="34" width="48" height="24" rx="6" ' + F("#f5b8d4", "#b04f7e") + "/>" +
  '<path d="M18 60 Q50 68 82 60" ' + S("#ffffff", 'stroke-width="4" stroke-opacity="0.75"') + "/>" +
  '<path d="M26 38 Q50 46 74 38" ' + S("#ffffff", 'stroke-width="3.5" stroke-opacity="0.75"') + "/>" +
  '<rect x="46" y="14" width="8" height="20" rx="2" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M50 6 Q46 10 50 14 Q54 10 50 6 Z" ' + F("#f2994a", "#b5622a") + "/>" +
  '<circle cx="34" cy="46" r="3" fill="#e94f4f" stroke="#96302f" stroke-width="1.5"/>' +
  '<circle cx="50" cy="50" r="3" fill="#5fbb63" stroke="#37743a" stroke-width="1.5"/>' +
  '<circle cx="66" cy="46" r="3" fill="#4f7fe9" stroke="#2c4f9e" stroke-width="1.5"/>'
);

D.cookie = wrap(
  // biscoito redondo castanho claro com uma mordida e pintas de chocolate
  '<path d="M50 14 Q78 14 86 42 Q92 62 76 78 Q62 90 42 84 Q18 78 14 54 Q12 34 28 22 Q36 16 50 14 Z" ' + F("#c98a52", "#6d4423") + "/>" +
  '<path d="M76 20 Q88 26 84 38 Q76 40 70 30 Q70 22 76 20 Z" fill="#f7f3e8"/>' +
  '<circle cx="36" cy="38" r="5" ' + F("#6d4423", "#6d4423") + "/>" +
  '<circle cx="58" cy="32" r="5" ' + F("#6d4423", "#6d4423") + "/>" +
  '<circle cx="66" cy="54" r="5" ' + F("#6d4423", "#6d4423") + "/>" +
  '<circle cx="42" cy="62" r="5" ' + F("#6d4423", "#6d4423") + "/>" +
  '<circle cx="28" cy="50" r="5" ' + F("#6d4423", "#6d4423") + "/>"
);

D.cheese = wrap(
  // cunha de queijo amarelo com buracos redondos
  '<path d="M12 30 L70 14 Q78 12 82 20 L92 74 Q94 80 88 80 L16 80 Q10 80 10 74 L10 36 Q10 32 12 30 Z" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<circle cx="34" cy="52" r="8" fill="#f7f3e8" fill-opacity="0.9" stroke="#b78f22" stroke-width="3"/>' +
  '<circle cx="62" cy="60" r="6" fill="#f7f3e8" fill-opacity="0.9" stroke="#b78f22" stroke-width="3"/>' +
  '<circle cx="52" cy="34" r="5" fill="#f7f3e8" fill-opacity="0.9" stroke="#b78f22" stroke-width="3"/>' +
  '<path d="M12 30 L92 74" ' + S("#b78f22", 'stroke-width="2.5" stroke-opacity="0.5"') + "/>"
);

D.juice = wrap(
  // copo trapezoidal com sumo laranja + canudo às riscas
  '<path d="M26 30 L34 82 Q34 86 40 86 L60 86 Q66 86 66 82 L74 30 Z" fill="#dbe7fb" fill-opacity="0.4" stroke="#5b8fd6" stroke-width="4"/>' +
  '<path d="M29 46 L34 82 Q34 86 40 86 L60 86 Q66 86 66 82 L71 46 Z" ' + F("#f2994a", "#b5622a") + "/>" +
  '<path d="M32 50 Q50 56 68 50" ' + S("#ffffff", 'stroke-width="3" stroke-opacity="0.5"') + "/>" +
  '<g transform="rotate(18 60 20)">' +
  '<rect x="56" y="4" width="8" height="46" rx="3" fill="#e94f4f" stroke="#96302f" stroke-width="3"/>' +
  '<path d="M56 16 L64 16 M56 26 L64 26 M56 36 L64 36" stroke="#f7f3e8" stroke-width="3"/>' +
  "</g>"
);

D.ice_cream = wrap(
  // cone triangular com padrão em grelha + duas bolas (rosa em cima, creme em baixo)
  '<path d="M38 58 L50 92 L62 58 Z" ' + F("#c98a52", "#6d4423") + "/>" +
  '<path d="M41 62 L59 62 M40 70 L60 70 M43 78 L57 78" stroke="#6d4423" stroke-width="2" stroke-opacity="0.6"/>' +
  '<circle cx="50" cy="46" r="22" ' + F("#f7f3e8", "#a3835c") + "/>" +
  '<circle cx="50" cy="26" r="20" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<circle cx="42" cy="18" r="4" fill="#ffffff" fill-opacity="0.6"/>' +
  '<circle cx="40" cy="40" r="3" fill="#ffffff" fill-opacity="0.6"/>'
);

D.soup = wrap(
  // taça larga com sopa laranja + colher de lado + duas ondas de vapor
  '<path d="M12 46 L88 46 Q88 78 50 78 Q12 78 12 46 Z" ' + F("#f2994a", "#b5622a") + "/>" +
  '<path d="M10 40 Q50 34 90 40 Q90 46 50 48 Q10 46 10 40 Z" ' + F("#8b97a6", "#5c6b7a") + "/>" +
  '<path d="M30 50 Q50 56 70 50" ' + S("#ffffff", 'stroke-width="3" stroke-opacity="0.5"') + "/>" +
  '<path d="M38 20 Q34 28 40 34 Q34 38 38 46" ' + S("#c9c2b0", 'stroke-width="4"') + "/>" +
  '<path d="M58 16 Q54 24 60 30 Q54 34 58 42" ' + S("#c9c2b0", 'stroke-width="4"') + "/>" +
  '<g transform="rotate(-20 82 60)">' +
  '<ellipse cx="82" cy="30" rx="7" ry="10" ' + F("#dbe7fb", "#5b8fd6", 'stroke-width="3"') + "/>" +
  '<rect x="79" y="38" width="6" height="34" rx="3" ' + F("#dbe7fb", "#5b8fd6", 'stroke-width="3"') + "/>" +
  "</g>"
);

/* ---- cozinha (extra) ------------------------------------------------ */

D.fridge = wrap(
  // frigorífico 2 portas com puxadores
  '<rect x="22" y="8" width="56" height="84" rx="8" ' + F("#8fc1ee", "#5b8fd6") + "/>" +
  '<path d="M22 46 L78 46" ' + S("#5b8fd6", 'stroke-width="4"') + "/>" +
  '<rect x="60" y="16" width="4" height="16" rx="2" fill="#5b8fd6"/>' +
  '<rect x="60" y="54" width="4" height="16" rx="2" fill="#5b8fd6"/>' +
  '<path d="M30 24 Q30 18 36 18" ' + S("#ffffff", 'stroke-width="3" stroke-opacity="0.6"') + "/>"
);

D.pot = wrap(
  // panela com tampa, pega redonda e duas asas
  '<path d="M20 44 L24 76 Q24 82 30 82 L70 82 Q76 82 76 76 L80 44 Z" ' + F("#8b97a6", "#5c6b7a") + "/>" +
  '<ellipse cx="50" cy="44" rx="30" ry="8" ' + F("#aab6c4", "#5c6b7a") + "/>" +
  '<path d="M12 40 Q12 32 20 32 M88 40 Q88 32 80 32" ' + S("#5c6b7a", 'stroke-width="5.5"') + "/>" +
  '<ellipse cx="50" cy="28" rx="20" ry="6" ' + F("#aab6c4", "#5c6b7a") + "/>" +
  '<circle cx="50" cy="20" r="5" ' + F("#5c6b7a", "#5c6b7a") + "/>"
);

D.knife = wrap(
  // faca de brinquedo: lâmina larga e arredondada, cabo grosso
  '<g transform="rotate(35 50 50)">' +
  '<path d="M50 8 Q68 8 68 26 Q68 42 50 42 Z" ' + F("#dbe7fb", "#5b8fd6") + "/>" +
  '<path d="M50 42 L50 8" ' + S("#5b8fd6", 'stroke-width="2.5" stroke-opacity="0.5"') + "/>" +
  '<rect x="40" y="42" width="20" height="40" rx="9" ' + F("#c98a52", "#6d4423") + "/>" +
  "</g>"
);

D.bowl = wrap(
  '<path d="M14 46 Q14 80 50 80 Q86 80 86 46 Z" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<ellipse cx="50" cy="46" rx="36" ry="8" ' + F("#dbe7fb", "#2c4f9e") + "/>" +
  '<path d="M26 58 Q50 66 74 58" ' + S("#2c4f9e", 'stroke-width="2.5" stroke-opacity="0.5"') + "/>"
);

D.strawberry = wrap(
  // corpo em coração invertido: largo em cima com reentrância central, afunila até à ponta
  '<path d="M50 40 Q40 26 24 34 Q12 40 16 54 Q20 76 50 92 Q80 76 84 54 Q88 40 76 34 Q60 26 50 40 Z" ' + F("#e94f4f", "#96302f") + "/>" +
  '<path d="M32 18 L50 32 L68 18 L58 30 L50 24 L42 30 Z" ' + F("#5fbb63", "#37743a", 'stroke-width="3"') + "/>" +
  '<circle cx="36" cy="46" r="2.4" fill="#f2c94c" stroke="#b78f22" stroke-width="1.2"/>' +
  '<circle cx="56" cy="42" r="2.4" fill="#f2c94c" stroke="#b78f22" stroke-width="1.2"/>' +
  '<circle cx="64" cy="58" r="2.4" fill="#f2c94c" stroke="#b78f22" stroke-width="1.2"/>' +
  '<circle cx="42" cy="62" r="2.4" fill="#f2c94c" stroke="#b78f22" stroke-width="1.2"/>' +
  '<circle cx="50" cy="76" r="2.4" fill="#f2c94c" stroke="#b78f22" stroke-width="1.2"/>' +
  '<circle cx="30" cy="58" r="2.4" fill="#f2c94c" stroke="#b78f22" stroke-width="1.2"/>' +
  '<path d="M30 44 Q26 60 38 76" ' + S("#ffffff", 'stroke-width="2.5" stroke-opacity="0.5"') + "/>"
);

D.carrot = wrap(
  '<g transform="rotate(20 50 50)">' +
  '<path d="M50 34 Q60 40 58 60 Q56 80 50 90 Q44 80 42 60 Q40 40 50 34 Z" ' + F("#f2994a", "#b5622a") + "/>" +
  '<path d="M44 42 Q50 46 56 42 M43 54 Q50 58 57 54 M45 66 Q50 69 55 66" ' + S("#b5622a", 'stroke-width="2.5" stroke-opacity="0.5"') + "/>" +
  '<path d="M50 34 L46 14 M50 34 L50 12 M50 34 L54 14" ' + S("#5fbb63", 'stroke-width="5"') + "/>" +
  "</g>"
);

D.tomato = wrap(
  '<circle cx="50" cy="56" r="34" ' + F("#e94f4f", "#96302f") + "/>" +
  '<path d="M38 24 L50 34 L62 24 L58 32 L50 28 L42 32 Z" ' + F("#5fbb63", "#37743a", 'stroke-width="3"') + "/>" +
  '<path d="M50 22 L50 14 M42 26 L36 20 M58 26 L64 20" ' + S("#37743a", 'stroke-width="3"') + "/>" +
  '<path d="M32 40 Q28 56 36 70" ' + S("#ffffff", 'stroke-width="3" stroke-opacity="0.5"') + "/>"
);

D.pear = wrap(
  '<path d="M50 38 Q68 44 68 64 Q68 84 50 88 Q32 84 32 64 Q32 44 50 38 Z" ' + F("#5fbb63", "#37743a") + "/>" +
  '<circle cx="50" cy="32" r="10" ' + F("#5fbb63", "#37743a") + "/>" +
  '<path d="M50 20 Q49 12 56 8" ' + S("#6d4423", 'stroke-width="4"') + "/>" +
  '<path d="M56 12 Q66 8 68 16 Q60 22 56 12 Z" ' + F("#5fbb63", "#37743a", 'stroke-width="2.5"') + "/>" +
  '<path d="M40 54 q-2 10 3 18" ' + S("#ffffff", 'stroke-width="3" stroke-opacity="0.6"') + "/>"
);

/* ---- comida (extra) -------------------------------------------------- */

D.rice = wrap(
  // tigela com monte de arroz redondo (uma só silhueta) + pintas de grão
  '<path d="M14 56 Q14 84 50 84 Q86 84 86 56 Z" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<path d="M18 56 Q18 30 50 28 Q82 30 82 56 Q66 62 50 62 Q34 62 18 56 Z" ' + F("#f7f3e8", "#b7ac95") + "/>" +
  '<circle cx="38" cy="46" r="2.4" fill="#e8dfc8" stroke="#b7ac95" stroke-width="1.2"/>' +
  '<circle cx="50" cy="40" r="2.4" fill="#e8dfc8" stroke="#b7ac95" stroke-width="1.2"/>' +
  '<circle cx="62" cy="46" r="2.4" fill="#e8dfc8" stroke="#b7ac95" stroke-width="1.2"/>' +
  '<circle cx="50" cy="52" r="2.4" fill="#e8dfc8" stroke="#b7ac95" stroke-width="1.2"/>'
);

D.pasta = wrap(
  // prato raso visto ligeiramente de cima (elipse) + monte de esparguete em camadas + garfo espetado no topo + 1 almôndega descentrada
  '<ellipse cx="50" cy="66" rx="42" ry="18" ' + F("#dbe7fb", "#5b8fd6") + "/>" +
  '<ellipse cx="50" cy="64" rx="42" ry="17" fill="none" stroke="#5b8fd6" stroke-width="2" stroke-opacity="0.4"/>' +
  '<path d="M16 60 Q46 70 76 60 Q76 66 46 74 Q16 66 16 60 Z" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M20 50 Q46 60 72 50 Q72 56 46 64 Q20 56 20 50 Z" ' + F("#f7da6e", "#b78f22") + "/>" +
  '<path d="M24 40 Q46 50 68 40 Q68 46 46 54 Q24 46 24 40 Z" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M28 32 Q46 40 64 32 Q64 37 46 44 Q28 37 28 32 Z" ' + F("#f7da6e", "#b78f22") + "/>" +
  '<circle cx="70" cy="60" r="7" ' + F("#c98a52", "#6d4423") + "/>" +
  '<g transform="rotate(6 46 20)">' +
  '<path d="M40 6 L40 22 M46 4 L46 24 M52 6 L52 22" ' + S("#8b97a6", 'stroke-width="3.5"') + "/>" +
  '<path d="M40 22 Q40 28 46 28 Q52 28 52 22" ' + S("#8b97a6", 'stroke-width="3.5"') + "/>" +
  '<path d="M46 28 L46 46" ' + S("#5c6b7a", 'stroke-width="5"') + "/>" +
  "</g>"
);

D.chicken = wrap(
  // coxa de frango clássica: corpo em gota (ponta para cima-esquerda) + osso branco curto com 2 bolinhas na ponta
  '<path d="M38 40 Q26 28 34 18 Q42 10 50 20 Q78 30 86 56 Q92 76 70 84 Q48 92 34 74 Q22 58 38 40 Z" ' + F("#c98a52", "#6d4423") + "/>" +
  '<path d="M55 58 Q68 62 74 74" ' + S("#6d4423", 'stroke-width="2.5" stroke-opacity="0.5"') + "/>" +
  '<path d="M36 30 Q28 22 26 12" ' + S("#f7f3e8", 'stroke-width="7"') + "/>" +
  '<circle cx="34" cy="18" r="6" ' + F("#f7f3e8", "#c9c2b0", 'stroke-width="3"') + "/>" +
  '<circle cx="22" cy="10" r="6" ' + F("#f7f3e8", "#c9c2b0", 'stroke-width="3"') + "/>"
);

D.chocolate = wrap(
  // barra de chocolate com quadrados
  '<rect x="14" y="26" width="72" height="48" rx="6" ' + F("#6d4423", "#4a2d17") + "/>" +
  '<path d="M38 26 L38 74 M62 26 L62 74 M14 50 L86 50" ' + S("#4a2d17", 'stroke-width="3"') + "/>" +
  '<path d="M20 34 Q26 30 32 34" ' + S("#a3835c", 'stroke-width="2.5" stroke-opacity="0.6"') + "/>"
);

D.candy = wrap(
  // rebuçado redondo com riscas diagonais + embrulho em triângulos torcidos (leque) nas duas pontas
  '<circle cx="50" cy="50" r="22" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<path d="M36 30 L64 70 M44 28 L70 58 M30 42 L58 72" ' + S("#ffffff", 'stroke-width="4" stroke-opacity="0.6"') + "/>" +
  '<path d="M28 42 L10 34 L14 50 L10 66 L28 58 Z" ' + F("#f27fb2", "#b04f7e", 'stroke-width="3"') + "/>" +
  '<path d="M72 42 L90 34 L86 50 L90 66 L72 58 Z" ' + F("#f27fb2", "#b04f7e", 'stroke-width="3"') + "/>"
);

D.yogurt = wrap(
  // copo trapezoidal com colher espetada
  '<path d="M32 22 L68 22 L62 78 Q61 84 55 84 L45 84 Q39 84 38 78 Z" ' + F("#f5b8d4", "#c9628f") + "/>" +
  '<path d="M32 22 L68 22 L66 34 L34 34 Z" ' + F("#f27fb2", "#b04f7e", 'stroke-width="3"') + "/>" +
  '<path d="M40 44 Q50 50 60 44" ' + S("#ffffff", 'stroke-width="3" stroke-opacity="0.5"') + "/>" +
  '<g transform="rotate(-15 58 40)">' +
  '<ellipse cx="58" cy="26" rx="6" ry="9" ' + F("#dbe7fb", "#5b8fd6", 'stroke-width="2.5"') + "/>" +
  '<rect x="55.5" y="32" width="5" height="30" rx="2.5" ' + F("#dbe7fb", "#5b8fd6", 'stroke-width="2.5"') + "/>" +
  "</g>"
);

D.sandwich = wrap(
  // duas fatias de pão com recheio à vista
  '<path d="M14 62 Q14 46 30 46 L70 46 Q86 46 86 62 L86 62 L14 62 Z" ' + F("#c98a52", "#6d4423") + "/>" +
  '<rect x="16" y="62" width="68" height="7" ' + F("#5fbb63", "#37743a", 'stroke-width="3"') + "/>" +
  '<rect x="16" y="69" width="68" height="7" ' + F("#e94f4f", "#96302f", 'stroke-width="3"') + "/>" +
  '<path d="M14 76 Q14 90 30 90 L70 90 Q86 90 86 76 Z" ' + F("#c98a52", "#6d4423") + "/>" +
  '<circle cx="32" cy="52" r="2" fill="#e8c79b"/><circle cx="50" cy="49" r="2" fill="#e8c79b"/><circle cx="68" cy="52" r="2" fill="#e8c79b"/>'
);

/* ---- praia ------------------------------------------------------- */

D.sea = wrap(
  // três camadas de ondas em tons de azul + pequeno sol no canto
  '<circle cx="76" cy="22" r="12" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M76 4 L76 10 M94 22 L88 22 M60 22 L66 22 M62 8 L66 12 M90 8 L86 12" ' + S("#f2c94c", 'stroke-width="3"') + "/>" +
  '<path d="M4 40 Q18 30 32 40 Q46 50 60 40 Q74 30 88 40 L96 40 L96 58 L4 58 Z" ' + F("#8fc1ee", "#5b8fd6") + "/>" +
  '<path d="M4 58 Q18 50 32 58 Q46 66 60 58 Q74 50 88 58 L96 58 L96 76 L4 76 Z" ' + F("#5b8fd6", "#2c4f9e") + "/>" +
  '<path d="M4 76 Q18 68 32 76 Q46 84 60 76 Q74 68 88 76 L96 76 L96 92 L4 92 Z" ' + F("#2c4f9e", "#1c3670") + "/>"
);

D.sand = wrap(
  // monte de areia com pá espetada + pintas
  '<path d="M6 82 Q10 34 50 30 Q90 34 94 82 Z" ' + F("#e8c79b", "#a3835c") + "/>" +
  '<circle cx="30" cy="64" r="2.5" fill="#a3835c" fill-opacity="0.6"/>' +
  '<circle cx="46" cy="72" r="2.5" fill="#a3835c" fill-opacity="0.6"/>' +
  '<circle cx="64" cy="60" r="2.5" fill="#a3835c" fill-opacity="0.6"/>' +
  '<circle cx="58" cy="76" r="2.5" fill="#a3835c" fill-opacity="0.6"/>' +
  '<g transform="rotate(-15 68 40)">' +
  '<rect x="64" y="6" width="7" height="46" rx="3" ' + F("#f2c94c", "#b78f22") + "/>" +
  '<path d="M56 44 L80 44 Q84 44 84 50 L84 56 Q84 62 76 62 L60 62 Q52 62 52 56 L52 50 Q52 44 56 44 Z" ' + F("#8b97a6", "#5c6b7a") + "/>" +
  "</g>"
);

D.boat = wrap(
  // casco em trapézio + mastro + vela triangular + bandeirola
  '<path d="M10 62 L90 62 L78 84 Q76 88 70 88 L30 88 Q24 88 22 84 Z" ' + F("#e94f4f", "#96302f") + "/>" +
  '<path d="M18 62 L82 62" ' + S("#96302f", 'stroke-width="3"') + "/>" +
  '<path d="M50 62 L50 14" ' + S("#6d4423", 'stroke-width="5"') + "/>" +
  '<path d="M50 18 L50 58 L20 58 Z" ' + F("#f7f3e8", "#b7ac95") + "/>" +
  '<path d="M52 16 L52 40 L74 34 Z" ' + F("#f2c94c", "#b78f22") + "/>"
);

D.fish = wrap(
  // peixe risonho de perfil: corpo oval + cauda + barbatana + olho + bolhas
  '<path d="M14 50 Q30 26 60 34 Q86 40 90 50 Q86 60 60 66 Q30 74 14 50 Z" ' + F("#f2994a", "#b5622a") + "/>" +
  '<path d="M14 50 L2 32 L2 50 Z" ' + F("#f2994a", "#b5622a") + "/>" +
  '<path d="M14 50 L2 68 L2 50 Z" ' + F("#f2994a", "#b5622a") + "/>" +
  '<path d="M44 36 Q50 24 62 26 Q56 34 56 40 Z" ' + F("#f5b8d4", "#b5622a", 'stroke-width="3"') + "/>" +
  '<circle cx="68" cy="44" r="4.5" fill="#2c2a1a"/>' +
  '<circle cx="69.5" cy="42.5" r="1.5" fill="#fff"/>' +
  '<path d="M50 55 Q58 60 66 56" ' + S("#b5622a", 'stroke-width="2.5"') + "/>" +
  '<circle cx="18" cy="18" r="4" fill="#8fc1ee" fill-opacity="0.7" stroke="#5b8fd6" stroke-width="2"/>' +
  '<circle cx="30" cy="10" r="3" fill="#8fc1ee" fill-opacity="0.7" stroke="#5b8fd6" stroke-width="2"/>'
);

D.shell = wrap(
  // concha em leque: base arredondada + nervuras radiais + gomo ondulado no topo
  '<path d="M14 82 Q10 44 50 12 Q90 44 86 82 Q50 92 14 82 Z" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<path d="M50 82 L50 22 M34 82 L42 26 M66 82 L58 26 M20 78 L32 32 M80 78 L68 32" ' + S("#b04f7e", 'stroke-width="3"') + "/>" +
  '<path d="M18 80 Q50 90 82 80" ' + S("#b04f7e", 'stroke-width="4"') + "/>"
);

D.bucket = wrap(
  // balde de praia trapezoidal com asa em arco + risca decorativa
  '<path d="M22 32 L28 82 Q28 88 34 88 L66 88 Q72 88 72 82 L78 32 Z" ' + F("#4f7fe9", "#2c4f9e") + "/>" +
  '<path d="M30 56 L70 56" ' + S("#f2c94c", 'stroke-width="7"') + "/>" +
  '<ellipse cx="50" cy="32" rx="28" ry="8" ' + F("#3a66c4", "#2c4f9e") + "/>" +
  '<path d="M30 30 Q50 6 70 30" ' + S("#2c4f9e", 'stroke-width="5"') + "/>"
);

D.crab = wrap(
  // caranguejo mascote: corpo largo e chato, 2 pinças grandes, patas, olhos em antena, sorriso
  '<ellipse cx="50" cy="92" rx="30" ry="4" fill="#000" fill-opacity="0.08"/>' +
  '<path d="M50 52 Q22 48 20 66 Q20 82 50 82 Q80 82 80 66 Q78 48 50 52 Z" ' + F("#e94f4f", "#96302f") + "/>" +
  // pinças
  '<path d="M22 58 Q6 52 4 38 Q14 40 18 48 Q10 40 14 30 Q24 34 24 46 Q26 52 22 58 Z" ' + F("#e94f4f", "#96302f") + "/>" +
  '<path d="M78 58 Q94 52 96 38 Q86 40 82 48 Q90 40 86 30 Q76 34 76 46 Q74 52 78 58 Z" ' + F("#e94f4f", "#96302f") + "/>" +
  // patas
  '<path d="M24 72 Q10 76 6 86 M28 78 Q18 86 14 94" ' + S("#96302f", 'stroke-width="4"') + "/>" +
  '<path d="M76 72 Q90 76 94 86 M72 78 Q82 86 86 94" ' + S("#96302f", 'stroke-width="4"') + "/>" +
  // olhos em antena
  '<path d="M40 52 L36 36 M60 52 L64 36" ' + S("#96302f", 'stroke-width="4"') + "/>" +
  '<circle cx="36" cy="32" r="6" fill="#f7f3e8" stroke="#96302f" stroke-width="3"/>' +
  '<circle cx="64" cy="32" r="6" fill="#f7f3e8" stroke="#96302f" stroke-width="3"/>' +
  '<circle cx="37.5" cy="31" r="2.6" fill="#4a2a3a"/><circle cx="65.5" cy="31" r="2.6" fill="#4a2a3a"/>' +
  '<path d="M40 68 Q50 76 60 68" ' + S("#96302f", 'stroke-width="3"') + "/>"
);

D.starfish = wrap(
  // estrela-do-mar: 5 braços arredondados (não pontiagudos) + pintinhas — SEM cara, distinta de D.star/D.estrela
  '<path d="M50 8 Q58 30 62 34 Q84 26 92 34 Q78 46 78 52 Q92 60 90 78 Q72 68 66 68 Q64 84 50 92 Q36 84 34 68 Q28 68 10 78 Q8 60 22 52 Q22 46 8 34 Q16 26 38 34 Q42 30 50 8 Z" ' + F("#f2994a", "#b5622a", 'stroke-width="4.5"') + "/>" +
  '<circle cx="50" cy="38" r="3" fill="#b5622a" fill-opacity="0.7"/>' +
  '<circle cx="38" cy="50" r="2.6" fill="#b5622a" fill-opacity="0.7"/>' +
  '<circle cx="62" cy="50" r="2.6" fill="#b5622a" fill-opacity="0.7"/>' +
  '<circle cx="42" cy="66" r="2.4" fill="#b5622a" fill-opacity="0.7"/>' +
  '<circle cx="58" cy="66" r="2.4" fill="#b5622a" fill-opacity="0.7"/>' +
  '<circle cx="50" cy="52" r="2.6" fill="#b5622a" fill-opacity="0.7"/>'
);

D.umbrella = wrap(
  // chapéu de sol às fatias espetado na areia: cúpula em leque + haste + monte de areia
  '<path d="M14 44 Q50 10 86 44 Z" ' + F("#e94f4f", "#96302f") + "/>" +
  '<path d="M14 44 Q50 10 86 44" ' + S("#96302f", 'stroke-width="3"') + "/>" +
  '<path d="M28 44 Q34 26 50 20 M50 20 Q66 26 72 44 M50 20 L50 44" ' + S("#96302f", 'stroke-width="3" stroke-opacity="0.6"') + "/>" +
  '<path d="M32.5 44 Q41 30 50 20 Q59 30 67.5 44 Z" fill="#f7f3e8" fill-opacity="0.85" stroke="#96302f" stroke-width="2"/>' +
  '<path d="M50 44 L50 88" ' + S("#6d4423", 'stroke-width="5"') + "/>" +
  '<ellipse cx="50" cy="90" rx="26" ry="7" ' + F("#e8c79b", "#a3835c", 'stroke-width="3"') + "/>"
);

D.sunglasses = wrap(
  // óculos de sol: 2 lentes redondas + ponte + hastes
  '<circle cx="30" cy="52" r="20" ' + F("#8b97a6", "#5c6b7a") + "/>" +
  '<circle cx="70" cy="52" r="20" ' + F("#8b97a6", "#5c6b7a") + "/>" +
  '<path d="M50 48 Q50 40 58 40 M42 48 Q42 40 50 40" ' + S("#5c6b7a", 'stroke-width="4"') + "/>" +
  '<path d="M10 48 L2 42 M90 48 L98 42" ' + S("#5c6b7a", 'stroke-width="5"') + "/>" +
  '<path d="M22 44 Q26 40 32 42" ' + S("#dbe3ea", 'stroke-width="3" stroke-opacity="0.7"') + "/>" +
  '<path d="M62 44 Q66 40 72 42" ' + S("#dbe3ea", 'stroke-width="3" stroke-opacity="0.7"') + "/>"
);

D.swimsuit = wrap(
  // fato de banho de uma peça: 2 alças finas + corpo em ampulheta com pintinhas
  '<path d="M32 10 L38 40 M68 10 L62 40" ' + S("#b04f7e", 'stroke-width="6"') + "/>" +
  '<path d="M28 34 Q50 22 72 34 Q80 44 72 56 Q80 66 76 80 Q74 90 50 90 Q26 90 24 80 Q20 66 28 56 Q20 44 28 34 Z" ' + F("#f27fb2", "#b04f7e") + "/>" +
  '<circle cx="38" cy="52" r="3.4" fill="#f7f3e8" fill-opacity="0.85"/>' +
  '<circle cx="62" cy="52" r="3.4" fill="#f7f3e8" fill-opacity="0.85"/>' +
  '<circle cx="50" cy="66" r="3.4" fill="#f7f3e8" fill-opacity="0.85"/>' +
  '<circle cx="38" cy="78" r="3" fill="#f7f3e8" fill-opacity="0.85"/>' +
  '<circle cx="62" cy="78" r="3" fill="#f7f3e8" fill-opacity="0.85"/>'
);

D.dolphin = wrap(
  // golfinho mascote a saltar, corpo quase horizontal (estilo D.fish): oval alongado + bico fino à esquerda + barbatana dorsal só no meio-direita + cauda em V no extremo direito
  '<ellipse cx="48" cy="52" rx="36" ry="18" transform="rotate(-8 48 52)" ' + F("#5b8fd6", "#2c4f9e") + "/>" +
  // bico (aponta para a esquerda, ligeiramente para baixo)
  '<path d="M16 56 L2 62 L14 42 Z" ' + F("#5b8fd6", "#2c4f9e") + "/>" +
  // barbatana dorsal (só uma, a meio do corpo, a apontar para cima)
  '<path d="M52 36 L60 12 L68 38 Z" ' + F("#4a75c4", "#2c4f9e", 'stroke-width="3"') + "/>" +
  // cauda em V no extremo direito (2 lóbulos abertos)
  '<path d="M80 46 L98 30 L86 54 Z" ' + F("#4a75c4", "#2c4f9e", 'stroke-width="3"') + "/>" +
  '<path d="M80 58 L98 74 L86 56 Z" ' + F("#4a75c4", "#2c4f9e", 'stroke-width="3"') + "/>" +
  // olho + sorriso
  '<circle cx="22" cy="46" r="3.6" fill="#1c2740"/><circle cx="23.6" cy="44.4" r="1.3" fill="#fff"/>' +
  '<path d="M14 52 Q22 58 32 52" ' + S("#2c4f9e", 'stroke-width="2.8"') + "/>" +
  // pinguinhos de água junto ao bico
  '<circle cx="8" cy="20" r="3.4" fill="#8fc1ee" fill-opacity="0.7" stroke="#5b8fd6" stroke-width="2"/>' +
  '<circle cx="18" cy="12" r="2.6" fill="#8fc1ee" fill-opacity="0.7" stroke="#5b8fd6" stroke-width="2"/>'
);

/* ---- números 1-10: cartão gerado (algarismo + bolinhas de contagem) --- */
export const NUMEROS = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
  sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
}
const CORES_NUM = ['#e94f4f', '#4f7fe9', '#5fbb63', '#f2994a', '#9b6dd6',
                   '#f27fb2', '#5b8fd6', '#b78f22', '#37743a', '#b04f7e']

function numCard(id) {
  const n = NUMEROS[id]
  const cor = CORES_NUM[(n - 1) % CORES_NUM.length]
  // bolinhas para contar: linhas de 5, centradas em baixo
  let dots = ''

  if (n <= 10) {
    // layout original para n ≤ 10
    for (let k = 0; k < n; k++) {
      const linha = Math.floor(k / 5)
      const nLinha = Math.min(5, n - linha * 5)
      const x = 50 + (k % 5 - (nLinha - 1) / 2) * 15
      const y = 74 + linha * 14
      dots += `<circle cx="${x}" cy="${y}" r="5.5" ${F(cor, cor, 'stroke-width="3"')}/>`
    }
    return wrap(
      `<text x="50" y="52" text-anchor="middle" font-family="inherit" font-size="52" font-weight="bold" fill="${cor}" stroke="${cor}" stroke-width="2">${n}</text>` + dots,
    )
  } else if (n <= 15) {
    // layout para n 11-15: algarismo menor + bolinhas em linhas de 5
    for (let k = 0; k < n; k++) {
      const linha = Math.floor(k / 5)
      const nLinha = Math.min(5, n - linha * 5)
      const x = 50 + (k % 5 - (nLinha - 1) / 2) * 15
      const y = 58 + linha * 13
      dots += `<circle cx="${x}" cy="${y}" r="4.5" ${F(cor, cor, 'stroke-width="3"')}/>`
    }
    return wrap(
      `<text x="50" y="40" text-anchor="middle" font-family="inherit" font-size="38" font-weight="bold" fill="${cor}" stroke="${cor}" stroke-width="2">${n}</text>` + dots,
    )
  } else {
    // layout para n 16-20: 4 filas com espaçamento ajustado (y=56 + 12.5*linha)
    for (let k = 0; k < n; k++) {
      const linha = Math.floor(k / 5)
      const nLinha = Math.min(5, n - linha * 5)
      const x = 50 + (k % 5 - (nLinha - 1) / 2) * 15
      const y = 56 + linha * 12.5
      dots += `<circle cx="${x}" cy="${y}" r="4.5" ${F(cor, cor, 'stroke-width="3"')}/>`
    }
    return wrap(
      `<text x="50" y="40" text-anchor="middle" font-family="inherit" font-size="38" font-weight="bold" fill="${cor}" stroke="${cor}" stroke-width="2">${n}</text>` + dots,
    )
  }
}

/* cor predominante de cada desenho — usada nas bordas dos cartões,
   para a moldura "combinar" com o que está lá dentro */
export const COR_DOMINANTE = {
  car: '#e94f4f',
  ball: '#f2c94c',
  cup: '#9b6dd6',
  water: '#5b8fd6',
  bed: '#a76b3d',
  pillow: '#f27fb2',
  blanket: '#9b6dd6',
  lamp: '#f2c94c',
  teddy: '#c98a52',
  window: '#8fc1ee',
  chair: '#c98a52',
  table: '#c98a52',
  door: '#a76b3d',
  apple: '#e94f4f',
  banana: '#f2c94c',
  spoon: '#8b97a6',
  fork: '#8b97a6',
  plate: '#4f7fe9',
  milk: '#8fc1ee',
  bread: '#c98a52',
  egg: '#f2c94c',
  pencil: '#f2c94c',
  crayon: '#4f7fe9',
  book: '#5fbb63',
  backpack: '#9b6dd6',
  scissors: '#8b97a6',
  sofa: '#5fbb63',
  tv: '#8b97a6',
  clock: '#f2c94c',
  phone: '#4f7fe9',
  key: '#f2c94c',
  wardrobe: '#a76b3d',
  rug: '#f27fb2',
  curtain: '#9b6dd6',
  doll: '#f5b8d4',
  moon: '#f2c94c',
  star: '#f2c94c',
  plant: '#5fbb63',
  picture: '#c98a52',
  remote: '#8b97a6',
  shelf: '#a76b3d',
  vase: '#4f7fe9',
  candle: '#f2c94c',
  soap: '#f27fb2',
  towel: '#8fc1ee',
  toothbrush: '#e94f4f',
  bathtub: '#8fc1ee',
  toilet: '#8b97a6',
  mirror: '#8fc1ee',
  shower: '#8fc1ee',
  shampoo: '#f27fb2',
  comb: '#9b6dd6',
  duck: '#f2c94c',
  sink: '#8b97a6',
  toilet_paper: '#b7ac95',
  swing: '#e94f4f',
  slide: '#f2c94c',
  tree: '#5fbb63',
  flower: '#f27fb2',
  sun: '#f2c94c',
  dog: '#c98a52',
  cat: '#f2994a',
  bird: '#4f7fe9',
  butterfly: '#9b6dd6',
  bee: '#f2c94c',
  cloud: '#8fc1ee',
  rain: '#5b8fd6',
  rainbow: '#e94f4f',
  kite: '#f2994a',
  bike: '#e94f4f',
  grass: '#5fbb63',
  wheel: '#8b97a6',
  seat_belt: '#8b97a6',
  road: '#8b97a6',
  traffic_light: '#e94f4f',
  glue: '#f2994a',
  paper: '#8fc1ee',
  paint: '#e94f4f',
  ruler: '#f2c94c',
  head: '#e8c79b',
  hand: '#e8c79b',
  foot: '#e8c79b',
  eye: '#4f7fe9',
  nose: '#e8c79b',
  mouth: '#e94f4f',
  ear: '#e8c79b',
  hair: '#a76b3d',
  arm: '#e8c79b',
  leg: '#e8c79b',
  finger: '#e8c79b',
  tooth: '#b7ac95',
  tongue: '#e94f4f',
  belly: '#e8c79b',
  knee: '#e8c79b',
  shirt: '#4f7fe9',
  pants: '#2c4f9e',
  dress: '#f27fb2',
  shoes: '#e94f4f',
  socks: '#f2c94c',
  hat: '#f2994a',
  jacket: '#5fbb63',
  skirt: '#f27fb2',
  shorts: '#4f7fe9',
  gloves: '#5fbb63',
  scarf: '#e94f4f',
  boots: '#a76b3d',
  pyjamas: '#9b6dd6',
  pizza: '#f2c94c',
  cake: '#f27fb2',
  cookie: '#c98a52',
  cheese: '#f2c94c',
  juice: '#f2994a',
  ice_cream: '#f27fb2',
  soup: '#f2994a',
  sea: '#5b8fd6',
  sand: '#e8c79b',
  boat: '#e94f4f',
  fish: '#f2994a',
  shell: '#f27fb2',
  bucket: '#4f7fe9',
  crab: '#e94f4f',
  starfish: '#f2994a',
  umbrella: '#e94f4f',
  sunglasses: '#8b97a6',
  swimsuit: '#f27fb2',
  dolphin: '#5b8fd6',
  fridge: '#8fc1ee',
  pot: '#8b97a6',
  knife: '#8b97a6',
  bowl: '#4f7fe9',
  strawberry: '#e94f4f',
  carrot: '#f2994a',
  tomato: '#e94f4f',
  pear: '#5fbb63',
  rice: '#b7ac95',
  pasta: '#f2c94c',
  chicken: '#c98a52',
  chocolate: '#6d4423',
  candy: '#f27fb2',
  yogurt: '#f5b8d4',
  sandwich: '#f2c94c',
  bus: '#f2c94c',
  truck: '#4f7fe9',
  train: '#5fbb63',
  plane: '#8fc1ee',
  motorbike: '#e94f4f',
  eraser: '#f27fb2',
  pen: '#4f7fe9',
  notebook: '#5fbb63',
  computer: '#8b97a6',
  desk: '#c98a52',
  bell: '#f2c94c',
  lunchbox: '#e94f4f',
}

/* devolve a cor de borda de uma palavra: a própria cor (pack cores)
   ou a cor predominante do desenho; null → borda do tema */
export function corDominante(id, word) {
  if (word && word.cor) return word.cor
  if (NUMEROS[id] !== undefined) return CORES_NUM[(NUMEROS[id] - 1) % CORES_NUM.length]
  return COR_DOMINANTE[id] || null
}

export function artSvg(id, word) {
  if (word && word.cor) return corCard(word.cor)
  if (NUMEROS[id] !== undefined) return numCard(id)
  return D[id] || wrap(`<circle cx="50" cy="50" r="30" ${S('#999')}/>`)
}

export function hasArt(id, word) {
  return Boolean((word && word.cor) || NUMEROS[id] !== undefined || D[id])
}

export const artIds = Object.keys(D)
