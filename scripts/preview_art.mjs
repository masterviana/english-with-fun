#!/usr/bin/env node
/* Pré-visualiza desenhos: node scripts/preview_art.mjs cup dog tree
   Escreve .previews/<id>.png (via qlmanage, macOS). Sem qlmanage,
   deixa o .svg para abrir no browser. */
import { writeFileSync, mkdirSync, readFileSync, readdirSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { artSvg } from '../app/utils/art.mjs'

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(RAIZ, '.previews')
mkdirSync(OUT, { recursive: true })

/* wordsById construído a partir dos JSONs dos packs (sem importar .ts,
   que o node puro não sabe carregar) — permite artSvg(id, word) resolver
   as cores do pack "cores" (word.cor) */
const PACKS_DIR = join(RAIZ, 'data', 'packs')
const wordsById = {}
for (const f of readdirSync(PACKS_DIR).filter((f) => f.endsWith('.json'))) {
  const pack = JSON.parse(readFileSync(join(PACKS_DIR, f), 'utf8'))
  for (const w of pack.words || []) wordsById[w.id] = w
}

const ids = process.argv.slice(2)
if (!ids.length) {
  console.error('uso: node scripts/preview_art.mjs <id> [id...]')
  process.exit(1)
}

for (const id of ids) {
  let svg = artSvg(id, wordsById[id])
    .replace('<svg class="art"', '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"')
    .replace('filter="url(#crayon)"', '')
  /* parsers estritos rejeitam atributos duplicados; browser usa o primeiro */
  svg = svg.replace(/<[^>]+>/g, (tag) => {
    const vistos = new Set()
    return tag.replace(/([a-z-]+)="[^"]*"/g, (attr, nome) => {
      if (vistos.has(nome)) return ''
      vistos.add(nome)
      return attr
    })
  })
  const svgPath = join(OUT, `${id}.svg`)
  writeFileSync(svgPath, svg)
  try {
    execSync(`qlmanage -t -s 400 -o "${OUT}" "${svgPath}"`, { stdio: 'ignore' })
    console.log(`✓ .previews/${id}.svg.png`)
  } catch {
    console.log(`✓ .previews/${id}.svg (sem qlmanage — abre no browser)`)
  }
}
