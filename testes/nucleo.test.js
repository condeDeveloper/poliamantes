import test from 'node:test'
import assert from 'node:assert/strict'

import {
  vizinhos, normaliza, MOVIMENTOS, ROTACOES, canonicaLivre, ordemDaSimetria, cresceFixos, temBuraco, chaveCelula
} from '../src/poliamantes.js'

test('todo triangulo tem 3 vizinhos, e a vizinhanca e simetrica', () => {
  for (const t of [[0, 0, 1], [0, 1, 1], [3, -2, 0], [-1, 2, 1]]) {
    const vs = vizinhos(t)
    assert.equal(vs.length, 3)
    for (const v of vs) assert.ok(vizinhos(v).some((w) => chaveCelula(w) === chaveCelula(t)))
  }
})

test('o vizinho de um triangulo de pe e de cabeca para baixo', () => {
  for (const v of vizinhos([0, 0, 1])) assert.equal(v[0] + v[1] + v[2], 2)
})

test('12 movimentos, 6 deles rotacoes, e todos levam triangulo em triangulo', () => {
  assert.equal(MOVIMENTOS.length, 12)
  assert.equal(ROTACOES.length, 6)
  for (const m of MOVIMENTOS) {
    const s = m([2, -1, 0]).reduce((x, y) => x + y, 0)
    assert.ok(s === 1 || s === 2)
  }
})

test('os movimentos preservam a vizinhanca', () => {
  const a = [0, 0, 1]
  const b = vizinhos(a)[1]
  for (const m of MOVIMENTOS) {
    const ma = m(a)
    const mb = m(b)
    assert.ok(vizinhos(ma).some((v) => chaveCelula(v) === chaveCelula(mb)))
  }
})

test('normalizar e invariante por translacao', () => {
  const f = [[0, 0, 1], [1, 0, 1], [1, 0, 0]]
  const g = f.map(([a, b, c]) => [a + 3, b - 5, c + 2])
  assert.equal(normaliza(f).chave, normaliza(g).chave)
})

test('o triangulo de pe e o de cabeca sao fixos diferentes e o mesmo livre', () => {
  assert.notEqual(normaliza([[0, 0, 1]]).chave, normaliza([[0, 1, 1]]).chave)
  assert.equal(canonicaLivre([[0, 0, 1]]), canonicaLivre([[0, 1, 1]]))
})

test('o hexagono de 6 triangulos tem os 12 movimentos como simetria', () => {
  // Os seis triangulos em volta de um vertice.
  const hex = [[0, 0, 1], [1, 0, 1], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 1, 1]]
  assert.equal(ordemDaSimetria(hex), 12)
})

test('fixos de 1 a 6: 2, 3, 6, 14, 36, 94', () => {
  assert.deepEqual(cresceFixos(6).slice(1).map((m) => m.size), [2, 3, 6, 14, 36, 94])
})

test('nenhuma figura de ate 8 triangulos tem buraco', () => {
  const niv = cresceFixos(8)
  for (let n = 1; n <= 8; n++) for (const c of niv[n].values()) assert.equal(temBuraco(c), false, `n=${n}`)
})

test('o anel em volta de um triangulo tem buraco', () => {
  // O triangulo [0,0,1] cercado pelos tres vizinhos e pelos que fecham a volta.
  const centro = [0, 0, 1]
  const anel = []
  const tem = new Set([chaveCelula(centro)])
  for (const v of vizinhos(centro)) { anel.push(v); tem.add(chaveCelula(v)) }
  for (const v of [...anel]) for (const w of vizinhos(v)) if (!tem.has(chaveCelula(w))) { anel.push(w); tem.add(chaveCelula(w)) }
  // Sem o triangulo do centro, o resto cerca um buraco.
  assert.equal(temBuraco(anel), true)
  assert.equal(temBuraco([...anel, centro]), false)
})
