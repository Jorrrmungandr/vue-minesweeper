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
    setTimeout(() => {
      alert('BOOOOOM!')
    }, 500)
    return
  }
  expandZero(block) // 从当前块扩展所有空白块

  if (checkWin()) {
    setTimeout(() => {
      alert('You win!')
    }, 500)
  }
}

function onRightClick(block: BlockState) {
  if (block.opened) return
  block.flagged = !block.flagged
}

function getSiblings(block: BlockState) {
  return DIRECTIONS.map(([dx, dy]) => {
    const x2 = block.x + dx // 不能让x自增!
    const y2 = block.y + dy
    if (x2 < 0 || x2 >= WIDTH || y2 < 0 || y2 >= HEIGHT) {
      return undefined
    }

    return state[x2][y2]
  })
    .filter(Boolean) as BlockState[] // 将undefined过滤掉，只剩下有效数据
}

function expandZero(block: BlockState) {
  if (block.adjacentMines !== 0) return

  getSiblings(block).forEach((sibling) => {
    if (!sibling.opened) {
      sibling.opened = true
      expandZero(sibling)
    }
  })
}

function updateMineCounts() {
  state.forEach((row, x) => {
    row.forEach((item, y) => {
      if (item.isMine) {
        return
      }
      let count = 0

      getSiblings(item).forEach((sibling) => {
        if (sibling.isMine) count++
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
      block.isMine = Math.random() < 0.2
    }
  }
  updateMineCounts()
}

function checkWin() {
  return state.flat().every((block) => block.opened || block.isMine)
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
        @contextmenu.prevent="onRightClick(item)"
      >
        <template v-if="item.opened || DEV">
          <div v-if="item.isMine" i-mdi-mine />
          <div v-else>
            {{ item.adjacentMines }}
          </div>
        </template>
        <template v-else>
          <div v-if="item.flagged" i-mdi-flag text-red />
        </template>
      </button>
    </div>
  </div>

</template>
