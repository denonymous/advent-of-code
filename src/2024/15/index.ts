// https://adventofcode.com/2024/day/15

export const run1 = (input: string): number => {
  let { grid, directions } = parseInput(input)

  const maxX = [ ...grid.keys() ].reduce((acc, curr) => {
    const pos: Position = JSON.parse(curr)
    return pos.x > acc ? pos.x : acc
  }, 0)

  const maxY = [ ...grid.keys() ].reduce((acc, curr) => {
    const pos: Position = JSON.parse(curr)
    return pos.x > acc ? pos.x : acc
  }, 0)

  const currentPosEntry = [ ...grid.entries() ].find(([ _pos, char ]) => char === '@')
  let currentPosition: Position = currentPosEntry ? JSON.parse(currentPosEntry[0]) : { x: 0, y: 0 }

  let results = { currentPosition, grid }
  directions.forEach((direction) => {
    // drawGrid(results.grid, maxX, maxY)
    results = move(results.grid, results.currentPosition, direction)
    // console.log(direction)
  })
  
  return calculateBoxScores(results.grid)
}

export const run2 = (input: string): void => {}

/*
########
#..O.O.#
##@.O..#
#...O..#
#.#.O..#
#...O..#
#......#
########

<^^>>>vv<v>>v<<
*/

const calculateBoxScores = (grid: Map<string, string>) =>
  [ ...grid.entries() ].reduce((acc, [ pos, char ]) => {
    if (char === 'O') {
      const position: Position = JSON.parse(pos)
      acc += (100 * position.y) + position.x
    }

    return acc
  }, 0)

const calculateBoxScore = (pos: Position) => (pos.y * 100) + pos.x

const drawGrid = (grid: Map<string, string>, maxX: number, maxY: number) => {
  for (let y = 0; y <= maxY; y++) {
    let row = ''
    for (let x = 0; x <= maxX; x++) {
      row = row.concat(grid.get(JSON.stringify({ x, y })) || '')
    }
    console.log(row)
  }
  console.log()
}

const move = (grid: Map<string, string>, currentPosition: Position, direction: string) => {
  const movingPositions = []
  
  if (direction === '>') {
    let n = currentPosition.x
    let ch = grid.get(JSON.stringify(currentPosition))
    while (ch === '@' || ch === 'O') {
      movingPositions.push({ x: n, y: currentPosition.y })
      ch = grid.get(JSON.stringify({ x: ++n, y: currentPosition.y })) || ''
    }

    const nextChar = ch

    if (nextChar === '.') {
      movingPositions.reverse().forEach((pos) => {
        const char = grid.get(JSON.stringify(pos))
        const next = { x: pos.x + 1, y: pos.y }
        grid.set(JSON.stringify(next), char || '')
      })
      
      grid.set(JSON.stringify(currentPosition), '.')

      return {
        currentPosition: { x: currentPosition.x + 1, y: currentPosition.y },
        grid
      }
    }
  }

  if (direction === 'v') {
    let n = currentPosition.y
    let ch = grid.get(JSON.stringify(currentPosition))
    while (ch === '@' || ch === 'O') {
      movingPositions.push({ x: currentPosition.x, y: n })
      ch = grid.get(JSON.stringify({ x: currentPosition.x, y: ++n })) || ''
    }

    const nextChar = ch

    if (nextChar === '.') {
      movingPositions.reverse().forEach((pos) => {
        const char = grid.get(JSON.stringify(pos))
        const next = { x: pos.x, y: pos.y + 1 }
        grid.set(JSON.stringify(next), char || '')
      })
      
      grid.set(JSON.stringify(currentPosition), '.')

      return {
        currentPosition: { x: currentPosition.x, y: currentPosition.y + 1 },
        grid
      }
    }
  }

  if (direction === '<') {
    let n = currentPosition.x
    let ch = grid.get(JSON.stringify(currentPosition))
    while (ch === '@' || ch === 'O') {
      movingPositions.push({ x: n, y: currentPosition.y })
      ch = grid.get(JSON.stringify({ x: --n, y: currentPosition.y })) || ''
    }

    const nextChar = ch

    if (nextChar === '.') {
      movingPositions.reverse().forEach((pos) => {
        const char = grid.get(JSON.stringify(pos))
        const next = { x: pos.x - 1, y: pos.y }
        grid.set(JSON.stringify(next), char || '')
      })
      
      grid.set(JSON.stringify(currentPosition), '.')

      return {
        currentPosition: { x: currentPosition.x - 1, y: currentPosition.y },
        grid
      }
    }
  }

  if (direction === '^') {
    let n = currentPosition.y
    let ch = grid.get(JSON.stringify(currentPosition))
    while (ch === '@' || ch === 'O') {
      movingPositions.push({ x: currentPosition.x, y: n })
      ch = grid.get(JSON.stringify({ x: currentPosition.x, y: --n })) || ''
    }

    const nextChar = ch

    if (nextChar === '.') {
      movingPositions.reverse().forEach((pos) => {
        const char = grid.get(JSON.stringify(pos))
        const next = { x: pos.x, y: pos.y - 1 }
        grid.set(JSON.stringify(next), char || '')
      })
      
      grid.set(JSON.stringify(currentPosition), '.')

      return {
        currentPosition: { x: currentPosition.x, y: currentPosition.y - 1 },
        grid
      }
    }
  }

  return { currentPosition, grid }
}

const parseInput = (input: string) => {
  let inGrid = true
  let yIdx = 0
  let grid = new Map<string, string>()
  let directions: string[] = []

  input.split('\n').forEach((line) => {
    if (line.indexOf('#') === 0) {
      inGrid = true
    } else {
      inGrid = false
    }

    if (inGrid) {
      let xIdx = 0
      line.split('').forEach((ch) => {
        grid.set(JSON.stringify({ x: xIdx++, y: yIdx }), ch)
      })
      yIdx++
    } else {
      directions.push(...line.split(''))
    }
  })

  return { grid, directions }
}

type Position = {
  x: number,
  y: number
}