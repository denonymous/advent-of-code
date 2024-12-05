// https://adventofcode.com/2024/day/3

export const run1 = (input: string): number => {
  return [ ...(input.matchAll(/mul\((\d+),(\d+)\)/g)) ]
    .reduce((acc, curr) => acc += Number.parseInt(curr[1]) * Number.parseInt(curr[2]), 0)
}

export const run2 = (input: string): number =>
  [ ...(input.matchAll(/(mul\((\d+),(\d+)\)|do\(\)|don't\(\))/g)) ]
    .reduce((acc, curr) => {
      const enabled = curr[1] === 'do()'
        ? true
        : curr[1] === 'don\'t()'
          ? false
          : acc.enabled

      return enabled && curr[0].indexOf('mul(') > -1
        ? { enabled, sum: acc.sum + (Number.parseInt(curr[2]) * Number.parseInt(curr[3])) }
        : { enabled, sum: acc.sum }
    }, { enabled: true, sum: 0 }).sum