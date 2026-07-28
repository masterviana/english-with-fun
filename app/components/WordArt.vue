<script setup lang="ts">
import { artSvg } from '../utils/art.mjs'
import { wordsById } from '../utils/packs'

const props = defineProps<{ id: string }>()
const svg = computed(() => artSvg(props.id, wordsById[props.id]))
</script>

<template>
  <span class="word-art" v-html="svg" />
</template>
