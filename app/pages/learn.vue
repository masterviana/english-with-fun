<script setup lang="ts">
import { useSrsStore } from '../stores/srs'
import { useAudio } from '../composables/useAudio'
import { grupos, packsDoGrupo, packsSemGrupo } from '../utils/packs'
import { corDominante } from '../utils/art.mjs'
import type { Word, Pack, Grupo } from '../types/content'

const srs = useSrsStore()
const audio = useAudio()

const lista = ref<Word[]>([])
const i = ref(0)
const fase = ref<'mundos' | 'temas' | 'cartoes' | 'fim' | 'sem-novas'>('mundos')
const grupoAtivo = ref<Grupo | null>(null)
const atual = computed(() => lista.value[i.value])

function bordaDe(w: { id: string; cor?: string }) {
  const c = corDominante(w.id, w)
  return c ? { borderColor: c } : undefined
}

function novasDoPack(packId: string): number {
  return srs.palavrasNovas.filter((w) => w.pack === packId).length
}

function novasDoGrupo(grupoId: string): number {
  return packsDoGrupo(grupoId).reduce((s, p) => s + novasDoPack(p.id), 0)
}

/* nível 1 do mapa: packs sem grupo (ex.: cores) + mundos */
const mundos = computed(() => [
  ...packsSemGrupo().map((p) => ({ tipo: 'pack' as const, pack: p })),
  ...grupos.map((g) => ({ tipo: 'grupo' as const, grupo: g })),
])

const temas = computed(() =>
  grupoAtivo.value ? packsDoGrupo(grupoAtivo.value.id) : [],
)

onMounted(() => {
  if (srs.novasDisponiveis() === 0 || srs.palavrasNovas.length === 0) {
    fase.value = 'sem-novas'
    audio.frase('no_new')
  }
})

function abrirGrupo(g: Grupo) {
  audio.somToque()
  grupoAtivo.value = g
  fase.value = 'temas'
}

function escolherTema(packId: string) {
  audio.somToque()
  lista.value = srs.escolherNovas(undefined, packId)
  if (lista.value.length === 0) return
  fase.value = 'cartoes'
  mostrar(0)
}

function voltarMapa() {
  audio.somToque()
  if (fase.value === 'temas') {
    fase.value = 'mundos'
    grupoAtivo.value = null
  } else {
    navigateTo('/')
  }
}

function mostrar(n: number) {
  i.value = n
  const w = lista.value[n]!
  srs.marcarVista(w.id)
  audio.palavra(w.id)
}

function repetir() {
  if (atual.value) audio.palavra(atual.value.id)
}

function seguinte() {
  audio.somToque()
  if (i.value + 1 < lista.value.length) {
    mostrar(i.value + 1)
  } else {
    fase.value = 'fim'
    audio.frase('well_done')
  }
}

onUnmounted(() => audio.parar())
</script>

<template>
  <div v-if="fase === 'sem-novas'" class="ecra ecra-msg">
    <TheMascot nome="kika" grande />
    <p class="balao">No new words now.<br />Play to unlock more!</p>
    <button class="btn-grande btn-jogar" @click="navigateTo('/play')">
      <span class="btn-icone"><WordArt id="ball" /></span><span>Play</span>
    </button>
    <button class="btn-voltar" @click="navigateTo('/')">&#8962;</button>
  </div>

  <div v-else-if="fase === 'mundos'" class="ecra ecra-aprender">
    <div class="topo">
      <button class="btn-voltar" @click="navigateTo('/')">&#8962;</button>
    </div>

    <p class="balao">What do you want to learn?</p>
    <div class="temas">
      <template v-for="m in mundos" :key="m.tipo === 'pack' ? m.pack.id : m.grupo.id">
        <button
          v-if="m.tipo === 'pack'"
          class="tema"
          :style="bordaDe({ id: m.pack.icone })"
          :disabled="novasDoPack(m.pack.id) === 0"
          @click="escolherTema(m.pack.id)"
        >
          <span class="tema-icone"><WordArt :id="m.pack.icone" /></span>
          <span class="tema-nome">{{ m.pack.en }}</span>
          <span v-if="novasDoPack(m.pack.id) > 0" class="badge">{{ novasDoPack(m.pack.id) }}</span>
          <span v-else class="tema-feito">&#10003;</span>
        </button>
        <button
          v-else
          class="tema"
          :style="bordaDe({ id: m.grupo.icone })"
          :disabled="novasDoGrupo(m.grupo.id) === 0"
          @click="abrirGrupo(m.grupo)"
        >
          <span class="tema-icone"><WordArt :id="m.grupo.icone" /></span>
          <span class="tema-nome">{{ m.grupo.en }}</span>
          <span v-if="novasDoGrupo(m.grupo.id) > 0" class="badge">{{ novasDoGrupo(m.grupo.id) }}</span>
          <span v-else class="tema-feito">&#10003;</span>
        </button>
      </template>
    </div>
  </div>

  <div v-else-if="fase === 'temas' && grupoAtivo" class="ecra ecra-aprender">
    <div class="topo">
      <button class="btn-voltar" @click="voltarMapa">&#8617;</button>
    </div>

    <p class="balao">{{ grupoAtivo.en }}</p>
    <div class="temas">
      <button
        v-for="p in temas"
        :key="p.id"
        class="tema"
        :style="bordaDe({ id: p.icone })"
        :disabled="novasDoPack(p.id) === 0"
        @click="escolherTema(p.id)"
      >
        <span class="tema-icone"><WordArt :id="p.icone" /></span>
        <span class="tema-nome">{{ p.en }}</span>
        <span v-if="novasDoPack(p.id) > 0" class="badge">{{ novasDoPack(p.id) }}</span>
        <span v-else class="tema-feito">&#10003;</span>
      </button>
    </div>
  </div>

  <div v-else-if="fase === 'fim'" class="ecra ecra-msg">
    <ConfettiBurst />
    <TheMascot nome="lulu" grande salta />
    <p class="balao">Well done!<br />Now let's play!</p>
    <button class="btn-grande btn-jogar" @click="navigateTo('/play')">
      <span class="btn-icone"><WordArt id="ball" /></span><span>Play</span>
    </button>
    <button class="btn-voltar" @click="navigateTo('/')">&#8962;</button>
  </div>

  <div v-else-if="atual" class="ecra ecra-aprender">
    <div class="topo">
      <button class="btn-voltar" @click="navigateTo('/')">&#8962;</button>
      <ProgressDots :total="lista.length" :feitos="i + 1" />
    </div>

    <div
      :key="atual.id"
      class="cartao"
      :style="bordaDe(atual)"
      @click="repetir"
    >
      <div class="cartao-arte"><WordArt :id="atual.id" /></div>
      <div class="cartao-palavra">{{ atual.en }}</div>
      <div class="cartao-traducao">{{ atual.pt }}</div>
      <button class="btn-som" @click.stop="repetir">&#128266;</button>
    </div>

    <button class="btn-seguinte" @click="seguinte">
      {{ i + 1 < lista.length ? '➞' : '⭐' }}
    </button>
  </div>
</template>
