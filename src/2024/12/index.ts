// https://adventofcode.com/2024/day/12

export const run1 = (input: string): number => {
  const grid = generateGrid(input)
  
  // const crops = groupCrops(grid)
  // console.log(crops)

  let regionId = 0
  let regionsByPlot = new Map<string, number>

  ;[ ...grid.entries() ].forEach(([ plot, crop ]) => {

    const findNeighboringRegions = (plot: string, crop: string) => {
      const validNeighboringRegions = getNeighbors(plot)
        .filter((neighbor) => grid.get(neighbor) === crop)
        .map((neighbor) => regionsByPlot.get(neighbor))
        .filter((region) => region !== undefined)
      
      if (validNeighboringRegions.length) {
        const newRegionId = regionId++
        validNeighboringRegions.forEach((neighboringRegion) => {
          [ ...regionsByPlot.keys() ].forEach((plot) => {
            if (regionsByPlot.get(plot) === neighboringRegion) {
              regionsByPlot.set(plot, newRegionId)
            }
          })
        })
        regionsByPlot.set(plot, newRegionId)
      } else {
        regionsByPlot.set(plot, regionId++)
      }
    }

    findNeighboringRegions(plot, crop)
  })

  // ;[ ...regionsByPlot.entries() ].forEach(([ plot, region ]) => {
  //   console.log(plot, grid.get(plot), region)
  // })

  const plotsByRegion = [ ...regionsByPlot.entries() ].reduce((acc, [ plot, region ]) => {
    const a = acc.get(region) || []
    a.push(plot)
    acc.set(region, a)
    return acc
  }, new Map<number, string[]>)

  const price = [ ...plotsByRegion.entries() ].reduce((acc, [ _region, plots ]) => {
    // console.log(grid.get(plots[0]))
    const area = calculateArea(plots)
    const perimeter = calculatePerimeter(plots)
    // console.log()
    // console.log(grid.get(plots[0]), '(', _region, ')')
    // console.log(plots)
    // console.log(area, '(area) *', perimeter, '(perimeter) =', area * perimeter)
    return acc += area * perimeter
  }, 0)

  return price
}

export const run2 = (input: string): number => {
  const grid = generateGrid(input)
  
  // const crops = groupCrops(grid)
  // console.log(crops)

  let regionId = 0
  let regionsByPlot = new Map<string, number>

  ;[ ...grid.entries() ].forEach(([ plot, crop ]) => {

    const findNeighboringRegions = (plot: string, crop: string) => {
      const validNeighboringRegions = getNeighbors(plot)
        .filter((neighbor) => grid.get(neighbor) === crop)
        .map((neighbor) => regionsByPlot.get(neighbor))
        .filter((region) => region !== undefined)
      
      if (validNeighboringRegions.length) {
        const newRegionId = regionId++
        validNeighboringRegions.forEach((neighboringRegion) => {
          [ ...regionsByPlot.keys() ].forEach((plot) => {
            if (regionsByPlot.get(plot) === neighboringRegion) {
              regionsByPlot.set(plot, newRegionId)
            }
          })
        })
        regionsByPlot.set(plot, newRegionId)
      } else {
        regionsByPlot.set(plot, regionId++)
      }
    }

    findNeighboringRegions(plot, crop)
  })

  // ;[ ...regionsByPlot.entries() ].forEach(([ plot, region ]) => {
  //   console.log(plot, grid.get(plot), region)
  // })

  const plotsByRegion = [ ...regionsByPlot.entries() ].reduce((acc, [ plot, region ]) => {
    const a = acc.get(region) || []
    a.push(plot)
    acc.set(region, a)
    return acc
  }, new Map<number, string[]>)

  const price = [ ...plotsByRegion.entries() ].reduce((acc, [ _region, plots ]) => {
    // console.log(grid.get(plots[0]))
    const area = calculateArea(plots)
    // const edges = calculateEdges(plots)
    const edges = calculateEdges2(plots)
    // console.log(area, '(area) *', edges, '(edges) =', area * edges)
    // console.log()
    return acc += area * edges
  }, 0)

  return price
}


/*
RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE

target 16
+-------+
|#######|
|##.####| 4 | X0,X2       Y5
|##...##| 4 | X0,X4       Y4
|#.....#| 0 | X(1),X5     Y3,Y1,Y3
|#...#.#| 3 | X(1),X3,X5  Y0
|###.###| 5 | X1,X3       Y(1)
|#######|
+-------+

+-------+
|#######|
|##.####|
|##...##|
|#.  ..#|
|#...#.#|
|###.###|
|#######|
+-------+
23 total segments
13 found edges
16 contiguous edges
*/

const calculateEdges2 = (plots: string[]) => {
  // find edge segments

  const nodes: readonly Coords[] = plots.map((v) => JSON.parse(v))

  const uEdges: Coords[] = []
  const rEdges: Coords[] = []
  const dEdges: Coords[] = []
  const lEdges: Coords[] = []

  nodes.forEach((node) => {
    // console.log(node)

    const u = nodes.find((nNode) => nNode.x === node.x && nNode.y === node.y + 1)
    const r = nodes.find((nNode) => nNode.x === node.x + 1 && nNode.y === node.y)
    const d = nodes.find((nNode) => nNode.x === node.x && nNode.y === node.y - 1)
    const l = nodes.find((nNode) => nNode.x === node.x - 1 && nNode.y === node.y)

    if (!u) {
      uEdges.push(node)
    }
    if (!r) {
      rEdges.push(node)
    }
    if (!d) {
      dEdges.push(node)
    }
    if (!l) {
      lEdges.push(node)
    }
  })

  // console.log('uEdges', uEdges)
  const upGroupedByY = [ ...uEdges ].reduce((acc, curr) => {
    const f = acc.get(curr.y) || []
    f.push(curr.x)
    return acc.set(curr.y, f)
  }, new Map<number, number[]>())
  // console.log('upGroupedByY', upGroupedByY)

  const rightGroupedByX = [ ...rEdges ].reduce((acc, curr) => {
    const f = acc.get(curr.x) || []
    f.push(curr.y)
    return acc.set(curr.x, f)
  }, new Map<number, number[]>())

  const downGroupedByY = [ ...dEdges ].reduce((acc, curr) => {
    const f = acc.get(curr.y) || []
    f.push(curr.x)
    return acc.set(curr.y, f)
  }, new Map<number, number[]>())

  const leftGroupedByX = [ ...lEdges ].reduce((acc, curr) => {
    const f = acc.get(curr.x) || []
    f.push(curr.y)
    return acc.set(curr.x, f)
  }, new Map<number, number[]>())

  let upUnique = 0
  ;[ ...upGroupedByY.values() ].forEach((vals) => {
    // console.log('VALS', vals)
    const s = vals.sort()
    let u = 0
    let contiguous = true
    u++
    // console.log(s[0], s[s.length - 1])
    for (let i = s[0]; i <= s[s.length - 1]; i++) {
      // console.log(i)
      const match = vals.indexOf(i) > -1
      if (match && !contiguous) {
        contiguous = true
        u++
      }
      if (!match) {
        contiguous = false
      }
      // console.log(' => ', i, match, contiguous, u)
    }
    upUnique += u
  })

  let rightUnique = 0
  ;[ ...rightGroupedByX.values() ].forEach((vals) => {
    const s = vals.sort()
    let u = 0
    let contiguous = true
    u++
    for (let i = s[0]; i <= s[s.length - 1]; i++) {
      const match = vals.indexOf(i) > -1
      if (match && !contiguous) {
        contiguous = true
        u++
      }
      if (!match) {
        contiguous = false
      }
    }
    rightUnique += u
  })

  let downUnique = 0
  ;[ ...downGroupedByY.values() ].forEach((vals) => {
    const s = vals.sort()
    let u = 0
    let contiguous = true
    u++
    for (let i = s[0]; i <= s[s.length - 1]; i++) {
      const match = vals.indexOf(i) > -1
      if (match && !contiguous) {
        contiguous = true
        u++
      }
      if (!match) {
        contiguous = false
      }
    }
    downUnique += u
  })

  let leftUnique = 0
  ;[ ...leftGroupedByX.values() ].forEach((vals) => {
    const s = vals.sort()
    let u = 0
    let contiguous = true
    u++
    for (let i = s[0]; i <= s[s.length - 1]; i++) {
      const match = vals.indexOf(i) > -1
      if (match && !contiguous) {
        contiguous = true
        u++
      }
      if (!match) {
        contiguous = false
      }
    }
    leftUnique += u
  })

  return upUnique + rightUnique + downUnique + leftUnique


  // 0,1,2,7,8,11 => 6 => 3
  // unique=0, contiguous=true, unique++ (1)
  // 0 => match, contiguous is true, do nothing
  // 1 => match, contiguous is true, do nothing
  // 2 => match, contiguous is true, do nothing
  // 3 => none, contiguous=false
  // 4 => none, contiguous=false
  // 5 => none, contiguous=false
  // 6 => none, contiguous=false
  // 7 => match, contiguous is false, contiguous=true, unique++ (2)
  // 8 => match, contiguous is true, do nothing
  // 9 => none, contiguous=false
  // 10 => none, contiguous=false
  // 11 => match, contiguous is false, contiguous=true, unique++ (3)

}


const calculateEdges = (plots: string[]) => {
  // find edge segments

  const nodes: readonly Coords[] = plots.map((v) => JSON.parse(v))

  const uEdges: Coords[] = []
  const rEdges: Coords[] = []
  const dEdges: Coords[] = []
  const lEdges: Coords[] = []

  nodes.forEach((node) => {
    // console.log(node)
    const u = nodes.find((nNode) => nNode.x === node.x && nNode.y === node.y + 1)
    const r = nodes.find((nNode) => nNode.x === node.x + 1 && nNode.y === node.y)
    const d = nodes.find((nNode) => nNode.x === node.x && nNode.y === node.y - 1)
    const l = nodes.find((nNode) => nNode.x === node.x - 1 && nNode.y === node.y)

    if (!u) {
      uEdges.push(node)
    }
    if (!r) {
      rEdges.push(node)
    }
    if (!d) {
      dEdges.push(node)
    }
    if (!l) {
      lEdges.push(node)
    }
  })

  // console.log('up', uEdges)

  const contiguousUpEdges = [ ...uEdges ].sort((a, b) => a.x > b.x ? 1 : -1).reduce((acc, curr) => {
    const neighborGroup = [ ...acc.keys() ]
      .find((neighborKey) => {
        const f = acc.get(neighborKey) || []
        const g = f.find((neighbor) => {
          return neighbor.y === curr.y && Math.abs(neighbor.x - curr.x) === 1
        })
        return g !== undefined
      })

    if (neighborGroup !== undefined) {
      const f = acc.get(neighborGroup) || []
      f.push(curr)
      acc.set(neighborGroup, f)
    } else {
      acc.set(curr.x, [ curr ])
    }

    return acc
  }, new Map<number, Coords[]>())
  
  const contiguousRightEdges = [ ...rEdges ].sort((a, b) => a.y > b.y ? 1 : -1).reduce((acc, curr) => {
    const neighborGroup = [ ...acc.keys() ]
      .find((neighborKey) => {
        const f = acc.get(neighborKey) || []
        const g = f.find((neighbor) => {
          return neighbor.x === curr.x && Math.abs(neighbor.y - curr.y) === 1
        })
        return g !== undefined
      })

    if (neighborGroup !== undefined) {
      const f = acc.get(neighborGroup) || []
      f.push(curr)
      acc.set(neighborGroup, f)
    } else {
      acc.set(curr.y, [ curr ])
    }

    return acc
  }, new Map<number, Coords[]>())
  
  const contiguousDownEdges = [ ...dEdges ].sort((a, b) => a.x > b.x ? 1 : -1).reduce((acc, curr) => {
    const neighborGroup = [ ...acc.keys() ]
      .find((neighborKey) => {
        const f = acc.get(neighborKey) || []
        const g = f.find((neighbor) => {
          return neighbor.y === curr.y && Math.abs(neighbor.x - curr.x) === 1
        })
        return g !== undefined
      })

    if (neighborGroup !== undefined) {
      const f = acc.get(neighborGroup) || []
      f.push(curr)
      acc.set(neighborGroup, f)
    } else {
      acc.set(curr.x, [ curr ])
    }

    return acc
  }, new Map<number, Coords[]>())
  
  const contiguousLeftEdges = [ ...lEdges ].sort((a, b) => a.y > b.y ? 1 : -1).reduce((acc, curr) => {
    const neighborGroup = [ ...acc.keys() ]
      .find((neighborKey) => {
        const f = acc.get(neighborKey) || []
        const g = f.find((neighbor) => {
          return neighbor.x === curr.x && Math.abs(neighbor.y - curr.y) === 1
        })
        return g !== undefined
      })

    if (neighborGroup !== undefined) {
      const f = acc.get(neighborGroup) || []
      f.push(curr)
      acc.set(neighborGroup, f)
    } else {
      acc.set(curr.y, [ curr ])
    }

    return acc
  }, new Map<number, Coords[]>())
  
  return [ ...contiguousUpEdges.keys() ].length + [ ...contiguousRightEdges.keys() ].length + [ ...contiguousDownEdges.keys() ].length + [ ...contiguousLeftEdges.keys() ].length
}

const calculatePerimeter = (plots: string[]) => {
  let total = plots.length * 4
  let reductions = 0

  // console.log('starting with', total)

  plots.forEach((plot) => {
    // console.log(plot)
    const pos: Coords = JSON.parse(plot)

    plots.forEach((neighbor) => {
      if (neighbor === plot) {
        // console.log('  skip', neighbor)
        return
      }

      const nPos: Coords = JSON.parse(neighbor)

      if (Math.abs(pos.x - nPos.x) === 1 && pos.y === nPos.y) {
        // console.log('  reduction for neighbor at x', neighbor)
        reductions++
      }
      if (Math.abs(pos.y - nPos.y) === 1 && pos.x === nPos.x) {
        // console.log('  reduction for neighbor at y', neighbor)
        reductions++
      }
    })
  })

  // console.log('  reductions', reductions)
  // console.log('  total', total - reductions)
  return total - reductions
}

const calculateArea = (plots: string[]) => plots.length

const getNeighbors = (plot: string) => {
  const pos: Coords = JSON.parse(plot)

  const u: Coords = { x: pos.x, y: pos.y + 1 }
  const r: Coords = { x: pos.x + 1, y: pos.y }
  const d: Coords = { x: pos.x, y: pos.y - 1 }
  const l: Coords = { x: pos.x - 1, y: pos.y }

  return [ JSON.stringify(u), JSON.stringify(r), JSON.stringify(d), JSON.stringify(l) ]
}

// const findContiguous = (crops: Set<string>) => {
//   const regions: readonly Set<string>[] = []

//   crops.forEach((plot) => {
//     const coords: Coords = JSON.parse(plot)
//     const region = regions.filter((region) => )
//   })
// }

// const groupCrops = (grid: Map<string, string>) =>
//   [ ...grid.entries() ]
//     .reduce((acc, [ currPlot, currCrop ]) => {
//       const cropPlots = acc.get(currCrop) || new Set()
//       return acc.set(currCrop, cropPlots.add(currPlot))
//     }, new Map<string, Set<string>>())

const generateGrid = (input: string): Map<string, string> => {
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
  
type Coords = { x: number, y: number }
