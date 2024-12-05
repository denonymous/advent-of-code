// https://adventofcode.com/2024/day/1

export const run1 = (input: string): number => {
  const [ left, right ] = parseInput(input)
  
  const sLeft = [ ...left ].sort()
  const sRight = [ ...right ].sort()
  
  const totalDifference = sLeft.reduce((acc, curr, idx) => acc += Math.abs(curr - sRight[idx]), 0)
  
  return totalDifference
}

export const run2 = (input: string): number => {
  const [ left, right ] = parseInput(input)
  
  const mRight = right.reduce((acc, curr) => {
    const n = acc.get(curr) || 0
    return acc.set(curr, n + 1)
  }, new Map<number, number>())
  
  const similarityScore = left.reduce((acc, curr) => {
    const r = mRight.get(curr) || 0
    return acc += (curr * r)
  }, 0)
  
  return similarityScore 
}

const parseInput = (input: string): (readonly number[])[] => {
  const lines = input.split('\n')
  
  const left = lines
    .reduce((acc, val) => {
      return [
        ...acc,
        Number.parseInt(val.split(/\s+/)[0])
      ]
    }, [] as readonly number[])
  
  const right = lines
    .reduce((acc, val) => ([
      ...acc,
      Number.parseInt(val.split(/\s+/)[1])
    ]), [] as readonly number[])
    
  return [ left, right ]
}
