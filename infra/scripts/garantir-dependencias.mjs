#!/usr/bin/env node
/**
 * Instala as dependências quando o lockfile mudou.
 *
 * Depois de um `git pull` que acrescenta uma dependência, `pnpm dev` falha com
 * "Cannot find module" — um erro que aponta para o arquivo errado e não diz o
 * que fazer. Este guarda compara o lockfile com um carimbo gravado dentro de
 * `node_modules` e roda `pnpm install` só quando algo mudou de verdade.
 *
 * Comparar o conteúdo, e não a data, evita reinstalar à toa: trocar de branch
 * mexe na data do arquivo mesmo quando as dependências são as mesmas.
 */
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const lockfile = join(raiz, 'pnpm-lock.yaml');
const carimbo = join(raiz, 'node_modules', '.romalearn-deps');

function hashDoLockfile() {
  if (!existsSync(lockfile)) return null;
  return createHash('sha256').update(readFileSync(lockfile)).digest('hex');
}

function carimboAtual() {
  return existsSync(carimbo) ? readFileSync(carimbo, 'utf8').trim() : null;
}

const esperado = hashDoLockfile();
if (esperado === null) {
  // Sem lockfile não há o que garantir; o install normal cuidará disso.
  process.exit(0);
}

if (carimboAtual() === esperado) process.exit(0);

console.log('\nAs dependências mudaram desde a última instalação. Rodando pnpm install…\n');

// No Windows o executável é `pnpm.cmd`. Resolver o nome aqui evita `shell: true`,
// que o Node 22 adverte por não escapar argumentos e que atrapalha o
// encaminhamento de Ctrl+C para o processo filho.
const comando = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';

const resultado = spawnSync(comando, ['install'], { cwd: raiz, stdio: 'inherit' });

if (resultado.status !== 0) {
  console.error('\nA instalação das dependências falhou. Rode `pnpm install` e veja a mensagem.\n');
  process.exit(resultado.status ?? 1);
}

mkdirSync(dirname(carimbo), { recursive: true });
writeFileSync(carimbo, esperado);
