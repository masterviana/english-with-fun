<script setup lang="ts">
import { artSvg } from '../utils/art.mjs'

const props = defineProps<{
  nome: 'kika' | 'lulu'
  grande?: boolean
  salta?: boolean
}>()

const svg = computed(() => artSvg(`mascote_${props.nome}`))
</script>

<template>
  <div class="mascote" :class="{ grande, salta }" v-html="svg" />
</template>
