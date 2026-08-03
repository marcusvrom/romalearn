#!/usr/bin/env node
/**
 * Confere a sintaxe dos exemplos de código das aulas de tecnologia.
 *
 * Um exemplo com erro de sintaxe ensina errado, e o TypeScript não percebe:
 * para ele, o trecho é apenas um array de strings. Aqui cada bloco é entregue
 * ao parser real da linguagem — o mesmo que o aluno vai usar.
 *
 * Cobre Python e JavaScript, que são as linguagens executáveis dos cursos.
 * Blocos de HTML, CSS, bash, Java e pseudocódigo não têm parser disponível
 * neste ambiente e ficam de fora; para eles vale a revisão humana.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const pasta = join(raiz, 'apps/api/src/database/seeds/content/tecnologia');
const temporario = tmpdir();

/** Reconstrói as linhas do bloco a partir do array de strings do TypeScript. */
function linhasDoBloco(corpo) {
  return corpo
    .split('\n')
    .map((linha) => linha.trim())
    .filter((linha) => linha.startsWith("'") || linha.startsWith('"'))
    .map((linha) => {
      const aspas = linha[0];
      const fim =
        linha.lastIndexOf(aspas + ',') > 0
          ? linha.lastIndexOf(aspas + ',')
          : linha.lastIndexOf(aspas);
      return linha
        .slice(1, fim)
        .replaceAll("\\'", "'")
        .replaceAll('\\"', '"')
        .replaceAll('\\\\', '\\');
    })
    .join('\n');
}

const arquivos = readdirSync(pasta).filter(
  (nome) => nome.endsWith('.ts') && nome !== 'index.ts' && !nome.includes('types'),
);

let verificados = 0;
const falhas = [];

for (const arquivo of arquivos) {
  const fonte = readFileSync(join(pasta, arquivo), 'utf8');
  const padrao = /kind: 'code',\s*\n?\s*language: '([a-z]+)',[\s\S]*?lines: \[([\s\S]*?)\n\s*\],/g;

  let achado;
  let indice = 0;

  while ((achado = padrao.exec(fonte))) {
    const linguagem = achado[1];
    indice += 1;
    if (linguagem !== 'python' && linguagem !== 'javascript') continue;

    const codigo = linhasDoBloco(achado[2]);
    verificados += 1;

    try {
      if (linguagem === 'python') {
        const alvo = join(temporario, 'romalearn-exemplo.py');
        writeFileSync(alvo, codigo);
        execFileSync(
          'python3',
          ['-c', `import ast; ast.parse(open(${JSON.stringify(alvo)}).read())`],
          {
            stdio: 'pipe',
          },
        );
      } else {
        const alvo = join(temporario, 'romalearn-exemplo.mjs');
        writeFileSync(alvo, codigo);
        execFileSync(process.execPath, ['--check', alvo], { stdio: 'pipe' });
      }
    } catch (erro) {
      const detalhe = String(erro.stderr || erro.message)
        .split('\n')
        .filter(Boolean)
        .slice(-2)
        .join(' | ');
      falhas.push({ arquivo, indice, linguagem, codigo, detalhe });
    }
  }
}

for (const falha of falhas) {
  console.error(`\n${falha.arquivo} — bloco ${falha.linguagem} #${falha.indice}`);
  console.error(falha.codigo);
  console.error(`  → ${falha.detalhe}`);
}

console.log(
  `\n${verificados} exemplos de Python e JavaScript verificados, ${falhas.length} com erro de sintaxe.`,
);

process.exit(falhas.length === 0 ? 0 : 1);
