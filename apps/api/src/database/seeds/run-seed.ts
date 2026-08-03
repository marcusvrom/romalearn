import { configuration } from '../../config/configuration';
import { AppDataSource } from '../data-source';
import { SeedService } from './seed.service';
import { TechnologySeedService } from './technology-seed.service';

/**
 * Ponto de entrada do `pnpm seed`.
 *
 * Executa as migrations pendentes antes do seed, de modo que um banco vazio
 * fique pronto com um único comando.
 */
async function main(): Promise<void> {
  const config = configuration();

  const dataSource = await AppDataSource.initialize();

  try {
    const pending = await dataSource.showMigrations();
    if (pending) {
      // eslint-disable-next-line no-console
      console.log('Aplicando migrations pendentes…');
      await dataSource.runMigrations();
    }

    await new SeedService(dataSource).run({
      adminEmail: config.seed.adminEmail,
      adminPassword: config.seed.adminPassword,
      adminName: config.seed.adminName,
      demoStudent: config.seed.demoStudent,
      demoStudentEmail: config.seed.demoStudentEmail,
      demoStudentPassword: config.seed.demoStudentPassword,
      isProduction: config.isProduction,
    });

    await new TechnologySeedService(dataSource).run();
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error: unknown) => {
  // A falha mais comum em máquina nova é o banco não estar no ar. Dizer isso
  // em português poupa uma busca pelo significado de ECONNREFUSED.
  if (error instanceof Error && 'code' in error && error.code === 'ECONNREFUSED') {
    console.error(
      '\nNão foi possível conectar ao PostgreSQL.\n\n' +
        'Confira se o banco está no ar e se o .env aponta para ele:\n' +
        '  • com Docker:  pnpm infra:up\n' +
        '  • sem Docker:  inicie seu PostgreSQL local\n\n' +
        'Depois rode o seed novamente.\n',
    );
    process.exit(1);
  }

  console.error('Falha ao executar o seed:', error);
  process.exit(1);
});
