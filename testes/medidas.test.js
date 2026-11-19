// Os numeros do README, presos. (Ate 10 aqui; 11 e 12 no arquivo pesado.)

import test from 'node:test'
import assert from 'node:assert/strict'

import { tabela, duelo } from '../src/medidas.js'

test('fixos e livres de 1 a 10', () => {
  const t = tabela(10)
  assert.deepEqual(t.map((l) => l.fixos), [2, 3, 6, 14, 36, 94, 250, 675, 1838, 5053])
  assert.deepEqual(t.map((l) => l.livres), [1, 1, 1, 3, 4, 12, 24, 66, 160, 448])
  for (const l of t) assert.equal(l.burnside, l.livres)
})

test('o primeiro com buraco aparece com 9 triangulos', () => {
  const t = tabela(10)
  for (let n = 1; n <= 8; n++) assert.equal(t[n - 1].buracos, 0)
  assert.equal(t[8].buracos, 1)
  assert.equal(t[9].buracos, 4)
})

test('em n = 2, 5, 8 nenhum livre gira 120 graus sobre si mesmo', () => {
  for (const l of tabela(10)) if (l.n % 3 === 2) assert.equal(l.comGiro120, false, `n=${l.n}`)
})

test('as simetrias de n = 6 e n = 10', () => {
  const t = tabela(10)
  assert.deepEqual(t[5].porSimetria, [[1, 5], [2, 5], [4, 1], [12, 1]])
  assert.deepEqual(t[9].porSimetria, [[1, 397], [2, 45], [3, 2], [4, 3], [6, 1]])
})

test('a fracao sem simetria cai em todo n par a partir de 6', () => {
  const t = tabela(10)
  const f = t.map((l) => l.assimetricos / l.livres)
  for (const n of [6, 8, 10]) assert.ok(f[n - 1] < f[n - 2], `n=${n}`)
  for (const n of [7, 9]) assert.ok(f[n - 1] > f[n - 2], `n=${n}`)
})

test('Redelmeier e o crescimento concordam ate 10', () => {
  const d = duelo(10)
  assert.deepEqual(d.redelmeier, d.crescimento)
})
