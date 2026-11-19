#!/usr/bin/env node
// O medidor. Roda as tabelas e cospe os numeros que vao para o README.
//
//   node ferramentas/medidor.js             todas (ate 10 triangulos)
//   node ferramentas/medidor.js contagem    fixos, livres e Burnside
//   node ferramentas/medidor.js simetrias   ordem de simetria de cada livre
//   node ferramentas/medidor.js buracos     quantos livres tem buraco
//   node ferramentas/medidor.js duelo       Redelmeier contra crescimento
//   node ferramentas/medidor.js longo       tudo ate 12 triangulos (~15 s)

import { tabela, duelo } from '../src/medidas.js'

const pad = (s, w) => String(s).padStart(w)
const n = (x) => x.toLocaleString('pt-BR')

function tContagem (ate) {
  console.log('\n== poliamantes fixos e livres ==')
  for (const l of tabela(ate)) console.log(`   n=${pad(l.n, 2)}  fixos ${pad(n(l.fixos), 7)}   livres ${pad(n(l.livres), 6)}   Burnside ${pad(n(l.burnside), 6)} ${l.burnsideInteiro && l.burnside === l.livres ? 'fecha' : 'NAO FECHA'}`)
}

function tSimetrias (ate) {
  console.log('\n== quantos movimentos (de 12) deixam cada livre parado ==')
  for (const l of tabela(ate)) {
    console.log(`   n=${pad(l.n, 2)} (mod 3 = ${l.n % 3})  ${l.porSimetria.map(([s, q]) => `ordem ${s}: ${q}`).join('   ')}   giro de 120: ${l.comGiro120 ? 'sim' : 'nunca'}   sem simetria: ${(l.assimetricos / l.livres * 100).toFixed(2)}%`)
  }
}

function tBuracos (ate) {
  console.log('\n== poliamantes livres com buraco ==')
  for (const l of tabela(ate)) if (l.n >= 8) console.log(`   n=${pad(l.n, 2)}  ${l.buracos} de ${n(l.livres)}`)
}

function tDuelo (ate) {
  const d = duelo(ate)
  console.log('\n== Redelmeier, sem guardar figura, contra o crescimento ==')
  console.log(`   Redelmeier:  ${d.redelmeier.join(', ')}   (${n(d.nosRedelmeier)} nos)`)
  console.log(`   crescimento: ${d.crescimento.join(', ')}`)
  console.log(`   concordam: ${d.redelmeier.join() === d.crescimento.join()}`)
}

const partes = {
  contagem: () => tContagem(10), simetrias: () => tSimetrias(10), buracos: () => tBuracos(10), duelo: () => tDuelo(10),
  longo: () => { tContagem(12); tSimetrias(12); tBuracos(12); tDuelo(12) }
}
const pedido = process.argv[2]
if (!pedido) { partes.contagem(); partes.simetrias(); partes.buracos(); partes.duelo() } else if (partes[pedido]) partes[pedido]()
else { console.error(`nao conheco "${pedido}". conheco: ${Object.keys(partes).join(', ')}`); process.exit(1) }
