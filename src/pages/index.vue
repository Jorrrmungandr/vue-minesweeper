<script setup lang="ts" generic="T extends any, O extends any">
import {isDev, toggleDev} from "~/composables/storage";
import {GamePlay} from "~/composables/logic"
import {BlockState} from "~/types";
import {Ref} from "vue";

const game = new GamePlay(10, 10)
const state = game.state as Ref<BlockState[][]>

</script>

<template>
  <div>
    <div mb-5>
    Minesweeper
    </div>
      <button mb-5 bg="gray-400/20" @click="toggleDev()">
        Dev: {{ isDev }}
      </button>
    <div
      v-for="(row, x) in state"
      :key="x"
      flex="~"
      items-start justify-center
    >
      <div
        v-for="(item, y) in row"
        :key="y"
        @click="game.onClick(item)"
        @contextmenu.prevent="game.onRightClick(item)"
      >
        <Block :block="item" />
      </div>
    </div>
  </div>

  <button @click="game.reset" block m-auto>
    reset
  </button>
</template>
