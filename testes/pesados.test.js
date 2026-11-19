// O caro: as simetrias e os buracos de todas as figuras ate 12 triangulos.

import test from 'node:test'
import assert from 'node:assert/strict'

import { tabela, duelo } from '../src/medidas.js'

test('11 e 12 triangulos: fixos, livres e Burnside', { timeout: 600000 }, () => {
  const t = tabela(12)
  assert.equal(t[10].fixos, 14016)
  assert.equal(t[11].fixos, 39169)
  assert.equal(t[10].livres, 1186)
  assert.equal(t[11].livres, 3334)
  assert.equal(t[11].burnside, 3334)
})

test('os buracos: 25 com 11 triangulos, 108 com 12', { timeout: 600000 }, () => {
  const t = tabela(12)
  assert.equal(t[10].buracos, 25)
  assert.equal(t[11].buracos, 108)
})

test('com 11 triangulos so ha simetrias de ordem 1 e 2', { timeout: 600000 }, () => {
  const t = tabela(12)
  assert.deepEqual(t[10].porSimetria, [[1, 1150], [2, 36]])
  assert.equal(t[10].comGiro120, false)
  assert.deepEqual(t[11].porSimetria, [[1, 3197], [2, 132], [3, 1], [4, 2], [6, 1], [12, 1]])
})

test('Redelmeier ate 12', { timeout: 600000 }, () => {
  const d = duelo(12)
  assert.deepEqual(d.redelmeier, d.crescimento)
  assert.equal(d.redelmeier[11], 39169)
})
