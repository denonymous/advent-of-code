// https://adventofcode.com/2024/day/6

const debug = false

export const run1 = (input: string): number => {
  const { grid, guardPos: guardStartPos, guardDir: guardStartDir } = generateGrid(input)
  
  const { positionsCovered } = runGrid(10000, grid, guardStartPos, guardStartDir)

  return positionsCovered.size
}

export const run2 = (input: string): number => {
  const { grid, guardPos: guardStartPos, guardDir: guardStartDir } = generateGrid(input)

  const maxEvals = 10000

  const { positionsCovered } = runGrid(maxEvals, grid, guardStartPos, guardStartDir)

  let loopGrids = 0

  ;[ ...grid.keys() ]
    .filter((posStr) => {
      const pos: Coords = JSON.parse(posStr)
      return grid.get(posStr) === '.' && !(pos.x === guardStartPos.x && pos.y === guardStartPos.y)
    })
    .filter((posStr) => positionsCovered.has(posStr))
    .forEach((posStr) => {
      const updatedGrid = new Map<string, string>(grid).set(posStr, '#')

      const { positionsCovered, evals } = runGrid(maxEvals, updatedGrid, guardStartPos, guardStartDir)
      
      debug && console.log('positions covered', positionsCovered.size, 'evals', evals)
      
      if (evals >= maxEvals) {
        loopGrids++
        debug && console.log(posStr)
      }
    })

  return loopGrids
}

const runGrid = (maxEvals: number, grid: Map<string, string>, guardStartPos: Coords, guardStartDir: Direction) => {
  let positionsCovered = new Set<string>()
  let guardPos = guardStartPos
  let guardDir = guardStartDir

  let evals = 0

  do {
    evals++
    positionsCovered.add(JSON.stringify(guardPos))

    const nextPos = { x: guardPos.x + guardDir.xOffset, y: guardPos.y + guardDir.yOffset }
    const nextPosChar = grid.get(JSON.stringify(nextPos))
    
    // debug && console.log('pos', guardPos, 'dir', guardDir, `(${positionsCovered.size})`)
    // debug && console.log('next', nextPos, nextPosChar)

    if (!nextPosChar) {
      break
    }

    if (nextPosChar === '.') {
      guardPos = nextPos
      continue
    }

    if (nextPosChar === '#') {
      guardDir = turnRight(guardDir)
    }
  } while (grid.has(JSON.stringify(guardPos)) && evals <= maxEvals)

  return { positionsCovered, evals }
}

const turnRight = (dir: Direction): Direction => {
  if (dir.xOffset === 0 && dir.yOffset === 1) {
    return { xOffset: 1, yOffset: 0 }
  }
  else if (dir.xOffset === 1 && dir.yOffset === 0) {
    return { xOffset: 0, yOffset: -1 }
  }
  else if (dir.xOffset === 0 && dir.yOffset === -1) {
    return { xOffset: -1, yOffset: 0 }
  }
  else {
    return { xOffset: 0, yOffset: 1 }
  }
}

const generateGrid = (input: string) => {
  const grid = input.split('\n')
    .map((line) => line.split(''))

  const rowCount = grid.length
  const colCount = grid[0].length

  const ret = new Map<string, string>()
  let guardPos: Coords = { x: -1, y: -1 }
  let guardDir: Direction = { xOffset: 0, yOffset: 1 }

  for (let x = 0; x < colCount; x++) {
    for (let y = 0; y < rowCount; y++) {
      const yPos = rowCount - 1 - y
      const char = grid[yPos][x]
      
      if (char === '^') {
        guardPos = { x, y }
        guardDir = { xOffset: 0, yOffset: 1 }
        ret.set(JSON.stringify({ x, y }), '.')
      }
      else if (char === '>') {
        guardPos = { x, y }
        guardDir = { xOffset: 1, yOffset: 0 }
        ret.set(JSON.stringify({ x, y }), '.')
      }
      else if (char === 'v') {
        guardPos = { x, y }
        guardDir = { xOffset: 0, yOffset: -1 }
        ret.set(JSON.stringify({ x, y }), '.')
      }
      else if (char === '<') {
        guardPos = { x, y }
        guardDir = { xOffset: -1, yOffset: 0 }
        ret.set(JSON.stringify({ x, y }), '.')
      }
      else {
        ret.set(JSON.stringify({ x, y }), char)
      }
    }
  }

  return { grid: ret, guardPos, guardDir }
}

const directions: readonly Direction[] = [
  { xOffset: 0, yOffset: 1 }, // N
  { xOffset: 1, yOffset: 0 }, // E
  { xOffset: 0, yOffset: -1 }, // S
  { xOffset: -1, yOffset: 0 }, // W
]

type Coords = { x: number, y: number }
type Direction = { xOffset: number, yOffset: number }
