// https://adventofcode.com/2024/day/14

export const run1 = (input: string, width: number, height: number): number => {
  let robots = getRobots(input)
  for (let i = 0; i < 100; i++) {
    robots = tick(robots, width, height, 1)
  }

  return calculateSafetyFactor(robots, width, height)
}

export const run2 = (input: string, width: number, height: number): number => {
  let accelerator = 1

  let robots = getRobots(input)
  let foundTree = false
  let ticks = 0
  while (!foundTree) {
    if (hasTree(robots, width, 6)) {
      console.log(ticks)
      foundTree = true
      showGrid(robots, width, height)
      console.log()
      break
    } else {
      ticks++
    }
    robots = tick(robots, width, height, accelerator)
  }

  return ticks
}

const hasTree = (robots: readonly Robot[], width: number, searchSize: number): boolean => {
  const minX = Math.floor(width / 2) - 7
  const maxX = Math.floor(width / 2) + 7
  for (let x = minX; x <= maxX; x++) {
    const robotsInX = robots.filter((robot) => robot.currentPosition.x === x)
    const ys = robotsInX.map((robot) => robot.currentPosition.y)
    const grouped = ys.reduce((acc, curr) => {
      const f = [ ...acc.entries() ].find(([ _idx, group ]) => group.find((n) => n === curr || n === curr + 1 || n === curr - 1))

      if (f) {
        const g = f[1]
        g.push(curr)
        acc.set(f[0], [ ...new Set(g) ])
      } else {
        acc.set(curr, [ curr ])
      }

      return acc
    }, new Map<number, number[]>())

    const meetsSize = [ ...grouped.values() ].find((vals) => vals.length >= searchSize)
    if (meetsSize) {
      console.log(meetsSize)
      console.log(grouped)
      return true
    }
  }

  return false
}

const showGrid = (robots: readonly Robot[], width: number, height: number) => {
  for (let y = 0; y < height; y++) {
    let line = ''
    for (let x = 0; x < width; x++) {
      const here = robots.filter((robot) => robot.currentPosition.x === x && robot.currentPosition.y === y)
      line = line.concat(here.length ? '#' : '.')
    }
    console.log(line)
  }
  console.log()
  console.log()
  console.log()
}

const calculateSafetyFactor = (robots: readonly Robot[], gridWidth: number, gridHeight: number) => {
  const topLeftRobots = robots.filter((robot) => robot.currentPosition.x < Math.floor(gridWidth / 2) && robot.currentPosition.y < Math.floor(gridHeight / 2))
  const topRightRobots = robots.filter((robot) => robot.currentPosition.x > Math.floor(gridWidth / 2) && robot.currentPosition.y < Math.floor(gridHeight / 2))
  const bottomLeftRobots = robots.filter((robot) => robot.currentPosition.x < Math.floor(gridWidth / 2) && robot.currentPosition.y > Math.floor(gridHeight / 2))
  const bottomRightRobots = robots.filter((robot) => robot.currentPosition.x > Math.floor(gridWidth / 2) && robot.currentPosition.y > Math.floor(gridHeight / 2))

  return topLeftRobots.length * topRightRobots.length * bottomLeftRobots.length * bottomRightRobots.length
}

const tick = (robots: readonly Robot[], gridWidth: number, gridHeight: number, accelerator: number): readonly Robot[] =>
  robots.map((robot) => {
    const newX = robot.currentPosition.x + (robot.velocity.xOffset * accelerator)
    const newY = robot.currentPosition.y + (robot.velocity.yOffset * accelerator)

    return {
      ...robot,
      currentPosition: fix({ x: newX, y: newY }, gridWidth, gridHeight)
    }
  })

const fix = (pos: Position, totalTilesX: number, totalTilesY: number): Position => {
  const x = pos.x < 0
    ? totalTilesX + pos.x
    : pos.x >= totalTilesX
      ? pos.x - totalTilesX
      : pos.x

  const y = pos.y < 0
    ? totalTilesY + pos.y
    : pos.y >= totalTilesY
      ? pos.y - totalTilesY
      : pos.y

  return { x, y }
}

const getRobots = (input: string): readonly Robot[] =>
  input.split('\n')
    .map((line) => {
      const bits = line.match(/^p=(\d+),(\d+)\s+v=(-)?(\d+),(-)?(\d+)/) || []
      return {
        currentPosition: {
          x: Number.parseInt(bits[1]),
          y: Number.parseInt(bits[2]),
        },
        velocity: {
          xOffset: (bits[3] ? -1 : 1) * Number.parseInt(bits[4]),
          yOffset: (bits[5] ? -1 : 1) * Number.parseInt(bits[6])
        }
      } as Robot
    })

type Robot = {
  currentPosition: Position
  velocity: Velocity
}

type Position = {
  x: number
  y: number
}

type Velocity = {
  xOffset: number
  yOffset: number
}