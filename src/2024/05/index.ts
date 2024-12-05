// https://adventofcode.com/2024/day/5

const debug = false

export const run1 = (input: string): number => {
  const ret = parseInput(input)
  
  debug && console.log(ret)
  
  return ret.updates
    .filter((update) => updatePassesRules(ret.rules, update))
    .reduce((acc, curr) => acc += curr[Math.floor(curr.length / 2)], 0)
}

export const run2 = (input: string): number => {
  const ret = parseInput(input)
  
  return ret.updates
    .filter((update) => !updatePassesRules(ret.rules, update))
    .map((update) => reorder(ret.rules, update))
    .reduce((acc, curr) => acc += curr[Math.floor(curr.length / 2)], 0)
}

const reorder = (rules: readonly Rule[], update: Update): Update =>
  [ ...update ]
    .sort((a, b) => {
      return rules.find((rule) => rule.before === a && rule.after === b)
        ? -1
        : rules.find((rule) => rule.before === b && rule.after === a)
          ? 1
          : 0
    })

const updatePassesRules = (rules: readonly Rule[], update: Update): boolean =>
  rules.every((rule) => {
    const bIdx = update.indexOf(rule.before)
    const aIdx = update.indexOf(rule.after)

    return bIdx > -1 && aIdx > -1 ? bIdx < aIdx : true
  })

const parseInput = (input: string) =>
  input.split('\n')
    .reduce(
      (acc, curr) => {
        const ruleBits = curr.split('|')
        
        if (ruleBits.length === 2) {
          return {
            rules: [
              ...acc.rules,
              { before: Number.parseInt(ruleBits[0]), after: Number.parseInt(ruleBits[1]) }
            ],
            updates: acc.updates
          }
        }

        const updates = curr.split(',')

        if (updates.length > 1) {
          return {
            rules: acc.rules,
            updates: [
              ...acc.updates,
              updates.map((num) => Number.parseInt(num))
            ]
          }
        }

        return acc
      },
      { rules: [] as readonly Rule[], updates: [] as readonly Update[] }
    )

type Rule = {
  before: number,
  after: number
}

type Update = readonly number[]