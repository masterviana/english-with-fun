import { defineStore } from 'pinia'
import { words, frasesById } from '../utils/packs'
import type { FraseComPalavra } from '../utils/packs'
import type { Word, Phrase } from '../types/content'

export const STORAGE_KEY = 'jogoIngles.v1'
export const INTERVALOS_DIAS = [0, 1, 2, 4, 7, 14]
export const MAX_NOVAS_POR_SESSAO = 4
/* portão de novas por PROGRESSO (sem relógio): só abrem novas quando
   há menos de MAX_APRENDIZES palavras "fracas" (nível < 2) e nenhuma
   revisão pendente */
export const MAX_APRENDIZES = 4
/* garantia anti-frustração: ao fim deste nº de jogos completos sem
   palavras novas, o desbloqueio é FORÇADO (o progresso pode abrir antes) */
export const JOGOS_PARA_DESBLOQUEIO = 4
/* frases de contexto desbloqueiam quando a palavra-mãe atinge este nível */
export const NIVEL_DESBLOQUEIO_FRASES = 3
const DIA_MS = 24 * 60 * 60 * 1000

export interface CartaoJogo {
  id: string
  word: Word
  frase?: Phrase
}

export interface CardState {
  level: number
  due: number
  seen: boolean
  ok: number
  ko: number
}

export type Theme = 'menina' | 'menino'

interface SrsState {
  cards: Record<string, CardState>
  stars: number
  theme: Theme
  loaded: boolean
  /* jogos completos desde as últimas palavras novas */
  jogosDesdeNovas: number
}

function novoCard(): CardState {
  return { level: 0, due: 0, seen: false, ok: 0, ko: 0 }
}

export const useSrsStore = defineStore('srs', {
  state: (): SrsState => ({
    cards: {},
    stars: 0,
    theme: 'menina',
    loaded: false,
    jogosDesdeNovas: 0,
  }),

  getters: {
    palavrasVistas(state): Word[] {
      return words.filter((w) => state.cards[w.id]?.seen)
    },
    palavrasNovas(state): Word[] {
      return words.filter((w) => !state.cards[w.id]?.seen)
    },
    palavrasDue(): Word[] {
      const t = Date.now()
      return this.palavrasVistas.filter((w) => this.cards[w.id]!.due <= t)
    },
    frasesDesbloqueadas(state): FraseComPalavra[] {
      return Object.values(frasesById).filter(
        ({ word }) => (state.cards[word.id]?.level ?? 0) >= NIVEL_DESBLOQUEIO_FRASES,
      )
    },
    frasesVistas(): FraseComPalavra[] {
      return this.frasesDesbloqueadas.filter((f) => this.cards[f.frase.id]?.seen)
    },
    frasesDue(): FraseComPalavra[] {
      const t = Date.now()
      return this.frasesVistas.filter((f) => this.cards[f.frase.id]!.due <= t)
    },
    resumo(state) {
      const t = Date.now()
      return words.map((w) => {
        const c = state.cards[w.id]
        return {
          word: w,
          level: c?.level ?? 0,
          seen: c?.seen ?? false,
          due: Boolean(c?.seen && c.due <= t),
          ok: c?.ok ?? 0,
          ko: c?.ko ?? 0,
        }
      })
    },
  },

  actions: {
    load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const s = JSON.parse(raw)
          this.cards = s.cards ?? {}
          this.stars = s.stars ?? 0
          this.theme = s.theme === 'menino' ? 'menino' : 'menina'
          this.jogosDesdeNovas = s.jogosDesdeNovas ?? 0
        }
      } catch {
        /* localStorage indisponível → continua em memória */
      }
      this.loaded = true
    },

    save() {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            cards: this.cards,
            stars: this.stars,
            theme: this.theme,
            jogosDesdeNovas: this.jogosDesdeNovas,
          }),
        )
      } catch {
        /* sem persistência, continua em memória */
      }
    },

    card(wordId: string): CardState {
      if (!this.cards[wordId]) this.cards[wordId] = novoCard()
      return this.cards[wordId]!
    },

    /* quantas palavras novas ainda cabem hoje (dosagem diária Anki);
       função e não getter: depende da hora atual, que não é reativa */
    /* Portão por progresso (sem relógio): novas só abrem quando não há
       revisões pendentes e as palavras "fracas" (nível < 2) são poucas.
       Função (não getter): depende de Date.now() via palavrasDue. */
    novasDisponiveis(): number {
      // garantia: 4 jogos completos sem novas → desbloqueio forçado
      if (this.jogosDesdeNovas >= JOGOS_PARA_DESBLOQUEIO) return MAX_NOVAS_POR_SESSAO
      if (this.palavrasDue.length > 0) return 0
      const aprendizes = this.palavrasVistas.filter(
        (w) => this.cards[w.id]!.level < 2,
      ).length
      return Math.max(0, Math.min(MAX_NOVAS_POR_SESSAO, MAX_APRENDIZES - aprendizes))
    },

    /* chamar no FIM de cada jogo completo (o Play trata disso) */
    registarJogo() {
      this.jogosDesdeNovas++
      this.save()
    },

    /* Novas para uma sessão de Learn: respeita a dosagem diária e,
       se packId vier, tira só desse tema. */
    escolherNovas(max = MAX_NOVAS_POR_SESSAO, packId?: string): Word[] {
      const limite = Math.min(max, this.novasDisponiveis())
      const pool = packId
        ? this.palavrasNovas.filter((w) => w.pack === packId)
        : this.palavrasNovas
      return pool.slice(0, limite)
    },

    escolherFrasesNovas(max = MAX_NOVAS_POR_SESSAO, packId?: string): FraseComPalavra[] {
      let pool = this.frasesDesbloqueadas.filter((f) => !this.cards[f.frase.id]?.seen)
      if (packId) pool = pool.filter((f) => f.word.pack === packId)
      return pool.slice(0, max)
    },

    filaDeJogo(tamanho = 8): CartaoJogo[] {
      const dueP: CartaoJogo[] = this.palavrasDue.map((w) => ({ id: w.id, word: w }))
      const dueF: CartaoJogo[] = this.frasesDue.map((f) => ({
        id: f.frase.id, word: f.word, frase: f.frase,
      }))
      let fila = this.baralhar([...dueP, ...dueF]).slice(0, tamanho)
      if (fila.length < tamanho) {
        const usados = new Set(fila.map((c) => c.id))
        const extraP: CartaoJogo[] = this.palavrasVistas
          .filter((w) => !usados.has(w.id))
          .map((w) => ({ id: w.id, word: w }))
        const extraF: CartaoJogo[] = this.frasesVistas
          .filter((f) => !usados.has(f.frase.id))
          .map((f) => ({ id: f.frase.id, word: f.word, frase: f.frase }))
        fila = fila.concat(this.baralhar([...extraP, ...extraF]).slice(0, tamanho - fila.length))
      }
      return fila
    },

    distratores(wordId: string, quantos = 2): Word[] {
      let pool = this.palavrasVistas.filter((w) => w.id !== wordId)
      if (pool.length < quantos) {
        const ids = new Set(pool.map((w) => w.id))
        pool = pool.concat(
          words.filter((w) => w.id !== wordId && !ids.has(w.id)),
        )
      }
      return this.baralhar(pool).slice(0, quantos)
    },

    marcarVista(wordId: string) {
      const c = this.card(wordId)
      if (!c.seen) {
        c.seen = true
        c.level = 0
        c.due = Date.now()
        this.jogosDesdeNovas = 0 // aprendeu novas → contador reinicia
        this.save()
      }
    },

    /* correta = acertou à PRIMEIRA tentativa */
    avaliar(wordId: string, correta: boolean) {
      const c = this.card(wordId)
      if (correta) {
        c.ok++
        c.level = Math.min(5, c.level + 1)
        c.due = Date.now() + INTERVALOS_DIAS[c.level]! * DIA_MS
      } else {
        c.ko++
        c.level = Math.max(0, c.level - 1)
        c.due = Date.now()
      }
      this.save()
    },

    darEstrela(n = 1) {
      this.stars += n
      this.save()
    },

    setTheme(t: Theme) {
      this.theme = t
      this.save()
    },

    reset() {
      this.cards = {}
      this.stars = 0
      this.jogosDesdeNovas = 0
      this.save()
    },

    baralhar<T>(arr: readonly T[]): T[] {
      const a = arr.slice()
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j]!, a[i]!]
      }
      return a
    },
  },
})
