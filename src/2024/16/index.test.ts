import fs from 'node:fs'
import { run1, run2 } from '.'

test('#1 sample - 1', () => {
  const input = fs.readFileSync(`${__dirname}/sample-1.txt`, 'utf-8')
  const results = run1(input)
  expect(results).toEqual(7036)
})

test('#1 sample - 2', () => {
  const input = fs.readFileSync(`${__dirname}/sample-2.txt`, 'utf-8')
  const results = run1(input)
  expect(results).toEqual(11048)
})

test('#1 actual', () => {
  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')
  const results = run1(input)
  expect(results).toEqual(75416)
})

// test('#2 sample - 1', () => {
//   const input = fs.readFileSync(`${__dirname}/sample-1.txt`, 'utf-8')
//   const results = run2(input)
//   expect(results).toEqual(45)
// })

// test('#2 sample - 2', () => {
//   const input = fs.readFileSync(`${__dirname}/sample-2.txt`, 'utf-8')
//   const results = run2(input)
//   expect(results).toEqual(64)
// })

// test('#2 actual', () => {
//   const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')
//   const results = run2(input)
//   expect(results).toEqual(null)
// })
