<script setup lang="ts">
import { useSrsStore } from './stores/srs'

const srs = useSrsStore()
onMounted(() => srs.load())
useHead({ bodyAttrs: { 'data-theme': computed(() => srs.theme) } })
</script>

<template>
  <div>
    <!-- Filtro partilhado: dá o "tremido" de lápis de cera a todos os SVG -->
    <svg width="0" height="0" style="position: absolute" aria-hidden="true">
      <defs>
        <filter id="crayon" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="7" result="ruido" />
          <feDisplacementMap in="SourceGraphic" in2="ruido" scale="3.5" />
        </filter>
      </defs>
    </svg>
    <div id="app">
      <ClientOnly>
        <NuxtPage />
      </ClientOnly>
    </div>
  </div>
</template>
