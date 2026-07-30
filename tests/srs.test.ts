import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import {
  useSrsStore,
  STORAGE_KEY,
  INTERVALOS_DIAS,
  MAX_NOVAS_POR_SESSAO,
} from '../app/stores/srs'
import { words, frasesById } from '../app/utils/packs'
import { NIVEL_DESBLOQUEIO_FRASES } from '../app/stores/srs'

const DIA_MS = 24 * 60 * 60 * 1000

beforeEach(() => {
  setActivePinia(createPinia())
  localStorage.clear()
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-07-28T10:00:00Z'))
})

afterEach(() => vi.useRealTimers())

describe('estado inicial', () => {
  it('todas as palavras começam novas', () => {
    const srs = useSrsStore()
    expect(srs.palavrasNovas.length).toBe(words.length)
    expect(srs.palavrasVistas.length).toBe(0)
    expect(srs.stars).toBe(0)
    expect(srs.theme).toBe('menina')
  })

  it('escolherNovas devolve no máximo MAX_NOVAS_POR_SESSAO, pela ordem dos packs', () => {
    const srs = useSrsStore()
    const novas = srs.escolherNovas()
    expect(novas.length).toBe(MAX_NOVAS_POR_SESSAO)
    expect(novas.map((w) => w.id)).toEqual(words.slice(0, 4).map((w) => w.id))
  })
})

describe('marcarVista e avaliar', () => {
  it('marcarVista põe seen e due imediato', () => {
    const srs = useSrsStore()
    srs.marcarVista('red')
    expect(srs.palavrasVistas.map((w) => w.id)).toEqual(['red'])
    expect(srs.palavrasDue.map((w) => w.id)).toEqual(['red'])
  })

  it('acertar sobe nível e agenda pelo intervalo do novo nível', () => {
    const srs = useSrsStore()
    srs.marcarVista('red')
    srs.avaliar('red', true)
    expect(srs.cards.red.level).toBe(1)
    expect(srs.cards.red.due).toBe(Date.now() + INTERVALOS_DIAS[1] * DIA_MS)
    expect(srs.palavrasDue.length).toBe(0)
  })

  it('nível satura em 5', () => {
    const srs = useSrsStore()
    srs.marcarVista('red')
    for (let i = 0; i < 8; i++) srs.avaliar('red', true)
    expect(srs.cards.red.level).toBe(5)
    expect(srs.cards.red.due).toBe(Date.now() + 14 * DIA_MS)
  })

  it('errar desce nível (mínimo 0) e volta a ficar due', () => {
    const srs = useSrsStore()
    srs.marcarVista('red')
    srs.avaliar('red', true)
    srs.avaliar('red', false)
    expect(srs.cards.red.level).toBe(0)
    expect(srs.palavrasDue.map((w) => w.id)).toEqual(['red'])
    srs.avaliar('red', false)
    expect(srs.cards.red.level).toBe(0)
  })

  it('conta ok e ko', () => {
    const srs = useSrsStore()
    srs.marcarVista('red')
    srs.avaliar('red', true)
    srs.avaliar('red', false)
    expect(srs.cards.red.ok).toBe(1)
    expect(srs.cards.red.ko).toBe(1)
  })
})

describe('fila de jogo e distratores', () => {
  it('fila usa vencidas primeiro e completa com vistas, sem repetir', () => {
    const srs = useSrsStore()
    for (const id of ['red', 'blue', 'yellow', 'green', 'pink']) srs.marcarVista(id)
    srs.avaliar('red', true) // red deixa de estar due
    const fila = srs.filaDeJogo(8)
    expect(fila.length).toBe(5)
    expect(new Set(fila.map((w) => w.id)).size).toBe(5)
  })

  it('fila respeita o tamanho pedido', () => {
    const srs = useSrsStore()
    for (const w of words.slice(0, 10)) srs.marcarVista(w.id)
    expect(srs.filaDeJogo(8).length).toBe(8)
  })

  it('distratores: 2, nunca a própria palavra', () => {
    const srs = useSrsStore()
    for (const id of ['red', 'blue', 'yellow']) srs.marcarVista(id)
    const d = srs.distratores('red', 2)
    expect(d.length).toBe(2)
    expect(d.map((w) => w.id)).not.toContain('red')
  })

  it('distratores completam com não vistas se preciso', () => {
    const srs = useSrsStore()
    srs.marcarVista('red')
    const d = srs.distratores('red', 2)
    expect(d.length).toBe(2)
  })
})

describe('persistência', () => {
  it('grava e recarrega de localStorage na chave legacy', () => {
    const srs = useSrsStore()
    srs.marcarVista('red')
    srs.avaliar('red', true)
    srs.darEstrela(2)
    srs.setTheme('menino')

    const raw = localStorage.getItem(STORAGE_KEY)
    expect(raw).toBeTruthy()

    setActivePinia(createPinia())
    const srs2 = useSrsStore()
    srs2.load()
    expect(srs2.cards.red.level).toBe(1)
    expect(srs2.stars).toBe(2)
    expect(srs2.theme).toBe('menino')
  })

  it('lê estado gravado pela app legacy (campos extra ignorados)', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        cards: { red: { level: 3, due: 0, seen: true, ok: 5, ko: 1 } },
        stars: 7,
        theme: 'menina',
        lastSession: 123,
      }),
    )
    const srs = useSrsStore()
    srs.load()
    expect(srs.cards.red.level).toBe(3)
    expect(srs.stars).toBe(7)
  })

  it('reset limpa tudo', () => {
    const srs = useSrsStore()
    srs.marcarVista('red')
    srs.darEstrela()
    srs.reset()
    expect(srs.palavrasVistas.length).toBe(0)
    expect(srs.stars).toBe(0)
  })
})

describe('resumo', () => {
  it('uma linha por palavra, com estado correto', () => {
    const srs = useSrsStore()
    srs.marcarVista('red')
    srs.avaliar('red', true)
    const r = srs.resumo
    expect(r.length).toBe(words.length)
    const red = r.find((x) => x.word.id === 'red')!
    expect(red.level).toBe(1)
    expect(red.seen).toBe(true)
    expect(red.due).toBe(false)
    const blue = r.find((x) => x.word.id === 'blue')!
    expect(blue.seen).toBe(false)
    expect(blue.level).toBe(0)
  })
})

describe('portão de novas por progresso (sem relógio)', () => {
  it('início: 4 novas disponíveis', () => {
    const srs = useSrsStore()
    expect(srs.novasDisponiveis()).toBe(MAX_NOVAS_POR_SESSAO)
    expect(srs.escolherNovas().length).toBe(4)
  })

  it('4 palavras fracas fecham o portão', () => {
    const srs = useSrsStore()
    for (const w of srs.escolherNovas()) srs.marcarVista(w.id)
    expect(srs.novasDisponiveis()).toBe(0)
    expect(srs.escolherNovas()).toEqual([])
  })

  it('dominar as palavras (nível ≥2) reabre o portão', () => {
    const srs = useSrsStore()
    const novas = srs.escolherNovas()
    for (const w of novas) srs.marcarVista(w.id)
    // 1.º jogo perfeito: nível 1 — ainda fechado (fracas) e due no futuro
    for (const w of novas) srs.avaliar(w.id, true)
    expect(srs.novasDisponiveis()).toBe(0)
    // 2.º jogo perfeito: nível 2 — abre
    for (const w of novas) srs.avaliar(w.id, true)
    expect(srs.novasDisponiveis()).toBe(MAX_NOVAS_POR_SESSAO)
  })

  it('revisões pendentes fecham o portão mesmo com poucas fracas', () => {
    const srs = useSrsStore()
    srs.marcarVista('red')
    for (let k = 0; k < 2; k++) srs.avaliar('red', true) // nível 2, due futuro
    expect(srs.novasDisponiveis()).toBe(4)
    srs.avaliar('red', false) // errou: due imediato
    expect(srs.palavrasDue.length).toBe(1)
    expect(srs.novasDisponiveis()).toBe(0)
  })

  it('portão parcial: 2 fracas → 2 novas', () => {
    const srs = useSrsStore()
    srs.marcarVista('red')
    srs.marcarVista('blue')
    for (const id of ['red', 'blue']) {
      srs.avaliar(id, true)
    }
    // nível 1 (fracas) mas due no futuro → sem due pendente
    expect(srs.novasDisponiveis()).toBe(2)
    expect(srs.escolherNovas().length).toBe(2)
  })

  it('escolherNovas com packId tira só desse tema', () => {
    const srs = useSrsStore()
    const novas = srs.escolherNovas(4, 'escola')
    expect(novas.length).toBe(4)
    expect(novas.every((w) => w.pack === 'escola')).toBe(true)
  })
})

describe('frases de contexto', () => {
  function dominar(srs: ReturnType<typeof useSrsStore>, id: string) {
    srs.marcarVista(id)
    for (let k = 0; k < NIVEL_DESBLOQUEIO_FRASES; k++) srs.avaliar(id, true)
  }

  it('há 24 frases-piloto nas cores', () => {
    expect(Object.keys(frasesById).filter((id) => id.startsWith('red_')).length).toBe(3)
    expect(Object.keys(frasesById).length).toBeGreaterThanOrEqual(24)
  })

  it('frases desbloqueiam com a palavra-mãe a nível ≥3', () => {
    const srs = useSrsStore()
    expect(srs.frasesDesbloqueadas.length).toBe(0)
    dominar(srs, 'red')
    expect(srs.frasesDesbloqueadas.map((f) => f.frase.id)).toEqual([
      'red_1', 'red_2', 'red_3',
    ])
  })

  it('escolherFrasesNovas respeita máx 4 e filtro de pack', () => {
    const srs = useSrsStore()
    dominar(srs, 'red')
    dominar(srs, 'blue')
    expect(srs.escolherFrasesNovas().length).toBe(4)
    expect(srs.escolherFrasesNovas(4, 'cores').every((f) => f.word.pack === 'cores')).toBe(true)
    expect(srs.escolherFrasesNovas(4, 'quarto')).toEqual([])
  })

  it('frase vista entra no SRS e fica due como um cartão normal', () => {
    const srs = useSrsStore()
    dominar(srs, 'red')
    srs.marcarVista('red_1')
    expect(srs.frasesDue.map((f) => f.frase.id)).toEqual(['red_1'])
    srs.avaliar('red_1', true)
    expect(srs.frasesDue.length).toBe(0)
    expect(srs.cards.red_1!.level).toBe(1)
  })

  it('filaDeJogo mistura frases due com palavras due', () => {
    const srs = useSrsStore()
    dominar(srs, 'red')
    srs.marcarVista('blue') // palavra due
    srs.marcarVista('red_1') // frase due
    const fila = srs.filaDeJogo(8)
    const ids = fila.map((c) => c.id)
    expect(ids).toContain('blue')
    expect(ids).toContain('red_1')
    const cartaoFrase = fila.find((c) => c.id === 'red_1')!
    expect(cartaoFrase.frase!.en).toBe('The apple is red.')
    expect(cartaoFrase.word.id).toBe('red')
  })

  it('fila sem due completa com vistas (palavras e frases)', () => {
    const srs = useSrsStore()
    dominar(srs, 'red')
    srs.marcarVista('red_1')
    srs.avaliar('red_1', true)
    const fila = srs.filaDeJogo(8)
    expect(fila.length).toBeGreaterThanOrEqual(2)
    expect(new Set(fila.map((c) => c.id)).size).toBe(fila.length)
  })
})

describe('garantia de desbloqueio ao fim de 4 jogos', () => {
  it('mesmo com palavras fracas e revisões pendentes, 4 jogos abrem novas', () => {
    const srs = useSrsStore()
    for (const w of srs.escolherNovas()) srs.marcarVista(w.id)
    // erra tudo: fracas + due pendente → portão de progresso fechado
    for (const w of srs.palavrasVistas) srs.avaliar(w.id, false)
    expect(srs.novasDisponiveis()).toBe(0)

    for (let j = 0; j < 3; j++) srs.registarJogo()
    expect(srs.novasDisponiveis()).toBe(0) // 3 ainda não chega
    srs.registarJogo() // 4.º jogo
    expect(srs.novasDisponiveis()).toBe(MAX_NOVAS_POR_SESSAO)
    expect(srs.escolherNovas().length).toBe(4)
  })

  it('aprender novas reinicia o contador de jogos', () => {
    const srs = useSrsStore()
    for (let j = 0; j < 4; j++) srs.registarJogo()
    expect(srs.novasDisponiveis()).toBe(4)
    srs.marcarVista(srs.escolherNovas()[0]!.id)
    expect(srs.jogosDesdeNovas).toBe(0)
  })

  it('o progresso continua a poder abrir antes dos 4 jogos', () => {
    const srs = useSrsStore()
    srs.marcarVista('red')
    for (let k = 0; k < 2; k++) srs.avaliar('red', true) // nível 2, sem due
    expect(srs.jogosDesdeNovas).toBe(0)
    expect(srs.novasDisponiveis()).toBe(4)
  })

  it('contador persiste em localStorage', () => {
    const srs = useSrsStore()
    srs.registarJogo()
    srs.registarJogo()
    setActivePinia(createPinia())
    const srs2 = useSrsStore()
    srs2.load()
    expect(srs2.jogosDesdeNovas).toBe(2)
  })
})
