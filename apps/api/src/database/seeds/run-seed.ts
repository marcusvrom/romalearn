import { configuration } from '../../config/configuration';
import { AppDataSource } from '../data-source';
import { SeedService } from './seed.service';

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
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error) => {
  console.error('Falha ao executar o seed:', error);
  process.exit(1);
});
