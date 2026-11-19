# Poliamantes

Figuras de triângulos equiláteros colados pelos lados, contadas por dois caminhos e conferidas pelo lema de Burnside, em Node puro, sem dependência nenhuma.

Um **poliamante** de n é uma figura de n triângulos equiláteros, cada um colado a outro por um lado inteiro. É o primo triangular dos poliminós. Duas figuras são o mesmo poliamante **fixo** quando uma é a outra transladada, e o mesmo poliamante **livre** quando dá para levar uma na outra girando, espelhando e transladando. Os 12 hexiamantes livres são os de n=6.

---

## Os quatro achados

**1. Com 12 triângulos são 39.169 fixos e 3.334 livres.** Contados por crescimento e pelo algoritmo de Redelmeier, que conta sem guardar figura nenhuma. Redelmeier chega lá em dezenas de milissegundos; o crescimento, que guarda tudo num conjunto, leva cerca de um segundo. Os números exatos de tempo variam de máquina para máquina e não estão presos em teste — a contagem está.

**2. O primeiro poliamante com buraco tem 9 triângulos.** Até 8, nenhuma figura cerca um triângulo vazio. Com 9 aparece **uma**; depois 4, 25 e 108 com 10, 11 e 12.

**3. Em n ≡ 2 (mod 3), nenhum poliamante gira 120° sobre si mesmo.** Com 2, 5, 8 e 11 triângulos, as únicas simetrias que aparecem são as de ordem 1, 2 e 4 — nenhuma múltipla de 3. O motivo é contar órbitas: um giro de 120° deixa no máximo um triângulo parado (o do centro), e o resto anda em trios. Então o tamanho de uma figura com esse giro é 0 ou 1 mod 3. Os números confirmam nas doze linhas.

**4. Quase toda figura grande não tem simetria — mas a fração cai a cada n par.** Sem simetria nenhuma: 50% com 5, 75% com 7, 91,88% com 9, 96,96% com 11. Em todo n par a partir de 6 ela **cai** em relação ao n anterior: 41,67% com 6, 71,21% com 8, 88,62% com 10, 95,89% com 12.

---

## As coordenadas

A grade triangular é cortada por três famílias de retas. Cada triângulo é identificado por três inteiros `(a, b, c)` com `a + b + c` igual a 1 (de pé) ou 2 (de cabeça para baixo). Com isso os 12 movimentos rígidos viram contas de inteiros, sem seno nem cosseno:

```
girar 120°:   (a,b,c) → (b,c,a)
meia-volta:   (a,b,c) → (1−a, 1−b, 1−c)
espelho:      (a,b,c) → (a,c,b)
```

Transladar é somar `(p, q, r)` com `p + q + r = 0`. A forma normal leva o menor `a` e o menor `b` para zero, o que fixa a translação inteira.

---

## As tabelas

Todos os números saem de `node ferramentas/medidor.js` e estão presos em `testes/`.

| n | fixos | livres | com buraco | sem simetria | giro de 120° |
| --- | --- | --- | --- | --- | --- |
| 1 | 2 | 1 | 0 | 0,00% | sim |
| 2 | 3 | 1 | 0 | 0,00% | **nunca** |
| 3 | 6 | 1 | 0 | 0,00% | não |
| 4 | 14 | 3 | 0 | 0,00% | sim |
| 5 | 36 | 4 | 0 | 50,00% | **nunca** |
| 6 | 94 | 12 | 0 | 41,67% | sim |
| 7 | 250 | 24 | 0 | 75,00% | sim |
| 8 | 675 | 66 | 0 | 71,21% | **nunca** |
| 9 | 1.838 | 160 | **1** | 91,88% | sim |
| 10 | 5.053 | 448 | 4 | 88,62% | sim |
| 11 | 14.016 | 1.186 | 25 | 96,96% | **nunca** |
| 12 | 39.169 | 3.334 | 108 | 95,89% | sim |

### Quantos dos 12 movimentos deixam cada livre parado

| n | ordem 1 | 2 | 3 | 4 | 6 | 12 |
| --- | --- | --- | --- | --- | --- | --- |
| 6 | 5 | 5 | | 1 | | 1 |
| 10 | 397 | 45 | 2 | 3 | 1 | |
| 11 | 1.150 | 36 | | | | |
| 12 | 3.197 | 132 | 1 | 2 | 1 | 1 |

---

## Os juízes

**Redelmeier** conta os fixos sem guardar figura e sem normalizar nada: ordena as células por uma ordem que a translação preserva, conta cada figura pela sua menor célula, e só deixa crescer para células maiores. Como a menor célula pode ser de pé ou de cabeça para baixo — e a translação não troca uma pela outra —, roda duas vezes e soma. Bate com o crescimento em todas as doze linhas.

**O lema de Burnside**: o número de livres é a média, sobre os 12 movimentos, de quantas fixas cada movimento deixa paradas. É uma identidade entre duas contagens feitas por caminhos diferentes — as livres pela forma canônica, as paradas pela simetria de cada fixa. Fecha em inteiro e bate nas doze linhas, e reprova uma soma que não é múltipla de 12.

**Os movimentos** são conferidos por fora da contagem: o hexágono de seis triângulos em volta de um vértice tem de ser parado pelos 12, e é.

---

## O que as medidas me corrigiram

Nada quebrou neste projeto: crescimento, Redelmeier e Burnside concordaram de primeira, e não vou inventar um erro para preencher a seção.

A regra do mod 3 eu não procurei — vi a linha de 11 triângulos só com simetrias 1 e 2, fiz a conta das órbitas, e só então conferi as outras linhas. A queda da fração sem simetria nos pares foi a mesma coisa: apareceu na coluna, e só depois virou teste.

---

## Como usar

Node 20 ou mais novo. Sem dependência.

```bash
npm test
npm run medir                         # ate 10 triangulos
node ferramentas/medidor.js longo     # ate 12 (~15 s)
node exemplos/uso.js 9
```

```js
import { redelmeier, cresceFixos } from 'poliamantes'

redelmeier(12).fixos[11]   // 39169
```

## Os arquivos

- `src/poliamantes.js` — as coordenadas, os 12 movimentos, o crescimento e o buraco.
- `src/juiz.js` — Redelmeier e Burnside.
- `src/medidas.js` — as tabelas do README, cada uma calculada uma vez só.
- `src/index.js` — a porta de entrada do pacote.
- `exemplos/uso.js` — o pacote em uso.
- `ferramentas/medidor.js` — imprime as tabelas.
- `testes/` — 24 testes, com os números do README presos.

## Licença

MIT.
