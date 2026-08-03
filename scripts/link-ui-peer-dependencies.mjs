import { existsSync, mkdirSync, readFileSync, rmSync, symlinkSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const webPackageJson = resolve(repositoryRoot, 'apps/web/package.json');
const uiNodeModules = resolve(repositoryRoot, 'packages/ui/node_modules');
const resolveFromWeb = createRequire(webPackageJson);

const sharedDependencies = [
  '@angular/common',
  '@angular/core',
  '@angular/router',
  '@romalearn/contracts',
  'tslib',
];

function resolvePackageRoot(dependency) {
  let currentDirectory = dirname(resolveFromWeb.resolve(dependency));

  while (currentDirectory !== dirname(currentDirectory)) {
    const candidate = join(currentDirectory, 'package.json');

    if (existsSync(candidate)) {
      const manifest = JSON.parse(readFileSync(candidate, 'utf8'));
      if (manifest.name === dependency) {
        return currentDirectory;
      }
    }

    currentDirectory = dirname(currentDirectory);
  }

  throw new Error(`Não foi possível localizar o pacote usado pelo frontend: ${dependency}`);
}

// Resolva todos os pacotes antes de remover os links próprios do UI. Assim a
// descoberta reflete exatamente o grafo de dependências do frontend, sem
// depender do layout físico escolhido pelo pnpm.
const resolvedDependencies = new Map(
  sharedDependencies.map((dependency) => [dependency, resolvePackageRoot(dependency)]),
);

// O pacote UI é compilado diretamente pelo app Angular. Ele precisa usar as
// mesmas instâncias de Angular do consumidor; uma segunda cópia de RouterLink
// produz símbolos incompatíveis durante a compilação AOT.
rmSync(uiNodeModules, { recursive: true, force: true });
mkdirSync(uiNodeModules, { recursive: true });

for (const [dependency, source] of resolvedDependencies) {
  const destination = resolve(uiNodeModules, ...dependency.split('/'));
  mkdirSync(dirname(destination), { recursive: true });

  const target = process.platform === 'win32' ? source : relative(dirname(destination), source);
  const linkType = process.platform === 'win32' ? 'junction' : 'dir';
  symlinkSync(target, destination, linkType);

  console.log(`UI dependency linked: ${dependency} -> ${source}`);
}
