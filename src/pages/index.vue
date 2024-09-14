<script setup lang="ts" generic="T extends any, O extends any">
defineOptions({
  name: 'IndexPage',
})

interface BlockState {
  x: number,
  y: number
  opened: boolean
  flagged: boolean
  isMine: boolean
  adjacentMines: number
}

const WIDTH = 10
const HEIGHT = 10
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1], [0, 1],
  [1, -1], [1, 0], [1, 1],
]
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
const DEV = false
let firstClick = true

const state = reactive(Array.from(
  new Array(HEIGHT), (_, x) =>
    Array.from(new Array(WIDTH), (_, y) => <BlockState> { // 这里是ts的尖括号assertion
      x, y,
      opened: false,
      flagged: false,
      isMine: false,
      adjacentMines: 0,
      }
    ),
  ),
)

function getBlockClass(block: BlockState) {
  if (!block.opened) {
    return 'bg-gray-600/10'
  }
  return block.isMine
    ? 'bg-red/50'
    : COLORS[block.adjacentMines]
}

function onClick(block: BlockState) {
  if (firstClick) {
    generateMines(block)
    firstClick = false
  }
  block.opened = true
  if (block.isMine) {
    // alert('BOOOOOM!')
  }
}

function updateMineCounts() {
  state.forEach((row, x) => {
    row.forEach((item, y) => {
      if (item.isMine) {
        return
      }
      let count = 0
      DIRECTIONS.forEach(([dx, dy]) => {
        const x2 = x + dx // 不能让x自增，因为x，y后续还要使用
        const y2 = y + dy
        if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT) {
          return
        }
        if (state[x2][y2].isMine) {
          count++
        }
      })
      item.adjacentMines = count
    })
  })
}

function generateMines(firstBlock: BlockState) {
  for (const row of state) {
    for (const block of row) {
      // 以30%的概率生成地雷
      if (Math.abs(firstBlock.x - block.x) <= 1) {
        if (Math.abs(firstBlock.y - block.y) <= 1) {
          continue
        }
      }
      block.isMine = Math.random() < 0.3
    }
  }
  updateMineCounts()
}


</script>

<template>
  <div>
    <div mb-5>
    Minesweeper
    </div>

    <div
      v-for="(row, x) in state"
      :key="x"
      flex="~"
      items-start justify-center
    >
      <button
        v-for="(item, y) in row"
        :key="y"
        h-10 w-10 m-0.5 hover="bg-gray/60"
        border="~ white/10"
        flex
        items-center justify-center
        :class="getBlockClass(item)"
        @click="onClick(item)"
      >
        <template v-if="item.opened || DEV">
          <div v-if="item.isMine" i-mdi-mine />
          <div v-else>
            {{ item.adjacentMines }}
          </div>
        </template>
        <template v-else>

        </template>
      </button>
    </div>
  </div>

</template>
