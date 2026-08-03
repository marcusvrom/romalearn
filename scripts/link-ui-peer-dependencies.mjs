import { existsSync, mkdirSync, rmSync, symlinkSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const webNodeModules = resolve(repositoryRoot, 'apps/web/node_modules');
const uiNodeModules = resolve(repositoryRoot, 'packages/ui/node_modules');

const sharedDependencies = [
  '@angular/common',
  '@angular/core',
  '@angular/router',
  '@romalearn/contracts',
  'tslib',
];

if (!existsSync(webNodeModules)) {
  throw new Error(
    'As dependências do frontend não foram instaladas. Execute pnpm install antes do build.',
  );
}

// O pacote UI é compilado diretamente pelo app Angular. Ele precisa usar as
// mesmas instâncias de Angular do consumidor; uma segunda cópia de RouterLink
// produz símbolos incompatíveis durante a compilação AOT.
rmSync(uiNodeModules, { recursive: true, force: true });
mkdirSync(uiNodeModules, { recursive: true });

for (const dependency of sharedDependencies) {
  const dependencyParts = dependency.split('/');
  const source = resolve(webNodeModules, ...dependencyParts);
  const destination = resolve(uiNodeModules, ...dependencyParts);

  if (!existsSync(source)) {
    throw new Error(`Dependência compartilhada não encontrada no frontend: ${dependency}`);
  }

  mkdirSync(dirname(destination), { recursive: true });

  const target = process.platform === 'win32' ? source : relative(dirname(destination), source);
  const linkType = process.platform === 'win32' ? 'junction' : 'dir';
  symlinkSync(target, destination, linkType);

  console.log(`UI dependency linked: ${dependency}`);
}
