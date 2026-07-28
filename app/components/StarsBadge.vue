<script setup lang="ts">
import { artSvg } from '../utils/art.mjs'
import { useSrsStore } from '../stores/srs'

const srs = useSrsStore()
const estrela = artSvg('estrela')
</script>

<template>
  <div class="stars-badge">
    <span class="word-art" v-html="estrela" />
    <span>{{ srs.stars }}</span>
  </div>
</template>
