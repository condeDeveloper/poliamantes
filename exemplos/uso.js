#!/usr/bin/env node
// Exemplo de uso da biblioteca pela porta de entrada do pacote.
//
//   node exemplos/uso.js 9
//
// Conta os poliamantes de n triangulos e mostra o primeiro livre com buraco.

import { cresceFixos, canonicaLivre, temBuraco, ordemDaSimetria, redelmeier } from '../src/index.js'

const n = Number(process.argv[2] || 9)
const niv = cresceFixos(n)
const livres = new Map()
for (const c of niv[n].values()) livres.set(canonicaLivre(c), c)

console.log(`${n} triangulos: ${niv[n].size} fixos, ${livres.size} livres`)
console.log(`pelo Redelmeier, sem guardar figura: ${redelmeier(n).fixos[n - 1]} fixos`)
for (const c of livres.values()) {
  if (temBuraco(c)) {
    console.log(`um com buraco (simetria de ordem ${ordemDaSimetria(c)}):`)
    console.log('  ' + c.map((t) => '(' + t.join(',') + ')').join(' '))
    break
  }
}
