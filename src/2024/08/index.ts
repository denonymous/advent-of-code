// https://adventofcode.com/2024/day/8

const debug = false

export const run1 = (input: string): number => {
  const grid = generateGrid(input)
  const antennas = findAntennas(grid)
  
  const antinodes: Set<string> = new Set()
  ;[ ...antennas.entries() ]
    .forEach(([ frequency, antennas ]) => {
      const as = findAntinodes(grid, antennas)
      as.forEach((a) => antinodes.add(a))
    })
  
  debug && console.log(antinodes)
  return antinodes.size
}

export const run2 = (input: string): number => {
  const grid = generateGrid(input)
  const antennas = findAntennas(grid)
  
  const antinodes: Set<string> = new Set()
  ;[ ...antennas.entries() ]
    .forEach(([ frequency, antennas ]) => {
      const as = findHarmonicAntinodes(grid, antennas)
      debug && console.log('frequency', frequency)
      debug && console.log('antennas', antennas)
      debug && console.log('antinodes', as)
      debug && console.log()
      as.forEach((a) => antinodes.add(a))
    })
  
  debug && console.log(antinodes)
  return antinodes.size
}

const findHarmonicAntinodes = (grid: Map<string, string>, antennas: readonly Coords[]) => {
  const antinodes: Set<string> = new Set()
  antennas.forEach((first: Coords) => {
    antennas.forEach((second: Coords) => {
      if (first.x === second.x && first.y === second.y) {
        return
      }

      antinodes.add(JSON.stringify(first))
      antinodes.add(JSON.stringify(second))
      debug && console.log('first', first, ', second', second)
      
      const xOffset = first.x - second.x
      const yOffset = first.y - second.y

      let a1 = first
      let a2 = second
      
      while (grid.has(JSON.stringify(a1)) || grid.has(JSON.stringify(a2))) {
        a1 = { x: a1.x + xOffset, y: a1.y + yOffset }
        a2 = { x: a2.x + (xOffset * -1), y: a2.y + (yOffset * -1) }

        const a1S = JSON.stringify(a1)
        const a2S = JSON.stringify(a2)
  
        if (grid.has(a1S)) {
          debug && console.log('  ', a1)
          antinodes.add(a1S)
        } else {
          debug && console.log('  rejecting', a1)
        }
  
        if (grid.has(a2S)) {
          debug && console.log('  ', a2)
          antinodes.add(a2S)
        } else {
          debug && console.log('  rejecting', a2)
        }
      }
    })
  })

  return antinodes
}

const findAntinodes = (grid: Map<string, string>, antennas: readonly Coords[]) => {
  const antinodes: Set<string> = new Set()
  antennas.forEach((first: Coords) => {
    antennas.forEach((second: Coords) => {
      if (first.x === second.x && first.y === second.y) {
        return
      }

      const xOffset = first.x - second.x
      const yOffset = first.y - second.y

      const antinode1: Coords = { x: first.x + xOffset, y: first.y + yOffset }
      const antinode2: Coords = { x: second.x + (xOffset * -1), y: second.y + (yOffset * -1) }

      const a1S = JSON.stringify(antinode1)
      const a2S = JSON.stringify(antinode2)

      if (grid.has(a1S)) {
        antinodes.add(a1S)
      }

      if (grid.has(a2S)) {
        antinodes.add(a2S)
      }
    })
  })

  return antinodes
}

const findAntennas = (grid: Map<string, string>) =>
  [ ...grid.keys() ].reduce((acc, curr) => {
    const char = grid.get(curr)
    const coords: Coords = JSON.parse(curr)
    if (char && char !== '.') {
      const p = acc.get(char)
      const n = p ? [ ...p, coords ] : [ coords ]
      acc.set(char, n)
    }

    return acc
  }, new Map<string, readonly Coords[]>())

const generateGrid = (input: string) => {
  const grid = input.split('\n')
    .map((line) => line.split(''))

  const rowCount = grid.length
  const colCount = grid[0].length

  const ret = new Map<string, string>()

  for (let x = 0; x < colCount; x++) {
    for (let y = 0; y < rowCount; y++) {
      const yPos = rowCount - 1 - y
      const char = grid[yPos][x]
      ret.set(JSON.stringify({ x, y }), char)
    }
  }

  return ret
}

type Coords = { x: number, y: number }
