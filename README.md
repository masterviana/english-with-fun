# English Fun! 🖍️

Jogo de vocabulário de inglês para crianças (5-9 anos), com repetição
espaçada (lógica tipo Anki) escondida por baixo de um jogo de cartões
ilustrados em estilo lápis de cera. Nuxt 4, 100% estático, publicado
no GitHub Pages.

## Desenvolvimento

    npm install
    npm run dev        # http://localhost:3000/english-with-fun/
    npm test           # testes do motor SRS
    npm run check      # valida o conteúdo (packs, arte, áudio)
    npm run generate   # build estático em .output/public

## Conteúdo

Vocabulário em `data/packs/*.json` (1 ficheiro por tema). Para adicionar
temas/palavras, ver `AGENTS.md` — a receita serve para humanos e agentes.

## Vozes

    pip install edge-tts
    python3 scripts/gerar_audio.py

Gera mp3 (voz en-US-AnaNeural) em `public/audio/`. Sem eles, a app usa a
voz do browser (Web Speech API) — funciona na mesma.

## Deploy

Push a `main` → GitHub Actions corre check + testes + `nuxt generate` e
publica no Pages. Configuração única no GitHub: Settings → Pages →
Source: "GitHub Actions".

## Como funciona a repetição espaçada

- Nível 0-5 por palavra; intervalos `[hoje, 1, 2, 4, 7, 14]` dias.
- Acertar à primeira no quiz sobe o nível; errar desce-o e a palavra
  volta em breve. A criança nunca se auto-avalia.
- Novas dependem do progresso (sem relógio): abrem quando não há revisões
  pendentes e há menos de 4 palavras "fracas" (nível <2). Máx 4 de cada vez.
- O erro nunca é punido.
- Progresso em `localStorage` (`jogoIngles.v1`).

A versão anterior (vanilla JS) está em `legacy/` até validação final.
