/* =====================================================================
   data.js — Vocabulário e frases-guia
   Fonte única de dados. O bloco entre os marcadores JSON-START/JSON-END
   é JSON estrito: o script scripts/gerar_audio.py lê-o daqui, para os
   dados nunca ficarem dessincronizados.
   Para migrar para Nuxt: transformar em ficheiro .json ou composable.
   ===================================================================== */

const APP_DATA = /*JSON-START*/{
  "packs": [
    { "id": "cores",  "nome": "Cores",  "icone": "crayon" },
    { "id": "casa",   "nome": "Casa",   "icone": "door" },
    { "id": "escola", "nome": "Escola", "icone": "backpack" }
  ],
  "words": [
    { "id": "red",    "en": "red",    "pt": "vermelho",      "pack": "cores", "cor": "#e94f4f" },
    { "id": "blue",   "en": "blue",   "pt": "azul",          "pack": "cores", "cor": "#4f7fe9" },
    { "id": "yellow", "en": "yellow", "pt": "amarelo",       "pack": "cores", "cor": "#f2c94c" },
    { "id": "green",  "en": "green",  "pt": "verde",         "pack": "cores", "cor": "#5fbb63" },
    { "id": "pink",   "en": "pink",   "pt": "cor-de-rosa",   "pack": "cores", "cor": "#f27fb2" },
    { "id": "purple", "en": "purple", "pt": "roxo",          "pack": "cores", "cor": "#9b6dd6" },
    { "id": "orange", "en": "orange", "pt": "laranja",       "pack": "cores", "cor": "#f2994a" },
    { "id": "black",  "en": "black",  "pt": "preto",         "pack": "cores", "cor": "#3d3a3a" },

    { "id": "car",    "en": "car",    "pt": "carro",   "pack": "casa" },
    { "id": "ball",   "en": "ball",   "pt": "bola",    "pack": "casa" },
    { "id": "cup",    "en": "cup",    "pt": "copo",    "pack": "casa" },
    { "id": "water",  "en": "water",  "pt": "água",    "pack": "casa" },
    { "id": "bed",    "en": "bed",    "pt": "cama",    "pack": "casa" },
    { "id": "chair",  "en": "chair",  "pt": "cadeira", "pack": "casa" },
    { "id": "table",  "en": "table",  "pt": "mesa",    "pack": "casa" },
    { "id": "door",   "en": "door",   "pt": "porta",   "pack": "casa" },
    { "id": "apple",  "en": "apple",  "pt": "maçã",    "pack": "casa" },
    { "id": "banana", "en": "banana", "pt": "banana",  "pack": "casa" },

    { "id": "pencil",   "en": "pencil",   "pt": "lápis",         "pack": "escola" },
    { "id": "crayon",   "en": "crayon",   "pt": "lápis de cera", "pack": "escola" },
    { "id": "book",     "en": "book",     "pt": "livro",         "pack": "escola" },
    { "id": "backpack", "en": "backpack", "pt": "mochila",       "pack": "escola" },
    { "id": "scissors", "en": "scissors", "pt": "tesoura",       "pack": "escola" }
  ],
  "phrases": {
    "hello":      "Hi! Let's play with English!",
    "learn":      "Tap the card to hear the word!",
    "play":       "Listen carefully and tap the right picture!",
    "great":      "Great job!",
    "well_done":  "Well done!",
    "fantastic":  "Fantastic!",
    "almost":     "Almost! Listen again.",
    "star":       "You got a star!",
    "bye":        "That's all for today! See you tomorrow!",
    "no_new":     "No new words today. Let's play!"
  }
}/*JSON-END*/;

/* Índice rápido por id */
const WORDS_BY_ID = {};
APP_DATA.words.forEach(function (w) { WORDS_BY_ID[w.id] = w; });
