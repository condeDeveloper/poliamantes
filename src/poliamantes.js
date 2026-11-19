// Poliamantes: figuras de triangulos equilateros colados pelos lados.
//
// A grade triangular e cortada por tres familias de retas. Cada triangulo fica
// entre tres retas consecutivas, uma de cada familia, e e identificado por tres
// inteiros (a, b, c) com a + b + c igual a 1 (triangulo de PE, apontando para
// cima) ou 2 (de CABECA PARA BAIXO). Com essas coordenadas:
//
//   vizinhos de (a,b,c) com soma 1:  (a+1,b,c), (a,b+1,c), (a,b,c+1)
//   vizinhos de (a,b,c) com soma 2:  (a-1,b,c), (a,b-1,c), (a,b,c-1)
//
// e os 12 movimentos rigidos do triangulo viram contas de inteiros, sem seno nem
// cosseno:
//
//   girar 120 graus:   (a,b,c) -> (b,c,a)
//   meia-volta:        (a,b,c) -> (1-a, 1-b, 1-c)     (troca pe por cabeca)
//   espelho:           (a,b,c) -> (a,c,b)
//
// TRANSLADAR soma (p,q,r) com p+q+r = 0, que nao muda a soma. Duas figuras sao a
// mesma figura FIXA quando uma e a outra transladada; a mesma figura LIVRE
// quando uma e a outra por qualquer um dos 12 movimentos e uma translacao.

export function chaveCelula (t) { return t[0] + ',' + t[1] + ',' + t[2] }

export function vizinhos (t) {
  const [a, b, c] = t
  if (a + b + c === 1) return [[a + 1, b, c], [a, b + 1, c], [a, b, c + 1]]
  return [[a - 1, b, c], [a, b - 1, c], [a, b, c - 1]]
}

/**
 * A forma normal por translacao: leva o menor `a` para 0 e o menor `b` para 0.
 * Como a translacao tem dois graus de liberdade (p e q; r = -p-q), fixar os
 * dois minimos fixa a translacao inteira. Devolve as celulas ordenadas e a chave.
 */
export function normaliza (celulas) {
  let ma = Infinity
  let mb = Infinity
  for (const [a, b] of celulas) { if (a < ma) ma = a; if (b < mb) mb = b }
  const p = -ma
  const q = -mb
  const r = -p - q
  const novas = celulas.map(([a, b, c]) => [a + p, b + q, c + r])
  novas.sort((x, y) => x[0] - y[0] || x[1] - y[1] || x[2] - y[2])
  return { celulas: novas, chave: novas.map(chaveCelula).join(';') }
}

/** Os 12 movimentos, como funcoes de celula. */
export const MOVIMENTOS = (() => {
  const giros = [
    (t) => t,
    (t) => [t[1], t[2], t[0]],
    (t) => [t[2], t[0], t[1]]
  ]
  const lista = []
  for (const g of giros) {
    for (const meia of [false, true]) {
      for (const espelho of [false, true]) {
        lista.push((t) => {
          let u = g(t)
          if (meia) u = [1 - u[0], 1 - u[1], 1 - u[2]]
          if (espelho) u = [u[0], u[2], u[1]]
          return u
        })
      }
    }
  }
  return lista
})()

/** Os 6 movimentos sem espelho: as rotacoes. */
export const ROTACOES = MOVIMENTOS.filter((_, i) => i % 2 === 0)

/** A forma canonica livre: a menor chave entre as 12 imagens normalizadas. */
export function canonicaLivre (celulas) {
  let melhor = null
  for (const m of MOVIMENTOS) {
    const k = normaliza(celulas.map(m)).chave
    if (melhor === null || k < melhor) melhor = k
  }
  return melhor
}

/** Quantos dos 12 movimentos levam a figura nela mesma (a menos de translacao). */
export function ordemDaSimetria (celulas) {
  const propria = normaliza(celulas).chave
  let fixos = 0
  for (const m of MOVIMENTOS) if (normaliza(celulas.map(m)).chave === propria) fixos++
  return fixos
}

/**
 * Cresce as figuras fixas, tamanho a tamanho: cada figura de n+1 triangulos e
 * uma de n com um vizinho a mais. Guarda tudo num conjunto de chaves.
 */
export function cresceFixos (ate) {
  let atual = new Map()
  const um = normaliza([[0, 0, 1]])
  atual.set(um.chave, um.celulas)
  // O triangulo de cabeca para baixo e outra figura FIXA (nao e translacao do de pe).
  const outro = normaliza([[0, 1, 1]])
  atual.set(outro.chave, outro.celulas)
  const niveis = [null, atual]
  for (let n = 2; n <= ate; n++) {
    const prox = new Map()
    for (const cels of atual.values()) {
      const tem = new Set(cels.map(chaveCelula))
      for (const t of cels) {
        for (const v of vizinhos(t)) {
          if (tem.has(chaveCelula(v))) continue
          const f = normaliza([...cels, v])
          if (!prox.has(f.chave)) prox.set(f.chave, f.celulas)
        }
      }
    }
    atual = prox
    niveis.push(atual)
  }
  return niveis
}

/**
 * A figura tem buraco? Um buraco e um triangulo vazio (ou um grupo deles) que
 * nao alcanca o lado de fora andando por triangulos vazios. Olho dentro de uma
 * caixa uma camada maior que a figura: o que o vazio da borda nao alcanca e
 * buraco.
 */
export function temBuraco (celulas) {
  const tem = new Set(celulas.map(chaveCelula))
  let ma = Infinity, Ma = -Infinity, mb = Infinity, Mb = -Infinity, mc = Infinity, Mc = -Infinity
  for (const [a, b, c] of celulas) {
    ma = Math.min(ma, a); Ma = Math.max(Ma, a)
    mb = Math.min(mb, b); Mb = Math.max(Mb, b)
    mc = Math.min(mc, c); Mc = Math.max(Mc, c)
  }
  ma -= 2; Ma += 2; mb -= 2; Mb += 2; mc -= 2; Mc += 2
  const dentro = (t) => t[0] >= ma && t[0] <= Ma && t[1] >= mb && t[1] <= Mb && t[2] >= mc && t[2] <= Mc
  // Todo triangulo vazio da caixa.
  const vazios = []
  for (let a = ma; a <= Ma; a++) {
    for (let b = mb; b <= Mb; b++) {
      for (const s of [1, 2]) {
        const c = s - a - b
        if (c < mc || c > Mc) continue
        if (!tem.has(chaveCelula([a, b, c]))) vazios.push([a, b, c])
      }
    }
  }
  // Os vazios que tocam a borda da caixa sao "de fora"; espalha a partir deles.
  const naBorda = (t) => t[0] === ma || t[0] === Ma || t[1] === mb || t[1] === Mb || t[2] === mc || t[2] === Mc
  const fora = new Set()
  const fila = vazios.filter(naBorda)
  for (const t of fila) fora.add(chaveCelula(t))
  while (fila.length) {
    const t = fila.pop()
    for (const v of vizinhos(t)) {
      const k = chaveCelula(v)
      if (fora.has(k) || tem.has(k) || !dentro(v)) continue
      fora.add(k)
      fila.push(v)
    }
  }
  return vazios.some((t) => !fora.has(chaveCelula(t)))
}
