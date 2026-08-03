import { configuration } from '../../config/configuration';
import { AppDataSource } from '../data-source';
import { SeedService } from './seed.service';
import { TechnologyCatalogStabilizationService } from './technology-catalog-stabilization.service';
import { TechnologyContentExpansionService } from './technology-content-expansion.service';
import { TechnologyPracticalExamplesService } from './technology-practical-examples.service';
import { TechnologySeedService } from './technology-seed.service';

/**
 * Seed operacional executado em todo deploy.
 *
 * Atualiza apenas catálogo, trilhas, cursos, aulas, avaliações, produtos e
 * ofertas. Contas ficam fora deste fluxo para que uma publicação de conteúdo
 * nunca crie administradores ou alunos automaticamente em produção.
 */
async function main(): Promise<void> {
  const config = configuration();
  const dataSource = await AppDataSource.initialize();

  try {
    const pending = await dataSource.showMigrations();
    if (pending) {
      // eslint-disable-next-line no-console
      console.log('Aplicando migrations pendentes antes do conteúdo…');
      await dataSource.runMigrations();
    }

    await new SeedService(dataSource).run({
      adminEmail: config.seed.adminEmail,
      adminPassword: config.seed.adminPassword,
      adminName: config.seed.adminName,
      demoStudent: false,
      demoStudentEmail: config.seed.demoStudentEmail,
      demoStudentPassword: config.seed.demoStudentPassword,
      isProduction: config.isProduction,
      includeAccounts: false,
    });

    await new TechnologySeedService(dataSource).run();
    await new TechnologyContentExpansionService(dataSource).run();
    await new TechnologyPracticalExamplesService(dataSource).run();
    await new TechnologyCatalogStabilizationService(dataSource).run();
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error: unknown) => {
  console.error('Falha ao distribuir catálogo e conteúdo:', error);
  process.exit(1);
});
