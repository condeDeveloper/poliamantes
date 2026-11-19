// As tabelas do README. Calculadas aqui, e em lugar nenhum mais.

import { cresceFixos, canonicaLivre, ordemDaSimetria, temBuraco } from './poliamantes.js'
import { redelmeier, burnside } from './juiz.js'

const guardadas = new Map()
function umaVez (k, fn) {
  if (!guardadas.has(k)) guardadas.set(k, fn())
  return guardadas.get(k)
}

export function niveis (ate) {
  return umaVez(`niveis:${ate}`, () => cresceFixos(ate))
}

/** Fixos, livres, Burnside, simetrias e buracos, de 1 a `ate`. */
export function tabela (ate = 10) {
  return umaVez(`tab:${ate}`, () => {
    const niv = niveis(ate)
    const linhas = []
    for (let n = 1; n <= ate; n++) {
      const fixas = [...niv[n].values()]
      const livres = new Map()
      let somaSimetrias = 0
      for (const c of fixas) {
        livres.set(canonicaLivre(c), c)
        somaSimetrias += ordemDaSimetria(c)
      }
      const porSimetria = new Map()
      let buracos = 0
      for (const c of livres.values()) {
        const s = ordemDaSimetria(c)
        porSimetria.set(s, (porSimetria.get(s) || 0) + 1)
        if (temBuraco(c)) buracos++
      }
      const b = burnside(somaSimetrias)
      linhas.push({
        n,
        fixos: fixas.length,
        livres: livres.size,
        burnside: b.livres,
        burnsideInteiro: b.inteiro,
        porSimetria: [...porSimetria].sort((x, y) => x[0] - y[0]),
        comGiro120: [...porSimetria.keys()].some((s) => s % 3 === 0),
        assimetricos: porSimetria.get(1) || 0,
        buracos
      })
    }
    return linhas
  })
}

/** Redelmeier contra o crescimento, com o custo de cada um. */
export function duelo (ate = 10) {
  return umaVez(`duelo:${ate}`, () => {
    let t = Date.now()
    const r = redelmeier(ate)
    const msR = Date.now() - t
    t = Date.now()
    const niv = cresceFixos(ate)
    const msC = Date.now() - t
    return {
      redelmeier: r.fixos,
      crescimento: niv.slice(1).map((m) => m.size),
      nosRedelmeier: r.nos,
      // Os tempos variam de maquina para maquina e NAO vao para teste: so a
      // ordem de grandeza entra no README, dita como tal.
      msRedelmeier: msR,
      msCrescimento: msC
    }
  })
}
