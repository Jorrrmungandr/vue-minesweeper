import {BlockState} from "~/types";

const DIRECTIONS = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1], [0, 1],
    [1, -1], [1, 0], [1, 1],
]

export class GamePlay {
    firstClick = true
    state = ref<BlockState[][]>()

    constructor(public width: number, public height: number) {
        this.width = width
        this.height = height
        this.reset()
    }


    onClick(block: BlockState) {
        if (this.firstClick) {
            this.generateMines(block)
            this.firstClick = false
        }


        block.opened = true
        if (block.isMine) {
            setTimeout(() => {
                alert('BOOOOOM!')
            }, 500)
            return
        }
        this.expandZero(block) // 从当前块扩展所有空白块

        if (this.checkWin()) {
            setTimeout(() => {
                alert('You win!')
            }, 500)
        }
    }

    onRightClick(block: BlockState) {
        if (block.opened) return
        block.flagged = !block.flagged
    }

    getSiblings(block: BlockState) {
        return DIRECTIONS.map(([dx, dy]) => {
            const x2 = block.x + dx // 不能让x自增!
            const y2 = block.y + dy
            if (x2 < 0 || x2 >= this.width || y2 < 0 || y2 >= this.height) {
                return undefined
            }

            return this.state.value[x2][y2]
        })
            .filter(Boolean) as BlockState[] // 将undefined过滤掉，只剩下有效数据
    }

    expandZero(block: BlockState) {
        if (block.adjacentMines !== 0) return

        this.getSiblings(block).forEach((sibling) => {
            if (!sibling.opened) {
                sibling.opened = true
                this.expandZero(sibling)
            }
        })
    }

    updateMineCounts() {
        this.state.value.forEach((row) => {
            row.forEach((item) => {
                if (item.isMine) {
                    return
                }
                let count = 0

                this.getSiblings(item).forEach((sibling) => {
                    if (sibling.isMine) count++
                })
                item.adjacentMines = count
            })
        })
    }

    generateMines(firstBlock: BlockState) {
        for (const row of this.state.value) {
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
        this.updateMineCounts()
    }
    checkWin() {
        return this.state.value.flat().every((block) => block.opened || block.isMine)
    }

    reset() {
        this.firstClick = true
        this.state.value = Array.from(
            new Array(this.height), (_, x) =>
                Array.from(new Array(this.width), (_, y) => <BlockState> { // 这里是ts的尖括号assertion
                        x, y,
                        opened: false,
                        flagged: false,
                        isMine: false,
                        adjacentMines: 0,
                    }
                ),
        )
    }
}
