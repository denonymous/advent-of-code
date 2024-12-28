import fs from 'node:fs'
import { run1, run2 } from '.'

test('#1 sample - small', () => {
  const input = fs.readFileSync(`${__dirname}/sample-small.txt`, 'utf-8')
  const results = run1(input)
  expect(results).toEqual(2028)
})

test('#1 sample - large', () => {
  const input = fs.readFileSync(`${__dirname}/sample-large.txt`, 'utf-8')
  const results = run1(input)
  expect(results).toEqual(10092)
})

test('#1 actual', () => {
  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')
  const results = run1(input)
  expect(results).toEqual(1490942)
})

// test('#2 sample', () => {
//   const input = fs.readFileSync(`${__dirname}/sample.txt`, 'utf-8')
//   const results = run2(input)
//   expect(results).toEqual(null)
// })

// test('#2 actual', () => {
//   const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')
//   const results = run2(input)
//   expect(results).toEqual(null)
// })
