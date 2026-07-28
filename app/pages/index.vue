<script setup lang="ts">
import { useSrsStore } from '../stores/srs'
import { useAudio } from '../composables/useAudio'

const srs = useSrsStore()
const audio = useAudio()

/* novas disponíveis = mínimo entre palavras por conhecer e portão de progresso */
const novas = computed(() =>
  Math.min(srs.palavrasNovas.length, srs.novasDisponiveis()),
)
const due = computed(() => srs.palavrasDue.length)
const vistas = computed(() => srs.palavrasVistas.length)

/* premir e segurar ~1s para abrir os pais (para a criança não abrir sem querer) */
let gearTimer: ReturnType<typeof setTimeout> | undefined
function gearDown() {
  gearTimer = setTimeout(() => navigateTo('/pais'), 900)
}
function gearUp() {
  clearTimeout(gearTimer)
}

function ir(rota: string) {
  audio.somToque()
  navigateTo(rota)
}
</script>

<template>
  <div class="ecra ecra-inicio">
    <div class="topo">
      <StarsBadge />
      <button
        class="btn-gear"
        title="Pais"
        @pointerdown="gearDown"
        @pointerup="gearUp"
        @pointerleave="gearUp"
        @pointercancel="gearUp"
        @dblclick="navigateTo('/pais')"
      >
        &#9881;
      </button>
    </div>

    <h1 class="titulo">English Fun!</h1>

    <div class="mascotes">
      <TheMascot nome="kika" />
      <TheMascot nome="lulu" />
    </div>

    <div class="botoes-principais">
      <button class="btn-grande btn-aprender" @click="ir('/learn')">
        <span class="btn-icone"><WordArt id="book" /></span>
        <span>Learn</span>
        <span v-if="novas > 0" class="badge">{{ novas }}</span>
      </button>
      <!-- nunca disabled: sem palavras vistas, /play encaminha para o Learn -->
      <button class="btn-grande btn-jogar" :class="{ apagado: vistas === 0 }" @click="ir('/play')">
        <span class="btn-icone"><WordArt id="ball" /></span>
        <span>Play</span>
        <span v-if="due > 0" class="badge badge-due">{{ due }}</span>
      </button>
    </div>

    <p v-if="vistas === 0" class="dica">Começa por “Learn” para conhecer as primeiras palavras 💛</p>
  </div>
</template>
