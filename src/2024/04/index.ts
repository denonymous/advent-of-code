// https://adventofcode.com/2024/day/4

const debug = false

export const run1 = (input: string): number => {
  const grid = generateGrid(input)
  return [ ...grid.keys() ]
    .reduce((acc, curr) => acc += findWord(grid, JSON.parse(curr), 'XMAS'), 0) 
}

export const run2 = (input: string): number => {
  const grid = generateGrid(input)
  return [ ...grid.keys() ]
    .reduce((acc, curr) => isValidCross(grid, JSON.parse(curr), 'MAS') ? acc + 1 : acc, 0)
}

const generateGrid = (input: string) => {
  const grid = input.split('\n')
    .map((line) => line.split(''))

  const rowCount = grid.length
  const colCount = grid[0].length

  const ret = new Map<string, string>()

  for (let x = 0; x < colCount; x++) {
    for (let y = 0; y < rowCount; y++) {
      const yPos = rowCount - 1 - y
      ret.set(JSON.stringify({ x, y }), grid[yPos][x])
    }
  }

  return ret
}
  
const findWord = (grid: Map<string, string>, start: Coords, word: string): number => {
  const wordLetters = word.split('')
  const wordCounter = [ ...wordLetters.keys() ]

  debug && console.log('start', `${start.x},${start.y}`)

  const validDirections = directions
    .filter((direction) => {
      
      debug && console.log('  direction', `${direction.xOffset},${direction.yOffset}`)

      return wordCounter.every((idx) => {
        const gridLetterX = start.x + (direction.xOffset * idx)
        const gridLetterY = start.y + (direction.yOffset * idx)
        const gridLetterCoords: Coords = { x: gridLetterX, y: gridLetterY }
        const gridLetter = grid.get(JSON.stringify(gridLetterCoords))
        debug && console.log('    idx', idx, 'grid coords', gridLetterCoords, 'looking for', wordLetters[idx], 'and found', gridLetter)
        return gridLetter && gridLetter.toUpperCase() === wordLetters[idx].toUpperCase()
      })
    })

  return validDirections.length
}

const isValidCross = (grid: Map<string, string>, start: Coords, word: string): boolean => {
  const startLetter = grid.get(JSON.stringify(start))

  const upperLeft: Coords = { x: start.x - 1, y: start.y + 1 }
  const upperRight: Coords = { x: start.x + 1, y: start.y + 1 }
  const lowerRight: Coords = { x: start.x + 1, y: start.y - 1 }
  const lowerLeft: Coords = { x: start.x - 1, y: start.y - 1 }

  const upperLeftLetter = grid.get(JSON.stringify(upperLeft))
  const upperRightLetter = grid.get(JSON.stringify(upperRight))
  const lowerRightLetter = grid.get(JSON.stringify(lowerRight))
  const lowerLeftLetter = grid.get(JSON.stringify(lowerLeft))

  const first = upperLeftLetter && startLetter && lowerRightLetter && upperLeftLetter.concat(startLetter).concat(lowerRightLetter).toUpperCase()
  const second = lowerLeftLetter && startLetter && upperRightLetter && lowerLeftLetter.concat(startLetter).concat(upperRightLetter).toUpperCase()
  
  return first && second && (first === 'MAS' || first === 'SAM') && (second === 'MAS' || second === 'SAM') ? true : false
}

const directions: readonly Direction[] = [
  { xOffset: 0, yOffset: 1 }, // N
  { xOffset: 1, yOffset: 1 }, // NE
  { xOffset: 1, yOffset: 0 }, // E
  { xOffset: 1, yOffset: -1 }, // SE
  { xOffset: 0, yOffset: -1 }, // S
  { xOffset: -1, yOffset: -1 }, // SW
  { xOffset: -1, yOffset: 0 }, // W
  { xOffset: -1, yOffset: 1 } // NW
]

type Coords = { x: number, y: number }
type Direction = { xOffset: number, yOffset: number }
