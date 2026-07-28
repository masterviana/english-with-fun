import { wordsById } from '../utils/packs'
import uiPhrases from '../../data/ui-phrases.json'

/* Estado partilhado entre todas as chamadas (a app é 100% cliente) */
const falhados = new Set<string>()
let atual: HTMLAudioElement | null = null
let ctx: AudioContext | null = null

function pararAtual() {
  if (atual) {
    try {
      atual.pause()
    } catch {}
    atual = null
  }
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    try {
      speechSynthesis.cancel()
    } catch {}
  }
}

function falar(texto: string, lang = 'en-US') {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  const u = new SpeechSynthesisUtterance(texto)
  u.lang = lang
  u.rate = 0.8 // devagarinho, para criança
  u.pitch = 1.25 // tom mais amigável
  const vozes = speechSynthesis.getVoices()
  const voz =
    vozes.find((v) => v.lang.replace('_', '-').startsWith(lang)) ??
    vozes.find((v) => v.lang.slice(0, 2) === lang.slice(0, 2))
  if (voz) u.voice = voz
  speechSynthesis.speak(u)
}

function tocarFicheiro(caminho: string, aoFalhar: () => void) {
  const a = new Audio(caminho)
  atual = a
  a.onerror = () => {
    falhados.add(caminho)
    aoFalhar()
  }
  a.play().catch(() => {
    falhados.add(caminho)
    aoFalhar()
  })
}

function beep(freqs: number[], dur: number) {
  try {
    ctx = ctx ?? new AudioContext()
    const t = ctx.currentTime
    freqs.forEach((f, i) => {
      const o = ctx!.createOscillator()
      const g = ctx!.createGain()
      o.type = 'sine'
      o.frequency.value = f
      g.gain.setValueAtTime(0.0001, t + i * dur)
      g.gain.exponentialRampToValueAtTime(0.12, t + i * dur + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + (i + 1) * dur)
      o.connect(g)
      g.connect(ctx!.destination)
      o.start(t + i * dur)
      o.stop(t + (i + 1) * dur + 0.05)
    })
  } catch {
    /* sem WebAudio, sem problema */
  }
}

export function useAudio() {
  const base = useRuntimeConfig().app.baseURL

  function palavra(wordId: string) {
    pararAtual()
    const w = wordsById[wordId]
    if (!w) return
    const caminho = `${base}audio/en/${wordId}.mp3`
    if (falhados.has(caminho)) {
      falar(w.en)
      return
    }
    tocarFicheiro(caminho, () => falar(w.en))
  }

  function frase(fraseId: string) {
    pararAtual()
    const texto = (uiPhrases as Record<string, string>)[fraseId]
    if (!texto) return
    const caminho = `${base}audio/phrases/${fraseId}.mp3`
    if (falhados.has(caminho)) {
      falar(texto)
      return
    }
    tocarFicheiro(caminho, () => falar(texto))
  }

  return {
    palavra,
    frase,
    somAcerto: () => beep([523, 659, 784], 0.12), // dó-mi-sol
    somEstrela: () => beep([523, 659, 784, 1047], 0.11),
    somToque: () => beep([440], 0.08),
    parar: pararAtual,
  }
}
