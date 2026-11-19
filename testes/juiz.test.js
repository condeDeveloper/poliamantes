import test from 'node:test'
import assert from 'node:assert/strict'

import { cresceFixos, ordemDaSimetria, canonicaLivre } from '../src/poliamantes.js'
import { redelmeier, redelmeierComRaiz, burnside } from '../src/juiz.js'

test('Redelmeier e o crescimento contam os mesmos fixos ate 10', () => {
  const r = redelmeier(10)
  assert.deepEqual(r.fixos, cresceFixos(10).slice(1).map((m) => m.size))
})

test('as duas raizes somadas: de pe e de cabeca para baixo', () => {
  const pe = redelmeierComRaiz(4, [0, 0, 1]).contagem
  const cabeca = redelmeierComRaiz(4, [0, 1, 1]).contagem
  assert.equal(pe[1] + cabeca[1], 2)
  assert.equal(pe[4] + cabeca[4], 14)
})

test('Burnside fecha em inteiro e bate com as livres ate 10', () => {
  const niv = cresceFixos(10)
  for (let n = 1; n <= 10; n++) {
    const fixas = [...niv[n].values()]
    let soma = 0
    const livres = new Set()
    for (const c of fixas) { soma += ordemDaSimetria(c); livres.add(canonicaLivre(c)) }
    const b = burnside(soma)
    assert.equal(b.inteiro, true, `n=${n}`)
    assert.equal(b.livres, livres.size, `n=${n}`)
  }
})

test('Burnside reprova uma soma torta', () => {
  // Juiz que aprova tudo nao e juiz: uma soma que nao e multipla de 12.
  assert.equal(burnside(13).inteiro, false)
})
