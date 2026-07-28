# English Fun! — regras para o Claude

## Git é do Vitor — NÃO MEXER

**NUNCA correr comandos git que alterem estado: nada de `git add`,
`commit`, `push`, `pull`, `merge`, `rebase`, `reset`, `branch`, amend
ou tags. Commits e pushes são SEMPRE feitos pelo Vitor, à mão.**
Consultas read-only (`git status`, `git log`, `git diff`) são permitidas.
No fim de cada trabalho, deixar as alterações no working tree e dizer ao
Vitor o que está pronto para commit.

## Contexto rápido

- Jogo de vocabulário de inglês (5-9 anos), repetição espaçada tipo Anki
  por progresso. Nuxt 4 SSG, deploy GitHub Pages via Actions.
- Repo: `masterviana/english-with-fun` → `baseURL /english-with-fun/`.
- Conteúdo: `data/packs/*.json` + `data/grupos.json`; arte em
  `app/utils/art.mjs` (+ `COR_DOMINANTE`); receita completa em `AGENTS.md`.
- Depois de mexer em conteúdo: `npm run check` (0 erros) e `npm test`.
- Arte nova: pré-visualizar SEMPRE com `node scripts/preview_art.mjs <id>`
  e olhar para o PNG antes de dar por boa.
- Áudio: `python3 scripts/gerar_audio.py` (voz AnaNeural, -30% palavras,
  -50% palavras ≤3 letras, almofada de 300ms via ffmpeg).
- Frases de contexto: motor existe mas está ADORMECIDO (sem UI) — não
  ligar sem o Vitor pedir.
