import fs from 'node:fs'
import { run1, run2 } from '.'

test('#1 sample', () => {
  const input = fs.readFileSync(`${__dirname}/sample.txt`, 'utf-8')
  const results = run1(input)
  expect(results).toEqual(41)
})

test('#1 actual', () => {
  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')
  const results = run1(input)
  expect(results).toEqual(4776)
})

test('#2 sample', () => {
  const input = fs.readFileSync(`${__dirname}/sample.txt`, 'utf-8')
  const results = run2(input)
  expect(results).toEqual(6)
})

test('#2 actual', () => {
  const input = fs.readFileSync(`${__dirname}/input.txt`, 'utf-8')
  const results = run2(input)
  expect(results).toEqual(1586)
})
