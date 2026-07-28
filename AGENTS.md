# English Fun! — Guia para agentes

Jogo estático (Nuxt 4 SSG) de vocabulário inglês para crianças 5-9,
com repetição espaçada. Deploy automático no GitHub Pages via Actions.

## Regras de ouro

1. Depois de QUALQUER alteração de conteúdo: `npm run check` (tem de dar 0 erros) e `npm test`.
2. Ids: `^[a-z][a-z0-9_]*$` (inglês, minúsculas, underscore). 1 pack = 1 ficheiro.
3. Texto para a criança: inglês simples. Painel dos pais e commits: português.
4. Errar nunca pune: nada de X vermelhos, sons negativos ou "wrong".
5. Arte: SVG viewBox 0 0 100 100, traço grosso arredondado, cores do estilo
   existente, filtro crayon aplicado pelo `wrap()` — seguir os exemplos em
   `app/utils/art.mjs`.
6. Não tocar em `legacy/` (referência histórica até validação final).

## Adicionar um tema (pack)

1. Criar `data/packs/<id>.json`:
   ```json
   {
     "id": "animais", "nome": "Animais", "en": "Animals", "icone": "dog",
     "ordem": 4, "grupo": "parque",
     "words": [{ "id": "dog", "en": "dog", "pt": "cão" }]
   }
   ```
   `ordem` única (define a sequência de aprendizagem); `grupo` opcional
   (contexto: casa, rua, escola, …) — tem de corresponder a um id em
   `data/grupos.json`; `icone` é um id com arte.
2. Para cada palavra nova, adicionar o desenho em `app/utils/art.mjs`
   (`D.<id> = wrap(...)`) e a cor de borda em `COR_DOMINANTE` (entrada
   obrigatória — `npm run check` falha sem ela). Palavras com campo `cor`
   (hex) usam o cartão de cor automático — não precisam de desenho.
   Antes de dar como feito, pré-visualizar com
   `node scripts/preview_art.mjs <id>` e OLHAR para o PNG gerado — só
   depois de confirmar visualmente é que se considera o desenho pronto.
3. Gerar áudio: `python3 scripts/gerar_audio.py` (precisa de rede).
   Sem mp3 a app funciona com voz do browser — é aviso, não erro.
4. `npm run check` e `npm test`.

## Adicionar palavras a um pack existente

Igual aos passos 2-4 acima, editando o JSON do pack.

## Mundos (mapa de dois níveis)

Os packs organizam-se em mundos, definidos em `data/grupos.json`:
```json
{ "id": "casa", "en": "Home", "icone": "door", "ordem": 1 }
```
`icone` precisa de arte própria em `app/utils/art.mjs` (mesmo processo
acima: `D.<icone>`, `COR_DOMINANTE`, preview obrigatório). Packs sem
`grupo` continuam a aparecer soltos no mapa. `ordem` única entre mundos.

## Frases de contexto (fase futura — schema já suportado)

Cada palavra aceita até 3 frases:
```json
"phrases": [
  { "id": "wallet_1", "en": "I need my wallet!",
    "pt": "Preciso da minha carteira!", "scene": "wallet_need" }
]
```
Id da frase começa pelo id da palavra + `_`. O campo `scene` referirá
uma animação SVG (ainda sem suporte na UI — não inventar).

O pack `cores` já tem `phrases` piloto (3 por cor) com áudio gerado —
conteúdo válido, mas dormente: sem ecrã/UI que o mostre. Não expandir
para outros packs nem construir UI sem indicação explícita.

## Arquitetura (mapa rápido)

- `data/packs/*.json` — conteúdo (fonte única); 13 packs cobrindo os
  mundos casa, rua, escola e eu (inclui os novos corpo, roupa, números,
  comida, praia)
- `data/grupos.json` — mundos do mapa (id/en/icone/ordem)
- `data/ui-phrases.json` — frases de sistema da mascote
- `app/utils/art.mjs` — TODA a arte SVG (módulo puro, importado também pelo check)
- `app/stores/srs.ts` — motor de repetição espaçada (níveis 0-5,
  intervalos [0,1,2,4,7,14] dias; novas por progresso: só abrem sem revisões pendentes e com <4 palavras nível<2, máx 4 de cada vez; localStorage `jogoIngles.v1`)
- `app/composables/useAudio.ts` — mp3 com fallback Web Speech
- `app/pages/` — index (início), learn, play, pais
- `scripts/check.mjs` — validador; `scripts/gerar_audio.py` — TTS;
  `scripts/preview_art.mjs` — gera PNG de um desenho para inspeção visual
