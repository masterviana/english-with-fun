<script setup lang="ts">
import { useSrsStore } from '../stores/srs'
import { words } from '../utils/packs'

const srs = useSrsStore()
const confirmar = ref(false)

function reset() {
  if (!confirmar.value) {
    confirmar.value = true
    return
  }
  srs.reset()
  confirmar.value = false
  navigateTo('/')
}
</script>

<template>
  <div class="ecra ecra-pais">
    <h2>Painel dos pais</h2>
    <p class="pais-info">
      Estrelas: <b>{{ srs.stars }}</b> &nbsp;·&nbsp; Palavras aprendidas:
      <b>{{ srs.palavrasVistas.length }}/{{ words.length }}</b> &nbsp;·&nbsp; Para rever hoje:
      <b>{{ srs.palavrasDue.length }}</b>
    </p>

    <div class="tema-escolha">
      Tema:
      <button class="btn-tema" @click="srs.setTheme('menina')">&#127856; Rosa</button>
      <button class="btn-tema" @click="srs.setTheme('menino')">&#128664; Azul</button>
    </div>

    <div class="tabela-wrap">
      <table>
        <tbody>
          <tr v-for="r in srs.resumo" :key="r.word.id" :class="{ 'nao-vista': !r.seen }">
            <td>
              {{ r.word.en }}<span class="pt">{{ r.word.pt }}</span>
            </td>
            <td class="niveis">
              <span v-for="n in 5" :key="n" class="nivel" :class="{ cheio: r.level >= n }" />
            </td>
            <td>
              <template v-if="!r.seen">nova</template>
              <span v-else-if="r.due" class="tag-due">rever hoje</span>
              <template v-else>&#10003;</template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="pais-nota">
      Sem os ficheiros de áudio, a app usa a voz do próprio tablet. Para vozes melhores, corre
      <code>python3 scripts/gerar_audio.py</code> (ver README).
    </p>

    <div class="botoes-fim">
      <button class="btn-pequeno" @click="navigateTo('/')">Fechar</button>
      <button class="btn-pequeno perigo" @click="reset">
        {{ confirmar ? 'Tens a certeza? Toca outra vez' : 'Recomeçar do zero' }}
      </button>
    </div>
  </div>
</template>
