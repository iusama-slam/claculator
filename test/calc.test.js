import test from 'node:test'
import assert from 'node:assert/strict'
import { evaluate, formatResult } from '../calc.js'

test('the four operations', () => {
  assert.equal(evaluate('2', '+', '3'), 5)
  assert.equal(evaluate('2', '-', '3'), -1)
  assert.equal(evaluate('2', '*', '3'), 6)
  assert.equal(evaluate('6', '/', '3'), 2)
})

test('results are rounded so 0.1 + 0.2 reads 0.3', () => {
  assert.equal(formatResult(evaluate('0.1', '+', '0.2')), '0.3')
  assert.equal(formatResult(10 / 4), '2.5')
})

test('dividing by zero still reads Infinity today', () => {
  assert.equal(formatResult(evaluate('1', '/', '0')), 'Infinity')
})
