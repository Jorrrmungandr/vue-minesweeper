<script setup lang="ts" generic="T extends any, O extends any">
defineOptions({
  name: 'IndexPage',
})

function onClick(x: number, y: number) {
  // console.log(`clicked at (${x}, ${y})`)
}

const WIDTH = 10
const HEIGHT = 10

const state = reactive(Array.from(
  Array.from({ length: HEIGHT }),
  (_, row) =>
    Array.from(Array.from({ length: WIDTH }), (_, col) => row * 10 + col + 1),
),
)
</script>

<template>
  <div>
    Minesweeper

    <div
      v-for="row in HEIGHT"
      :key="row"
    >
      <button
        v-for="col in WIDTH"
        :key="col"
        h-10 w-10 border hover:bg-gray
        @click="onClick(row, col)"
      >
        {{ state[row][col] }}
      </button>
    </div>
  </div>
</template>
