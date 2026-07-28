#!/usr/bin/env node
/* Valida o conteúdo do jogo: schema dos packs, ids únicos, arte e áudio.
   Erros → exit 1. Avisos (mp3 em falta) → exit 0. */

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { hasArt, corDominante } from '../app/utils/art.mjs'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const PACKS_DIR = join(RAIZ, 'data', 'packs')
const ID_RE = /^[a-z][a-z0-9_]*$/

const erros = []
const avisos = []
const idsPalavras = new Set()
const idsPacks = new Set()
const ordens = new Set()

/* grupos (mundos) */
let grupos = []
try {
  grupos = JSON.parse(readFileSync(join(RAIZ, 'data', 'grupos.json'), 'utf8'))
  const idsGrupos = new Set()
  const ordensGrupos = new Set()
  for (const g of grupos) {
    for (const campo of ['id', 'en', 'icone', 'ordem']) {
      if (g[campo] === undefined) erros.push(`grupos.json: grupo ${JSON.stringify(g.id ?? g)} sem "${campo}"`)
    }
    if (g.id && !ID_RE.test(g.id)) erros.push(`grupos.json: id "${g.id}" fora da convenção`)
    if (idsGrupos.has(g.id)) erros.push(`grupos.json: id repetido "${g.id}"`)
    idsGrupos.add(g.id)
    if (ordensGrupos.has(g.ordem)) erros.push(`grupos.json: ordem ${g.ordem} repetida`)
    ordensGrupos.add(g.ordem)
    if (g.icone && !hasArt(g.icone)) erros.push(`grupos.json: ícone "${g.icone}" sem arte`)
  }
  globalThis.__idsGrupos = idsGrupos
} catch (e) {
  erros.push(`data/grupos.json: ${e.message}`)
}

const ficheiros = readdirSync(PACKS_DIR).filter((f) => f.endsWith('.json')).sort()
if (ficheiros.length === 0) erros.push('data/packs/ está vazio')

for (const f of ficheiros) {
  let pack
  try {
    pack = JSON.parse(readFileSync(join(PACKS_DIR, f), 'utf8'))
  } catch (e) {
    erros.push(`${f}: JSON inválido — ${e.message}`)
    continue
  }

  for (const campo of ['id', 'nome', 'en', 'icone', 'ordem', 'words']) {
    if (pack[campo] === undefined) erros.push(`${f}: falta o campo "${campo}"`)
  }
  if (pack.id) {
    if (!ID_RE.test(pack.id)) erros.push(`${f}: id de pack "${pack.id}" fora da convenção ${ID_RE}`)
    if (f !== `${pack.id}.json`) erros.push(`${f}: o ficheiro deve chamar-se ${pack.id}.json`)
    if (idsPacks.has(pack.id)) erros.push(`${f}: id de pack repetido "${pack.id}"`)
    idsPacks.add(pack.id)
  }
  if (pack.ordem !== undefined) {
    if (ordens.has(pack.ordem)) erros.push(`${f}: ordem ${pack.ordem} repetida noutro pack`)
    ordens.add(pack.ordem)
  }
  if (pack.icone && !hasArt(pack.icone)) {
    erros.push(`${f}: ícone "${pack.icone}" sem arte em app/utils/art.mjs`)
  }
  if (pack.grupo && !ID_RE.test(pack.grupo)) {
    erros.push(`${f}: grupo "${pack.grupo}" fora da convenção ${ID_RE}`)
  }
  if (pack.grupo && globalThis.__idsGrupos && !globalThis.__idsGrupos.has(pack.grupo)) {
    erros.push(`${f}: grupo "${pack.grupo}" não existe em data/grupos.json`)
  }

  for (const w of pack.words ?? []) {
    for (const campo of ['id', 'en', 'pt']) {
      if (!w[campo]) erros.push(`${f}: palavra ${JSON.stringify(w.id ?? w)} sem "${campo}"`)
    }
    if (!w.id) continue
    if (!ID_RE.test(w.id)) erros.push(`${f}: id "${w.id}" fora da convenção ${ID_RE}`)
    if (idsPalavras.has(w.id)) erros.push(`${f}: id de palavra repetido "${w.id}"`)
    idsPalavras.add(w.id)
    if (!hasArt(w.id, w)) erros.push(`${f}: "${w.id}" sem arte em app/utils/art.mjs`)
    if (hasArt(w.id, w) && !corDominante(w.id, w)) {
      avisos.push(`${f}: "${w.id}" sem entrada em COR_DOMINANTE (borda cai no tema)`)
    }
    if (!existsSync(join(RAIZ, 'public', 'audio', 'en', `${w.id}.mp3`))) {
      avisos.push(`mp3 em falta: public/audio/en/${w.id}.mp3 (usa fallback Web Speech)`)
    }
    const phrases = w.phrases ?? []
    if (phrases.length > 3) erros.push(`${f}: "${w.id}" tem ${phrases.length} frases (máx 3)`)
    for (const p of phrases) {
      for (const campo of ['id', 'en', 'pt']) {
        if (!p[campo]) erros.push(`${f}: frase de "${w.id}" sem "${campo}"`)
      }
      if (p.id && !p.id.startsWith(`${w.id}_`)) {
        erros.push(`${f}: frase "${p.id}" deve começar por "${w.id}_"`)
      }
    }
  }
}

/* frases de sistema */
try {
  const ui = JSON.parse(readFileSync(join(RAIZ, 'data', 'ui-phrases.json'), 'utf8'))
  for (const [id, texto] of Object.entries(ui)) {
    if (typeof texto !== 'string' || texto.length === 0) {
      erros.push(`ui-phrases.json: "${id}" vazio ou não-string`)
    }
    if (!existsSync(join(RAIZ, 'public', 'audio', 'phrases', `${id}.mp3`))) {
      avisos.push(`mp3 em falta: public/audio/phrases/${id}.mp3 (usa fallback Web Speech)`)
    }
  }
} catch (e) {
  erros.push(`data/ui-phrases.json: ${e.message}`)
}

for (const a of avisos) console.log(`⚠ ${a}`)
for (const e of erros) console.error(`✗ ${e}`)
console.log(`\n${idsPacks.size} packs, ${idsPalavras.size} palavras — ${erros.length} erros, ${avisos.length} avisos`)
process.exit(erros.length ? 1 : 0)
