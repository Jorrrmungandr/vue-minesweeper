<script setup lang="ts">
import {isDev} from "~/composables/storage";
import {BlockState} from "~/types";

defineProps<{block: BlockState}>()

const COLORS = [
  'text-transparent',
  'text-blue-500',
  'text-green-500',
  'text-red-500',
  'text-purple-500',
  'text-yellow-500',
  'text-pink-500',
  'text-indigo-500',
  'text-cyan-500',
]

function getBlockClass(block: BlockState) {
  if (!block.opened) {
    return 'bg-gray-400/25'
  }
  return block.isMine
    ? 'bg-red/50'
    : COLORS[block.adjacentMines]
}


</script>

<template>
  <button
    h-10 w-10 m-0.5 hover="bg-gray/40"
    border="~ white/10"
    flex
    items-center justify-center
    :class="getBlockClass(block)"
  >
    <template v-if="block.opened || isDev">
      <div v-if="block.isMine" i-mdi-mine />
      <div v-else>
        {{ block.adjacentMines }}
      </div>
    </template>
    <template v-else>
      <div v-if="block.flagged" i-mdi-flag text-red />
    </template>
  </button>
</template>

<style scoped>

</style>
