<script setup lang="ts">
const cores = ['#f27fb2', '#9b6dd6', '#4f7fe9', '#f2c94c', '#5fbb63']
const pecas = Array.from({ length: 18 }, () => ({
  left: 5 + Math.random() * 90,
  cor: cores[Math.floor(Math.random() * cores.length)],
  delay: Math.random() * 0.5,
  dur: 1.6 + Math.random(),
}))
</script>

<template>
  <div class="confetti">
    <span
      v-for="(p, i) in pecas"
      :key="i"
      class="confete"
      :style="{
        left: p.left + '%',
        background: p.cor,
        animationDelay: p.delay + 's',
        animationDuration: p.dur + 's',
      }"
    />
  </div>
</template>
