import gruposData from '../../data/grupos.json'
import type { Grupo, Pack, Phrase, Word } from '../types/content'

const modules = import.meta.glob<{ default: Pack }>('../../data/packs/*.json', {
  eager: true,
})

export const packs: Pack[] = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.ordem - b.ordem)

export const words: Word[] = packs.flatMap((p) =>
  p.words.map((w) => ({ ...w, pack: p.id })),
)

export const wordsById: Record<string, Word> = Object.fromEntries(
  words.map((w) => [w.id, w]),
)

export interface FraseComPalavra {
  frase: Phrase
  word: Word
}

export const frasesById: Record<string, FraseComPalavra> = {}
for (const w of words) {
  for (const p of w.phrases ?? []) frasesById[p.id] = { frase: p, word: w }
}

export const grupos: Grupo[] = [...(gruposData as Grupo[])].sort(
  (a, b) => a.ordem - b.ordem,
)

export function packsDoGrupo(grupoId: string): Pack[] {
  return packs.filter((p) => p.grupo === grupoId)
}

export function packsSemGrupo(): Pack[] {
  return packs.filter((p) => !p.grupo)
}
