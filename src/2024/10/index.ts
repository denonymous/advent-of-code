// https://adventofcode.com/2024/day/10

export const run1 = (input: string): number => {
  const grid = generateGrid(input)
  const trailheads = findTrailheads(grid)
  return trailheads.reduce((acc, curr) => acc += scoreTrailhead(grid, curr).size, 0)
}

export const run2 = (input: string): number => {
  const grid = generateGrid(input)
  const trailheads = findTrailheads(grid)
  return trailheads.reduce((acc, curr) => {
    const a = scoreTrailhead(grid, curr)
    const b = [ ...a.values() ]
    const c = b.reduce((acc, curr) => acc += curr, 0)
    return acc += c
  }, 0)
}

const scoreTrailhead = (grid: Map<string, number>, trailhead: Coords): Map<string, number> => {
  const topPoints = new Map<string, number>()

  const iterateNextNode = (nodes: readonly Coords[]) => {
    if (nodes.length === 0) {
      // console.log('ran out of nodes', topPoints.size)
      // console.log()
      return
    }
    
    const node = nodes[0]
    const remainingNodes = nodes.slice(1)

    const nodeVal = grid.get(JSON.stringify(node))
    
    // console.log('node', node, nodeVal)
    // console.log('remainingNodes', remainingNodes)

    if (nodeVal === undefined) {
      // console.log('nodeVal undef', topPoints.size)
      // console.log()
      return
    }

    if (nodeVal === 9) {
      // console.log('storing', node, nodeVal)
      topPoints.set(JSON.stringify(node), (topPoints.get(JSON.stringify(node)) || 0) + 1)
      // console.log()
    } else {
      const nextNodeVal = nodeVal + 1
    
      const u = { x: node.x, y: node.y + 1 }
      const r = { x: node.x + 1, y: node.y }
      const d = { x: node.x, y: node.y - 1 }
      const l = { x: node.x - 1, y: node.y }
  
      if (grid.get(JSON.stringify(u)) === nextNodeVal) {
        // console.log('adding up', u, nextNodeVal)
        remainingNodes.push(u)
      }
      if (grid.get(JSON.stringify(r)) === nextNodeVal) {
        // console.log('adding right', r, nextNodeVal)
        remainingNodes.push(r)
      }
      if (grid.get(JSON.stringify(d)) === nextNodeVal) {
        // console.log('adding down', d, nextNodeVal)
        remainingNodes.push(d)
      }
      if (grid.get(JSON.stringify(l)) === nextNodeVal) {
        // console.log('adding left', l, nextNodeVal)
        remainingNodes.push(l)
      }
    }
    
    // console.log()
    iterateNextNode(remainingNodes)
  }

  iterateNextNode([ trailhead ])

  return topPoints
}

const findTrailheads = (grid: Map<string, number>): readonly Coords[] =>
  [ ...grid.entries() ]
    .filter(([ _pos, char ]) => char === 0)
    .map(([ pos, _char ]) => JSON.parse(pos))

const generateGrid = (input: string) => {
  const grid = input.split('\n')
    .map((line) => line.split(''))

  const rowCount = grid.length
  const colCount = grid[0].length

  const ret = new Map<string, number>()

  for (let x = 0; x < colCount; x++) {
    for (let y = 0; y < rowCount; y++) {
      const yPos = rowCount - 1 - y
      ret.set(JSON.stringify({ x, y }), Number.parseInt(grid[yPos][x]))
    }
  }

  return ret
}

type Coords = { x: number, y: number }
