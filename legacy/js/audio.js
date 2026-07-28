/* =====================================================================
   audio.js — Gestor de som

   1º tenta os mp3 gerados com edge-tts (audio/en/<id>.mp3 para as
   palavras, audio/phrases/<id>.mp3 para as frases-guia — tudo em
   en-US, voz de criança). Se o ficheiro não existir, usa a Web
   Speech API como fallback (en-US), com ritmo mais lento e tom mais
   agudo, adequado a uma criança.
   ===================================================================== */

var AudioMgr = (function () {
  var falhados = {};   // caminhos que já falharam → vai direto ao fallback
  var atual = null;    // Audio a tocar, para não sobrepor

  function pararAtual() {
    if (atual) { try { atual.pause(); } catch (e) {} atual = null; }
    if (window.speechSynthesis) { try { speechSynthesis.cancel(); } catch (e) {} }
  }

  function tocarFicheiro(caminho, aoFalhar) {
    var a = new Audio(caminho);
    atual = a;
    a.onerror = function () { falhados[caminho] = true; aoFalhar(); };
    a.play().catch(function () { falhados[caminho] = true; aoFalhar(); });
  }

  function falar(texto, lang) {
    if (!window.speechSynthesis) return;
    var u = new SpeechSynthesisUtterance(texto);
    u.lang = lang;
    u.rate = 0.8;   // devagarinho, para criança
    u.pitch = 1.25; // tom mais amigável
    var vozes = speechSynthesis.getVoices();
    var voz = vozes.find(function (v) { return v.lang.replace("_", "-").indexOf(lang) === 0; }) ||
              vozes.find(function (v) { return v.lang.slice(0, 2) === lang.slice(0, 2); });
    if (voz) u.voice = voz;
    speechSynthesis.speak(u);
  }

  /* Diz uma palavra em inglês. */
  function palavra(wordId) {
    pararAtual();
    var w = WORDS_BY_ID[wordId];
    if (!w) return;
    var caminho = "audio/en/" + wordId + ".mp3";
    if (falhados[caminho]) { falar(w.en, "en-US"); return; }
    tocarFicheiro(caminho, function () { falar(w.en, "en-US"); });
  }

  /* Diz uma frase-guia (também em inglês, imersão total). */
  function frase(fraseId) {
    pararAtual();
    var texto = APP_DATA.phrases[fraseId];
    if (!texto) return;
    var caminho = "audio/phrases/" + fraseId + ".mp3";
    if (falhados[caminho]) { falar(texto, "en-US"); return; }
    tocarFicheiro(caminho, function () { falar(texto, "en-US"); });
  }

  /* Pequenos sons de interface gerados com WebAudio (sem ficheiros). */
  var ctx = null;
  function beep(freqs, dur) {
    try {
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      var t = ctx.currentTime;
      freqs.forEach(function (f, i) {
        var o = ctx.createOscillator();
        var g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t + i * dur);
        g.gain.exponentialRampToValueAtTime(0.12, t + i * dur + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + (i + 1) * dur);
        o.connect(g); g.connect(ctx.destination);
        o.start(t + i * dur); o.stop(t + (i + 1) * dur + 0.05);
      });
    } catch (e) { /* sem WebAudio, sem problema */ }
  }

  function somAcerto()  { beep([523, 659, 784], 0.12); }        // dó-mi-sol
  function somEstrela() { beep([523, 659, 784, 1047], 0.11); }
  function somToque()   { beep([440], 0.08); }

  // Alguns browsers só carregam as vozes de forma assíncrona.
  if (window.speechSynthesis) {
    speechSynthesis.getVoices();
    speechSynthesis.onvoiceschanged = function () { speechSynthesis.getVoices(); };
  }

  return {
    palavra: palavra,
    frase: frase,
    somAcerto: somAcerto,
    somEstrela: somEstrela,
    somToque: somToque,
    parar: pararAtual
  };
})();
