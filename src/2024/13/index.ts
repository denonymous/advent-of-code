// https://adventofcode.com/2024/day/13

export const run1 = (input: string): number =>
  getMachines(input)
    .reduce((acc, curr) => {
      const machineCost = solveMachine(curr, 0)
      return machineCost ? acc += machineCost : acc
    }, 0)

export const run2 = (input: string): number =>
  getMachines(input)
    .reduce((acc, curr) => {
      const machineCost = solveMachine(curr, 10000000000000)
      return machineCost ? acc += machineCost : acc
    }, 0)


const solveMachine = (machine: Machine, prizeOffset: number): number | undefined => {
  const b = ((machine.buttonA.xOffset * (machine.prize.y + prizeOffset)) - ((machine.prize.x + prizeOffset) * machine.buttonA.yOffset)) / ((machine.buttonA.xOffset * machine.buttonB.yOffset) - (machine.buttonA.yOffset * machine.buttonB.xOffset))
  const a = ((machine.prize.x + prizeOffset) - (machine.buttonB.xOffset * b)) / machine.buttonA.xOffset
  const total = (a * 3) + b
  return Math.trunc(total) === total ? total : undefined
}

const getMachines = (input: string): readonly Machine[] => {
  const lines = input.split('\n')

  let machine: Machine = { buttonA: { xOffset: 0, yOffset: 0 }, buttonB: { xOffset: 0, yOffset: 0 }, prize: { x: 0, y: 0 } }
  const machines: readonly Machine[] = lines.reduce((acc, curr) => {
    let bits

    bits = curr.match(/^Button A: X(\+|-)(\d+), Y(\+|-)(\d+)/)
    if (bits) {
      const xVal = Number.parseInt(bits[2])
      const x = bits[1] === '-' ? 0 - xVal : xVal

      const yVal = Number.parseInt(bits[4])
      const y = bits[3] === '-' ? 0 - yVal : yVal
      machine.buttonA = { xOffset: x, yOffset: y }

      return acc
    }

    bits = curr.match(/^Button B: X(\+|-)(\d+), Y(\+|-)(\d+)/)
    if (bits) {
      const xVal = Number.parseInt(bits[2])
      const x = bits[1] === '-' ? 0 - xVal : xVal

      const yVal = Number.parseInt(bits[4])
      const y = bits[3] === '-' ? 0 - yVal : yVal
      machine.buttonB = { xOffset: x, yOffset: y }

      return acc
    }

    bits = curr.match(/^Prize: X=(\d+), Y=(\d+)/)
    if (bits) {
      machine.prize = { x: Number.parseInt(bits[1]), y: Number.parseInt(bits[2]) }
      return [ ...acc, { ...machine } ]
    }

    return acc
  }, [] as Machine[])

  return machines
}

type Machine = {
  buttonA: Direction
  buttonB: Direction
  prize: Coords
}

type Coords = { x: number, y: number }
type Direction = { xOffset: number, yOffset: number }
