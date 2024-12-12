// https://adventofcode.com/2024/day/11

export const run1 = (input: string): number => {
  let stones = input.split(' ')
    .filter((v) => v !== '')

  const m = stones.reduce((acc, curr) => {
    let store = new Map<string, number>()
    store.set(curr, 1)
    for (let i = 0; i < 25; i++) {
      store = blink(store)
    }

    ;[ ...store.entries() ].forEach(([ val, count ]) => acc.set(val, (acc.get(val) || 0) + count))
    return acc
  }, new Map<string, number>)

  return [ ...m.values() ].reduce((acc, curr) => acc += curr, 0)
}

export const run2 = (input: string): number => {
  let stones = input.split(' ')
    .filter((v) => v !== '')

  const m = stones.reduce((acc, curr) => {
    let store = new Map<string, number>()
    store.set(curr, 1)
    for (let i = 0; i < 75; i++) {
      store = blink(store)
    }

    ;[ ...store.entries() ].forEach(([ val, count ]) => acc.set(val, (acc.get(val) || 0) + count))
    return acc
  }, new Map<string, number>)

  return [ ...m.values() ].reduce((acc, curr) => acc += curr, 0)
}

const blink = (store: Map<string, number>): Map<string, number> => {
  const ret = new Map<string, number>()

  ;[ ...store.entries() ]
    .filter(([ _val, count ]) => count > 0)
    .forEach(([ val, count ]) => {
      // console.log('working with', val, '(', count, ')')
      const results = transform(val)
      // console.log('got', results)
      results.forEach((val) => {
        const c = (ret.get(val) || 0) + count
        // console.log('setting', val, 'to', c)
        ret.set(val, c)
      })
    })
  
  return ret
}

/*
If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
If the stone is engraved with a number that has an even number of digits, it is replaced by two 
  stones. The left half of the digits are engraved on the new left stone, and the right half of 
  the digits are engraved on the new right stone. (The new numbers don't keep extra leading 
  zeroes: 1000 would become stones 10 and 0.)
If none of the other rules apply, the stone is replaced by a new stone; the old stone's number 
  multiplied by 2024 is engraved on the new stone.
*/

const transform = (val: string): readonly string[] => {
  const ret = val === '0'
    ? [ '1' ]
    : val.length % 2 === 0
      ? [
        `${Number.parseInt(val.substring(0, val.length / 2))}`,
        `${Number.parseInt(val.substring(val.length / 2))}`
      ]
      : [ `${Number.parseInt(val) * 2024}` ]

  return ret
}
