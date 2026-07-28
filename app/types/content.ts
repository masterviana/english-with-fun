export interface Phrase {
  id: string
  en: string
  pt: string
  scene?: string
}

export interface Word {
  id: string
  en: string
  pt: string
  cor?: string
  pack?: string
  phrases?: Phrase[]
}

export interface Grupo {
  id: string
  en: string
  icone: string
  ordem: number
}

export interface Pack {
  id: string
  nome: string
  en: string
  icone: string
  ordem: number
  grupo?: string
  words: Word[]
}
