/* =====================================================================
   srs.js — Motor de repetição espaçada (Anki simplificado para crianças)

   Cada palavra tem um nível de 0 a 5. Os intervalos até à próxima
   revisão são fixos: [hoje, 1, 2, 4, 7, 14] dias. A criança nunca se
   auto-avalia: o resultado do quiz (acertou / errou à primeira) é o
   que faz o cartão subir ou descer.

   Estado guardado em localStorage. Sem dependências.
   Para migrar para Nuxt: vira um composable/useSrs() ou uma store Pinia.
   ===================================================================== */

var SRS = (function () {
  var STORAGE_KEY = "jogoIngles.v1";
  var INTERVALOS_DIAS = [0, 1, 2, 4, 7, 14]; // por nível
  var MAX_NOVAS_POR_SESSAO = 4;
  var DIA_MS = 24 * 60 * 60 * 1000;

  var state = null;

  function agora() { return Date.now(); }

  function estadoInicial() {
    return {
      cards: {},      // wordId -> { level, due, seen, ok, ko }
      stars: 0,
      theme: "menina",
      lastSession: null
    };
  }

  function load() {
    if (state) return state;
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      state = raw ? JSON.parse(raw) : estadoInicial();
    } catch (e) {
      // localStorage indisponível (modo privado, iframe...) → memória
      state = estadoInicial();
    }
    return state;
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* sem persistência, continua em memória */ }
  }

  function card(wordId) {
    load();
    if (!state.cards[wordId]) {
      state.cards[wordId] = { level: 0, due: 0, seen: false, ok: 0, ko: 0 };
    }
    return state.cards[wordId];
  }

  /* ---- consultas ------------------------------------------------- */

  function palavrasVistas() {
    load();
    return APP_DATA.words.filter(function (w) { return card(w.id).seen; });
  }

  function palavrasNovas() {
    load();
    return APP_DATA.words.filter(function (w) { return !card(w.id).seen; });
  }

  function palavrasDue() {
    var t = agora();
    return palavrasVistas().filter(function (w) { return card(w.id).due <= t; });
  }

  /* Escolhe até MAX novas palavras, pela ordem dos dados (packs em
     sequência: cores → casa → escola). */
  function escolherNovas(max) {
    return palavrasNovas().slice(0, max || MAX_NOVAS_POR_SESSAO);
  }

  /* Fila para uma sessão de jogo: primeiro as vencidas (baralhadas),
     depois completa com outras já vistas (prática livre). */
  function filaDeJogo(tamanho) {
    tamanho = tamanho || 8;
    var due = baralhar(palavrasDue());
    var fila = due.slice(0, tamanho);
    if (fila.length < tamanho) {
      var extra = baralhar(palavrasVistas().filter(function (w) {
        return fila.indexOf(w) === -1;
      }));
      fila = fila.concat(extra.slice(0, tamanho - fila.length));
    }
    return fila;
  }

  /* Distratores: 2 outras palavras, de preferência já vistas. */
  function distratores(wordId, quantos) {
    quantos = quantos || 2;
    var pool = palavrasVistas().filter(function (w) { return w.id !== wordId; });
    if (pool.length < quantos) {
      var resto = APP_DATA.words.filter(function (w) {
        return w.id !== wordId && pool.indexOf(w) === -1;
      });
      pool = pool.concat(resto);
    }
    return baralhar(pool).slice(0, quantos);
  }

  /* ---- atualizações ---------------------------------------------- */

  function marcarVista(wordId) {
    var c = card(wordId);
    if (!c.seen) {
      c.seen = true;
      c.level = 0;
      c.due = agora(); // fica logo disponível para o quiz
      save();
    }
  }

  /* correta=true: acertou à PRIMEIRA tentativa. */
  function avaliar(wordId, correta) {
    var c = card(wordId);
    if (correta) {
      c.ok++;
      c.level = Math.min(5, c.level + 1);
      c.due = agora() + INTERVALOS_DIAS[c.level] * DIA_MS;
    } else {
      c.ko++;
      c.level = Math.max(0, c.level - 1);
      c.due = agora(); // volta a aparecer em breve
    }
    save();
  }

  function darEstrela(n) {
    load();
    state.stars += (n || 1);
    save();
  }

  /* ---- extras ----------------------------------------------------- */

  function getTheme() { return load().theme; }
  function setTheme(t) { load(); state.theme = t; save(); }
  function getStars() { return load().stars; }

  function resumo() {
    load();
    return APP_DATA.words.map(function (w) {
      var c = card(w.id);
      return {
        word: w, level: c.level, seen: c.seen,
        due: c.seen && c.due <= agora(), ok: c.ok, ko: c.ko
      };
    });
  }

  function reset() {
    state = estadoInicial();
    save();
  }

  function baralhar(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  return {
    MAX_NOVAS_POR_SESSAO: MAX_NOVAS_POR_SESSAO,
    palavrasVistas: palavrasVistas,
    palavrasNovas: palavrasNovas,
    palavrasDue: palavrasDue,
    escolherNovas: escolherNovas,
    filaDeJogo: filaDeJogo,
    distratores: distratores,
    marcarVista: marcarVista,
    avaliar: avaliar,
    darEstrela: darEstrela,
    getStars: getStars,
    getTheme: getTheme,
    setTheme: setTheme,
    resumo: resumo,
    reset: reset,
    baralhar: baralhar
  };
})();
