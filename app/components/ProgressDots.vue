<script setup lang="ts">
defineProps<{ total: number; feitos: number }>()
</script>

<template>
  <div class="pontos">
    <span v-for="n in total" :key="n" class="ponto" :class="{ ativo: n <= feitos }" />
  </div>
</template>
