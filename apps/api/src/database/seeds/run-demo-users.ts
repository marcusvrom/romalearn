import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { configuration } from '../../config/configuration';
import { DemoPersona, DemoUsersSeeder } from './demo-users';

/**
 * Ponto de entrada do `pnpm seed:demo`.
 *
 * Sobe o contexto da aplicação (sem servidor HTTP) para que as contas de
 * demonstração sejam criadas pelos serviços reais, e não por inserções
 * diretas no banco.
 */
async function main(): Promise<void> {
  const config = configuration();

  if (config.isProduction) {
    console.error('Recusado: contas de demonstração não podem ser criadas em produção.');
    process.exit(1);
  }

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'warn', 'error'],
  });

  try {
    const seeder = new DemoUsersSeeder(app);

    if (!(await seeder.assertCatalogReady())) {
      process.exit(1);
    }

    const password = process.env['SEED_DEMO_PASSWORD'] ?? 'Senha@123456';
    const personas = await seeder.run({ password, isProduction: config.isProduction });

    await seeder.summarize(personas);
    printTable(personas, password, config.seed.adminEmail, config.seed.adminPassword);
  } finally {
    await app.close();
  }
}

/** Imprime a tabela de acesso para colar no roteiro de testes. */
function printTable(
  personas: DemoPersona[],
  password: string,
  adminEmail: string,
  adminPassword: string,
): void {
  const lines = [
    '',
    '================================================================',
    '  CONTAS PARA TESTE MANUAL — somente ambiente local',
    '================================================================',
    '',
    `  Administrador   ${adminEmail}  /  ${adminPassword}`,
    '',
    `  Demais contas usam a senha: ${password}`,
    '',
  ];

  for (const persona of personas) {
    lines.push(`  ${persona.email}`);
    lines.push(`      ${persona.name} · ${persona.roles.join(', ')}`);
    lines.push(`      ${persona.situation}`);
    lines.push('');
  }

  lines.push('  Visitante não cadastrado: navegue sem entrar, ou crie uma conta nova.');
  lines.push('  Roteiro completo: docs/roteiro-de-testes.md');
  lines.push('================================================================');
  lines.push('');

  process.stdout.write(`${lines.join('\n')}\n`);
}

main().catch((error) => {
  console.error('Falha ao criar as contas de demonstração:', error);
  process.exit(1);
});
