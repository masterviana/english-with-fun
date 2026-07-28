/* =====================================================================
   app.js — Interface e ecrãs

   Ecrãs: início, aprender, jogar, recompensa e painel dos pais.
   Texto para a criança: inglês simples (ela ainda não lê — o áudio é
   que manda). Painel dos pais: português.
   Para migrar para Nuxt: cada ecrã vira uma page/component; o estado
   global (SRS) vira uma store.
   ===================================================================== */

(function () {
  var app = null;
  var sessao = null; // estado da sessão de jogo em curso

  /* ---- helpers ---------------------------------------------------- */

  function $(sel, raiz) { return (raiz || document).querySelector(sel); }
  function $all(sel, raiz) { return Array.prototype.slice.call((raiz || document).querySelectorAll(sel)); }

  function render(html) {
    app.innerHTML = html;
    app.scrollTop = 0;
  }

  function aleatorio(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function fraseFeliz() { return aleatorio(["great", "well_done", "fantastic"]); }

  function estrelasHtml() {
    return '<div class="stars-badge">' + ART.svg("estrela") +
           '<span>' + SRS.getStars() + "</span></div>";
  }

  function confetti() {
    var cores = ["#f27fb2", "#9b6dd6", "#4f7fe9", "#f2c94c", "#5fbb63"];
    var html = "";
    for (var i = 0; i < 18; i++) {
      html += '<span class="confete" style="left:' + (5 + Math.random() * 90) +
              "%;background:" + aleatorio(cores) +
              ";animation-delay:" + (Math.random() * 0.5) + "s"+
              ";animation-duration:" + (1.6 + Math.random()) + 's"></span>';
    }
    return '<div class="confetti">' + html + "</div>";
  }

  /* ---- ecrã: início ----------------------------------------------- */

  function ecraInicio() {
    var novas = SRS.palavrasNovas().length;
    var due = SRS.palavrasDue().length;
    var vistas = SRS.palavrasVistas().length;

    render(
      '<div class="ecra ecra-inicio">' +
        '<div class="topo">' + estrelasHtml() +
          '<button class="btn-gear" id="btnGear" title="Pais">&#9881;</button>' +
        "</div>" +
        '<h1 class="titulo">English Fun!</h1>' +
        '<div class="mascotes">' +
          '<div class="mascote">' + ART.svg("mascote_kika") + "</div>" +
          '<div class="mascote">' + ART.svg("mascote_lulu") + "</div>" +
        "</div>" +
        '<div class="botoes-principais">' +
          '<button class="btn-grande btn-aprender" id="btnAprender">' +
            '<span class="btn-icone">' + ART.svg("book") + "</span>" +
            "<span>Learn</span>" +
            (novas > 0 ? '<span class="badge">' + Math.min(novas, SRS.MAX_NOVAS_POR_SESSAO) + "</span>" : "") +
          "</button>" +
          '<button class="btn-grande btn-jogar" id="btnJogar"' + (vistas === 0 ? " disabled" : "") + ">" +
            '<span class="btn-icone">' + ART.svg("ball") + "</span>" +
            "<span>Play</span>" +
            (due > 0 ? '<span class="badge badge-due">' + due + "</span>" : "") +
          "</button>" +
        "</div>" +
        (vistas === 0 ? '<p class="dica">Começa por “Learn” para conhecer as primeiras palavras 💛</p>' : "") +
      "</div>"
    );

    $("#btnAprender").onclick = function () { AudioMgr.somToque(); ecraAprender(); };
    $("#btnJogar").onclick = function () { AudioMgr.somToque(); ecraJogar(); };
    ligarGear();
  }

  function ligarGear() {
    var gear = $("#btnGear");
    var timer = null;
    // premir e segurar ~1s para abrir (para a criança não abrir sem querer)
    gear.addEventListener("pointerdown", function () {
      timer = setTimeout(ecraPais, 900);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach(function (ev) {
      gear.addEventListener(ev, function () { clearTimeout(timer); });
    });
    gear.addEventListener("dblclick", ecraPais);
  }

  /* ---- ecrã: aprender --------------------------------------------- */

  function ecraAprender() {
    var novas = SRS.escolherNovas();
    if (novas.length === 0) {
      AudioMgr.frase("no_new");
      render(
        '<div class="ecra ecra-msg">' +
          '<div class="mascote grande">' + ART.svg("mascote_kika") + "</div>" +
          '<p class="balao">No new words today.<br>Let\'s play!</p>' +
          '<button class="btn-grande btn-jogar" id="btnIrJogar"><span class="btn-icone">' +
            ART.svg("ball") + "</span><span>Play</span></button>" +
          '<button class="btn-voltar" id="btnVoltar">&#8962;</button>' +
        "</div>"
      );
      $("#btnIrJogar").onclick = ecraJogar;
      $("#btnVoltar").onclick = ecraInicio;
      return;
    }
    mostrarCartao(novas, 0);
  }

  function mostrarCartao(lista, i) {
    var w = lista[i];
    SRS.marcarVista(w.id);

    render(
      '<div class="ecra ecra-aprender">' +
        '<div class="topo">' +
          '<button class="btn-voltar" id="btnVoltar">&#8962;</button>' +
          '<div class="pontos">' + lista.map(function (_, j) {
            return '<span class="ponto' + (j <= i ? " ativo" : "") + '"></span>';
          }).join("") + "</div>" +
        "</div>" +
        '<div class="cartao" id="cartao">' +
          '<div class="cartao-arte">' + ART.svg(w.id) + "</div>" +
          '<div class="cartao-palavra">' + w.en + "</div>" +
          '<div class="cartao-traducao">' + w.pt + "</div>" +
          '<button class="btn-som" id="btnSom">&#128266;</button>' +
        "</div>" +
        '<button class="btn-seguinte" id="btnSeguinte">' +
          (i + 1 < lista.length ? "&#10142;" : "&#11088;") +
        "</button>" +
      "</div>"
    );

    AudioMgr.palavra(w.id);
    $("#cartao").onclick = function () { AudioMgr.palavra(w.id); };
    $("#btnSom").onclick = function (e) { e.stopPropagation(); AudioMgr.palavra(w.id); };
    $("#btnVoltar").onclick = ecraInicio;
    $("#btnSeguinte").onclick = function () {
      if (i + 1 < lista.length) mostrarCartao(lista, i + 1);
      else fimAprender();
    };
  }

  function fimAprender() {
    AudioMgr.frase("well_done");
    render(
      '<div class="ecra ecra-msg">' + confetti() +
        '<div class="mascote grande">' + ART.svg("mascote_lulu") + "</div>" +
        '<p class="balao">Well done!<br>Now let\'s play!</p>' +
        '<button class="btn-grande btn-jogar" id="btnIrJogar"><span class="btn-icone">' +
          ART.svg("ball") + "</span><span>Play</span></button>" +
        '<button class="btn-voltar" id="btnVoltar">&#8962;</button>' +
      "</div>"
    );
    $("#btnIrJogar").onclick = ecraJogar;
    $("#btnVoltar").onclick = ecraInicio;
  }

  /* ---- ecrã: jogar ------------------------------------------------- */

  function ecraJogar() {
    var fila = SRS.filaDeJogo(8);
    if (fila.length === 0) { ecraAprender(); return; }
    sessao = { fila: fila, i: 0, perfeita: true };
    AudioMgr.frase("play");
    setTimeout(function () { pergunta(); }, 1600);
    render(
      '<div class="ecra ecra-msg">' +
        '<div class="mascote grande">' + ART.svg("mascote_kika") + "</div>" +
        '<p class="balao">Listen carefully<br>and tap the right picture!</p>' +
      "</div>"
    );
  }

  function pergunta() {
    var w = sessao.fila[sessao.i];
    var opcoes = SRS.baralhar([w].concat(SRS.distratores(w.id, 2)));
    var primeira = true;

    render(
      '<div class="ecra ecra-jogo">' +
        '<div class="topo">' +
          '<button class="btn-voltar" id="btnVoltar">&#8962;</button>' +
          '<div class="pontos">' + sessao.fila.map(function (_, j) {
            return '<span class="ponto' + (j < sessao.i ? " ativo" : "") + '"></span>';
          }).join("") + "</div>" +
        "</div>" +
        '<button class="btn-som btn-som-jogo" id="btnSom">&#128266;</button>' +
        '<div class="opcoes">' + opcoes.map(function (o) {
          return '<button class="opcao" data-id="' + o.id + '">' + ART.svg(o.id) + "</button>";
        }).join("") + "</div>" +
      "</div>"
    );

    setTimeout(function () { AudioMgr.palavra(w.id); }, 350);
    $("#btnSom").onclick = function () { AudioMgr.palavra(w.id); };
    $("#btnVoltar").onclick = ecraInicio;

    $all(".opcao").forEach(function (btn) {
      btn.onclick = function () {
        if (btn.dataset.id === w.id) {
          SRS.avaliar(w.id, primeira);
          if (!primeira) sessao.perfeita = false;
          acertou(w);
        } else {
          if (primeira) { SRS.avaliar(w.id, false); sessao.perfeita = false; }
          primeira = false;
          btn.classList.add("errada");
          btn.disabled = true;
          AudioMgr.frase("almost");
          setTimeout(function () { AudioMgr.palavra(w.id); }, 1500);
        }
      };
    });
  }

  function acertou(w) {
    AudioMgr.somAcerto();
    var f = fraseFeliz();
    render(
      '<div class="ecra ecra-msg">' + confetti() +
        '<div class="mascote grande salta">' + ART.svg(aleatorio(["mascote_kika", "mascote_lulu"])) + "</div>" +
        '<div class="cartao-arte media">' + ART.svg(w.id) + "</div>" +
        '<p class="balao">' + w.en + "! " + ({great:"Great job!", well_done:"Well done!", fantastic:"Fantastic!"})[f] + "</p>" +
      "</div>"
    );
    setTimeout(function () { AudioMgr.frase(f); }, 300);
    setTimeout(function () {
      sessao.i++;
      if (sessao.i < sessao.fila.length) pergunta();
      else fimJogo();
    }, 2100);
  }

  function fimJogo() {
    var ganhas = sessao.perfeita ? 2 : 1;
    SRS.darEstrela(ganhas);
    AudioMgr.somEstrela();
    setTimeout(function () { AudioMgr.frase("star"); }, 400);

    render(
      '<div class="ecra ecra-msg">' + confetti() +
        '<div class="estrela-premio">' + ART.svg("estrela") + "</div>" +
        '<p class="balao">You got ' + (ganhas === 2 ? "two stars" : "a star") + "! &#11088;</p>" +
        '<div class="mascotes"><div class="mascote salta">' + ART.svg("mascote_kika") +
          '</div><div class="mascote salta">' + ART.svg("mascote_lulu") + "</div></div>" +
        '<div class="botoes-fim">' +
          '<button class="btn-grande btn-jogar" id="btnOutra"><span>Play again</span></button>' +
          '<button class="btn-grande btn-aprender" id="btnCasa"><span>&#8962;</span></button>' +
        "</div>" +
      "</div>"
    );
    $("#btnOutra").onclick = ecraJogar;
    $("#btnCasa").onclick = ecraInicio;
  }

  /* ---- painel dos pais (PT) ---------------------------------------- */

  function ecraPais() {
    var linhas = SRS.resumo().map(function (r) {
      var niveis = "";
      for (var n = 1; n <= 5; n++) {
        niveis += '<span class="nivel' + (r.level >= n ? " cheio" : "") + '"></span>';
      }
      return '<tr class="' + (r.seen ? "" : "nao-vista") + '">' +
        "<td>" + r.word.en + '<span class="pt">' + r.word.pt + "</span></td>" +
        '<td class="niveis">' + niveis + "</td>" +
        "<td>" + (r.seen ? (r.due ? '<span class="tag-due">rever hoje</span>' : "&#10003;") : "nova") + "</td>" +
      "</tr>";
    }).join("");

    render(
      '<div class="ecra ecra-pais">' +
        "<h2>Painel dos pais</h2>" +
        '<p class="pais-info">Estrelas: <b>' + SRS.getStars() + "</b> &nbsp;·&nbsp; Palavras aprendidas: <b>" +
          SRS.palavrasVistas().length + "/" + APP_DATA.words.length + "</b> &nbsp;·&nbsp; Para rever hoje: <b>" +
          SRS.palavrasDue().length + "</b></p>" +
        '<div class="tema-escolha">Tema: ' +
          '<button class="btn-tema" data-tema="menina">&#127856; Rosa</button>' +
          '<button class="btn-tema" data-tema="menino">&#128664; Azul</button>' +
        "</div>" +
        '<div class="tabela-wrap"><table>' + linhas + "</table></div>" +
        '<p class="pais-nota">Sem os ficheiros de áudio, a app usa a voz do próprio tablet. ' +
          "Para vozes melhores, corre <code>scripts/gerar_audio.py</code> (ver README).</p>" +
        '<div class="botoes-fim">' +
          '<button class="btn-pequeno" id="btnFechar">Fechar</button>' +
          '<button class="btn-pequeno perigo" id="btnReset">Recomeçar do zero</button>' +
        "</div>" +
      "</div>"
    );

    $("#btnFechar").onclick = ecraInicio;
    $all(".btn-tema").forEach(function (b) {
      b.onclick = function () { aplicarTema(b.dataset.tema); };
    });
    var btnReset = $("#btnReset");
    var confirmar = false;
    btnReset.onclick = function () {
      if (!confirmar) {
        confirmar = true;
        btnReset.textContent = "Tens a certeza? Toca outra vez";
      } else {
        SRS.reset();
        aplicarTema(SRS.getTheme());
        ecraInicio();
      }
    };
  }

  /* ---- arranque ---------------------------------------------------- */

  function aplicarTema(t) {
    SRS.setTheme(t);
    document.body.dataset.theme = t;
  }

  document.addEventListener("DOMContentLoaded", function () {
    app = $("#app");
    document.body.dataset.theme = SRS.getTheme();
    ecraInicio();
  });
})();
