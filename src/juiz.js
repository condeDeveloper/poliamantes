// O juiz. Dois caminhos que nao passam pelo crescimento com conjunto de chaves.
//
// 1. `redelmeier` — o algoritmo de Redelmeier (1981) conta as figuras fixas sem
//    guardar figura nenhuma e sem normalizar nada. Ordena as celulas por uma
//    ordem que a translacao preserva, conta cada figura pela sua MENOR celula e
//    so deixa crescer para celulas maiores que ela. Como a menor celula pode ser
//    de pe ou de cabeca para baixo (e a translacao nao troca uma pela outra),
//    roda duas vezes e soma.
//
// 2. `burnside` — o lema de Burnside: o numero de figuras livres e a media,
//    sobre os 12 movimentos, de quantas figuras fixas cada movimento deixa
//    paradas. E uma identidade entre DUAS contagens feitas por caminhos
//    diferentes (as livres pela forma canonica, as paradas pela simetria de
//    cada fixa); se uma estiver errada, ela nao fecha em inteiro ou nao bate.

import { vizinhos, chaveCelula } from './poliamantes.js'

/** A ordem que a translacao preserva: por b, depois a, depois c. */
function maior (t, raiz) {
  if (t[1] !== raiz[1]) return t[1] > raiz[1]
  if (t[0] !== raiz[0]) return t[0] > raiz[0]
  return t[2] > raiz[2]
}

/** Quantas figuras fixas de cada tamanho tem `raiz` como menor celula. */
export function redelmeierComRaiz (N, raiz) {
  const contagem = new Array(N + 1).fill(0)
  const alcancadas = new Set([chaveCelula(raiz)])
  let nos = 0
  const rec = (naoTentadas, tamanho) => {
    const fila = [...naoTentadas]
    while (fila.length) {
      const c = fila.pop()
      nos++
      contagem[tamanho + 1]++
      if (tamanho + 1 < N) {
        const novos = []
        for (const v of vizinhos(c)) {
          const k = chaveCelula(v)
          if (!maior(v, raiz) || alcancadas.has(k)) continue
          alcancadas.add(k)
          novos.push(v)
        }
        rec([...fila, ...novos], tamanho + 1)
        for (const v of novos) alcancadas.delete(chaveCelula(v))
      }
    }
  }
  rec([raiz], 0)
  return { contagem, nos }
}

/** As figuras fixas de 1 a N, somando a raiz de pe e a de cabeca para baixo. */
export function redelmeier (N) {
  const pe = redelmeierComRaiz(N, [0, 0, 1])
  const cabeca = redelmeierComRaiz(N, [0, 1, 1])
  const fixos = []
  for (let n = 1; n <= N; n++) fixos.push(pe.contagem[n] + cabeca.contagem[n])
  return { fixos, nos: pe.nos + cabeca.nos }
}

/** Burnside: a soma das ordens de simetria das fixas, dividida por 12. */
export function burnside (somaDasSimetrias) {
  return { livres: somaDasSimetrias / 12, inteiro: somaDasSimetrias % 12 === 0 }
}
