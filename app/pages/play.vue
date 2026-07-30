<script setup lang="ts">
import { useSrsStore } from '../stores/srs'
import type { CartaoJogo } from '../stores/srs'
import { useAudio } from '../composables/useAudio'
import { corDominante } from '../utils/art.mjs'
import type { Word } from '../types/content'

function bordaDe(w: Word) {
  const c = corDominante(w.id, w)
  return c ? { borderColor: c } : undefined
}

const srs = useSrsStore()
const audio = useAudio()

const FELIZES: Record<string, string> = {
  great: 'Great job!',
  well_done: 'Well done!',
  fantastic: 'Fantastic!',
}

const fila = ref<CartaoJogo[]>([])
const i = ref(0)
const fase = ref<'intro' | 'pergunta' | 'acertou' | 'fim'>('intro')
const opcoes = ref<Word[]>([])
const primeira = ref(true)
const erradas = ref<string[]>([])
const perfeita = ref(true)
const ganhas = ref(1)
const mascoteFeliz = ref<'kika' | 'lulu'>('kika')
const desbloqueou = ref(false)
const fraseFelizId = ref('great')

const atual = computed(() => fila.value[i.value])

let timers: number[] = []
function depois(ms: number, fn: () => void) {
  timers.push(window.setTimeout(fn, ms))
}

onMounted(comecar)

let bloqueadoAoInicio = false

function comecar() {
  fila.value = srs.filaDeJogo(8)
  if (fila.value.length === 0) {
    navigateTo('/learn')
    return
  }
  bloqueadoAoInicio = srs.novasDisponiveis() === 0
  i.value = 0
  perfeita.value = true
  fase.value = 'intro'
  audio.frase('play')
  depois(1600, pergunta)
}

function pergunta() {
  const w = fila.value[i.value]!.word
  fase.value = 'pergunta'
  primeira.value = true
  erradas.value = []
  opcoes.value = srs.baralhar([w, ...srs.distratores(w.id, 2)])
  depois(350, () => audio.palavra(w.id))
}

function escolher(o: Word) {
  const c = atual.value
  if (!c || fase.value !== 'pergunta' || erradas.value.includes(o.id)) return
  if (o.id === c.word.id) {
    if (primeira.value) {
      srs.avaliar(c.id, true)
    } else {
      perfeita.value = false
    }
    acertou()
  } else {
    if (primeira.value) {
      srs.avaliar(c.id, false)
      perfeita.value = false
    }
    primeira.value = false
    erradas.value = [...erradas.value, o.id]
    audio.frase('almost')
    depois(1500, () => audio.palavra(c.word.id))
  }
}

function acertou() {
  audio.somAcerto()
  mascoteFeliz.value = Math.random() < 0.5 ? 'kika' : 'lulu'
  fraseFelizId.value = srs.baralhar(Object.keys(FELIZES))[0]!
  fase.value = 'acertou'
  depois(300, () => audio.frase(fraseFelizId.value))
  depois(2100, () => {
    if (i.value + 1 < fila.value.length) {
      i.value++
      pergunta()
    } else {
      fim()
    }
  })
}

function fim() {
  ganhas.value = perfeita.value ? 2 : 1
  srs.darEstrela(ganhas.value)
  srs.registarJogo() // conta para a garantia de desbloqueio (4 jogos)
  // o progresso desta sessão abriu o portão das novas? → festejar
  desbloqueou.value =
    bloqueadoAoInicio &&
    srs.novasDisponiveis() > 0 &&
    srs.palavrasNovas.length > 0
  fase.value = 'fim'
  audio.somEstrela()
  depois(400, () => audio.frase('star'))
  if (desbloqueou.value) depois(2200, () => audio.frase('fantastic'))
}

onUnmounted(() => {
  timers.forEach(clearTimeout)
  audio.parar()
})
</script>

<template>
  <div v-if="fase === 'intro'" class="ecra ecra-msg">
    <TheMascot nome="kika" grande />
    <p class="balao">Listen carefully<br />and tap the right picture!</p>
  </div>

  <div v-else-if="fase === 'pergunta' && atual" class="ecra ecra-jogo">
    <div class="topo">
      <button class="btn-voltar" @click="navigateTo('/')">&#8962;</button>
      <ProgressDots :total="fila.length" :feitos="i" />
    </div>

    <button class="btn-som btn-som-jogo" @click="audio.palavra(atual.word.id)">&#128266;</button>

    <div class="opcoes" :key="atual.word.id">
      <button
        v-for="o in opcoes"
        :key="o.id"
        class="opcao"
        :class="{ errada: erradas.includes(o.id) }"
        :style="bordaDe(o)"
        :disabled="erradas.includes(o.id)"
        @click="escolher(o)"
      >
        <WordArt :id="o.id" />
      </button>
    </div>
  </div>

  <div v-else-if="fase === 'acertou' && atual" class="ecra ecra-msg">
    <ConfettiBurst />
    <TheMascot :nome="mascoteFeliz" grande salta />
    <div class="cartao-arte media"><WordArt :id="atual.word.id" /></div>
    <p class="balao">{{ atual.word.en }}! {{ FELIZES[fraseFelizId] }}</p>
  </div>

  <div v-else-if="fase === 'fim'" class="ecra ecra-msg">
    <ConfettiBurst />
    <div class="estrela-premio"><WordArt id="estrela" /></div>
    <p class="balao">You got {{ ganhas === 2 ? 'two stars' : 'a star' }}! &#11088;</p>
    <p v-if="desbloqueou" class="balao balao-bonus">New words unlocked! &#128275;</p>
    <div class="mascotes">
      <TheMascot nome="kika" salta />
      <TheMascot nome="lulu" salta />
    </div>
    <div class="botoes-fim">
      <button class="btn-grande btn-jogar" @click="comecar"><span>Play again</span></button>
      <button class="btn-grande btn-aprender" @click="navigateTo('/')"><span>&#8962;</span></button>
    </div>
  </div>
</template>
