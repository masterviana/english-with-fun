# English Fun! 🖍️

Jogo de vocabulário de inglês para crianças de ~5 anos, com repetição
espaçada (lógica tipo Anki) escondida por baixo de um jogo de cartões
ilustrados em estilo lápis de cera. Sem backend, sem build, funciona
offline no browser do tablet.

## Como usar

1. Abre o `index.html` num browser (no tablet ou no computador).
   - Duplo clique costuma chegar. Se preferires servir localmente:
     `python3 -m http.server` dentro desta pasta e abre `http://localhost:8000`.
2. **Learn** — apresenta até 4 palavras novas por dia (cartão + voz).
3. **Play** — quiz: ouve a palavra e toca na imagem certa (3 opções).
   É o quiz que alimenta o algoritmo de repetição espaçada.
4. O progresso (níveis, datas de revisão, estrelas) fica guardado no
   próprio browser (`localStorage`).

### Painel dos pais

No ecrã inicial, **mantém premida a engrenagem ⚙ (canto superior
direito) durante 1 segundo** (ou faz duplo clique). Mostra o nível de
cada palavra, o que está para rever hoje, muda o tema (rosa/azul) e
permite recomeçar do zero.

## Vozes (edge-tts)

Sem mais nada, a app usa a voz do próprio browser (Web Speech API) como
fallback. Para vozes muito melhores — a **en-US-AnaNeural**, voz de
criança da Microsoft — gera os mp3 uma vez:

```bash
pip install edge-tts
python3 scripts/gerar_audio.py
```

Isto enche `audio/en/` (palavras) e `audio/phrases/` (frases-guia).
A app deteta os ficheiros automaticamente; se um faltar, volta ao
fallback só para esse.

## Como funciona a repetição espaçada

- Cada palavra tem um nível **0–5**; os intervalos até à próxima revisão
  são `[hoje, 1, 2, 4, 7, 14]` dias.
- A criança nunca se auto-avalia: **acertar à primeira** no quiz sobe o
  nível; errar desce-o e a palavra volta a aparecer em breve.
- Máximo de **4 palavras novas** por sessão de Learn, para não saturar.
- O erro nunca é punido: sem X vermelho nem sons negativos — a mascote
  encoraja e a palavra repete-se.

## Estrutura (pensada para migrar para Nuxt)

```
index.html            entrada única (defs do filtro SVG "crayon" + scripts)
css/styles.css        temas via variáveis CSS (menina/menino)
js/data.js            FONTE ÚNICA de vocabulário e frases (bloco JSON)
js/art.js             ilustrações SVG (→ componentes <ArtXxx/> no Nuxt)
js/srs.js             motor de repetição espaçada (→ composable/store)
js/audio.js           mp3 com fallback Web Speech (→ composable)
js/app.js             ecrãs e navegação (→ pages/components)
scripts/gerar_audio.py  gera os mp3 com edge-tts a partir do data.js
audio/en/, audio/phrases/  mp3 gerados (opcionais)
```

Notas de migração: o bloco JSON do `data.js` extrai-se tal e qual para
um `.json`; o `SRS` e o `AudioMgr` são módulos sem dependências de DOM;
os desenhos do `art.js` são strings SVG fáceis de converter em SFCs.

## Acrescentar palavras

1. Junta a palavra ao array `words` do `js/data.js` (id, en, pt, pack).
2. Desenha o SVG correspondente no `js/art.js` (mesmo id).
3. Volta a correr `python3 scripts/gerar_audio.py`.

Packs futuros já previstos: animais e números (fase 2), frases curtas
("the car is red") quando as palavras que as compõem estiverem em nível
alto (fase 3).
