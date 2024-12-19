import fs from 'node:fs'
import { run1, run2 } from '.'

test('#1 sample', () => {
  const input = fs.readFileSync(`${__dirname}/sample.txt`, 'utf-8')
  const results = run1(input, 11, 7)
  expect(results).toEqual(12)
})

test('#1 actual', () => {
  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')
  const results = run1(input, 101, 103)
  expect(results).toEqual(232589280)
})

// test('#2 sample', () => {
//   const input = fs.readFileSync(`${__dirname}/sample.txt`, 'utf-8')
//   const results = run2(input, 11, 7)
//   expect(results).toEqual(null)
// })

test('#2 actual', () => {
  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')
  const results = run2(input, 101, 103)
  expect(results).toEqual(7569)
})
