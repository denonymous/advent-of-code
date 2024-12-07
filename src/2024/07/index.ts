// https://adventofcode.com/2024/day/7

const debug = false

export const run1 = (input: string): number => {
  return parseInput(input)
    .map(checkEquation)
    .reduce((acc, curr) => acc += curr, 0)
}

export const run2 = (input: string): number => {
  return parseInput(input)
    .map(checkEquation2)
    .reduce((acc, curr) => acc += curr, 0)
}

const checkEquation = (equation: Equation): number => {
  let totals = [ equation.operands[0] ]
  for (let i = 1; i < equation.operands.length; i++) {
    const newTotals = [
      ...totals.map((v) => v + equation.operands[i]),
      ...totals.map((v) => v * equation.operands[i])
    ].filter((v) => v <= equation.result)
    totals = newTotals
  }

  return totals.filter((v) => v === equation.result).length > 0 ? equation.result : 0
}

const checkEquation2 = (equation: Equation): number => {
  let totals = [ equation.operands[0] ]
  for (let i = 1; i < equation.operands.length; i++) {
    const newTotals = [
      ...totals.map((v) => v + equation.operands[i]),
      ...totals.map((v) => v * equation.operands[i]),
      ...totals.map((v) => Number.parseInt(`${v}${equation.operands[i]}`))
    ].filter((v) => v <= equation.result)
    totals = newTotals
  }

  return totals.filter((v) => v === equation.result).length > 0 ? equation.result : 0
}

const parseInput = (input: string): readonly Equation[] =>
  input.split('\n')
    .map((line) => {
      const bits = line.split(':')
      return { result: Number.parseInt(bits[0]), operands: bits[1].trim().split(/\s+/).map((s) => Number.parseInt(s)) }
    })

type Equation = {
  result: number,
  operands: readonly number[]
}