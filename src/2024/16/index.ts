// https://adventofcode.com/2024/day/16

export const run1 = (input: string): number => {
  const { grid, startPos, direction } = generateGrid(input)
  const { minScore } = walkMaze2(grid, startPos, direction)
  return minScore
}

export const run2 = (input: string): number => {
  const { grid, startPos, direction } = generateGrid(input)
  const { minScorePaths } = walkMaze2(grid, startPos, direction)
  // console.log(minScorePaths)
  const minScorePoints = new Set(minScorePaths.flatMap((path) => [ ...path.moves.values() ]))

  let maxX = [ ...grid.entries() ].reduce((acc, [ currPos ]) => (JSON.parse(currPos) as Coords).x > acc ? (JSON.parse(currPos) as Coords).x : acc, 0)
  let maxY = [ ...grid.entries() ].reduce((acc, [ currPos ]) => (JSON.parse(currPos) as Coords).y > acc ? (JSON.parse(currPos) as Coords).y : acc, 0)
  for (let y = maxY; y >= 0; y--) {
    let line = ''
    for (let x = 0; x <= maxX; x++) {
      const s = JSON.stringify({ x, y })
      const ch = minScorePoints.has(s) ? 'O' : grid.get(s)
      line = line.concat(ch || '')
    }
    console.log(line)
  }

  return minScorePoints.size
}

const walkMaze2 = (grid: Map<SerializedCoords, string>, startPos: Coords, direction: Direction): { minScore: number, minScorePaths: readonly Path[] } => {
  const firstPath: Path = {
    lastDir: direction,
    moves: new Set<SerializedCoords>().add(JSON.stringify(startPos)),
    score: 0,
    status: 'in progress'
  }

  let minScore = Number.MAX_SAFE_INTEGER
  let minScorePaths: Path[] = []
  const paths: Path[] = [ firstPath ]

  let path: Path | undefined
  while (path = paths.shift()) {
    // process.stdout.write(`${paths.length} ${minScore}\n`)
    const sLastMove = [ ...path.moves ].toReversed()[0]
    const lastMove: Coords = JSON.parse(sLastMove)

    getNeighbors(lastMove)
      .filter((neighbor) => {
        const sNeighborPos = JSON.stringify(neighbor.pos)
        const ch = grid.get(sNeighborPos)
        return ch !== '#' && path && !path.moves.has(sNeighborPos)
      })
      .forEach((move) => {
        if (path) {
          const sMovePos = JSON.stringify(move.pos)
          const ch = grid.get(sMovePos)
  
          const reachedEnd = ch === 'E'
          const newScore = path.score + (JSON.stringify(move.dir) === JSON.stringify(path.lastDir) ? 1 : 1001)
          const moves = new Set(path.moves).add(JSON.stringify(move.pos))
  
          if (reachedEnd && (newScore < minScore)) {
            minScore = newScore
            minScorePaths = [{
              ...path,
              lastDir: move.dir,
              moves,
              score: newScore
            }]
          }

          if (reachedEnd && (newScore === minScore)) {
            minScorePaths.push({
              ...path,
              lastDir: move.dir,
              moves,
              score: newScore
            })
          }

          if (!reachedEnd) {
            const lowestScoreAtThisPoint = paths.reduce((acc, curr) => {
              return curr.moves.has(sMovePos) && curr.score < acc ? curr.score : acc
            }, Number.MAX_SAFE_INTEGER)

            if (newScore <= lowestScoreAtThisPoint) {
              paths.push({
                ...path,
                lastDir: move.dir,
                moves,
                score: newScore
              })
            }
          }
        }
      })
  }
  
  return { minScore, minScorePaths }
}

const getNeighbors = (pos: Coords): readonly Move[] =>
  directions.map((dir) => ({
    pos: { x: pos.x + dir.xOffset, y: pos.y + dir.yOffset },
    dir
  }))

const generateGrid = (input: string): { grid: Map<SerializedCoords, string>, startPos: Coords, direction: Direction } => {
  const grid = input.split('\n')
    .map((line) => line.split(''))

  const rowCount = grid.length
  const colCount = grid[0].length

  const ret = new Map<string, string>()
  let startPos: Coords = { x: -1, y: -1 }

  for (let x = 0; x < colCount; x++) {
    for (let y = 0; y < rowCount; y++) {
      const yPos = rowCount - 1 - y
      const char = grid[yPos][x]
      
      if (char === 'S') {
        startPos = { x, y }
      }

      ret.set(JSON.stringify({ x, y }), char)
    }
  }

  return { grid: ret, startPos, direction: { xOffset: 1, yOffset: 0 } as Direction }
}

const directions: readonly Direction[] = [
  { xOffset: 0, yOffset: 1 }, // N
  { xOffset: 1, yOffset: 0 }, // E
  { xOffset: 0, yOffset: -1 }, // S
  { xOffset: -1, yOffset: 0 }, // W
]

type Coords = { x: number, y: number }
type Direction = { xOffset: number, yOffset: number }
type Move = { pos: Coords, dir: Direction }

type SerializedCoords = string & {}
type SerializedMove = string & {}

type Path = {
  lastDir: Direction
  moves: Set<SerializedCoords>
  score: number
  status: 'in progress' | 'dead end' | 'reached end'
}