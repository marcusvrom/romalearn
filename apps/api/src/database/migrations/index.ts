import { InitialSchema1785620295283 } from './1785620295283-InitialSchema';
import { ActivityGrading1785899000000 } from './1785899000000-ActivityGrading';
import { ActivityAttachments1785920000000 } from './1785920000000-ActivityAttachments';
import { ActivityExamples1785940000000 } from './1785940000000-ActivityExamples';

/**
 * Registro explícito das migrations, em ordem cronológica.
 *
 * Usar imports em vez de glob mantém o mesmo conjunto no build compilado,
 * na CLI do TypeORM e nos testes — um glob de arquivos `.ts` não é resolvido
 * pelo executor de testes e faria a suíte rodar contra um banco vazio.
 *
 * Ao gerar uma nova migration, acrescente-a no fim desta lista.
 */
export const MIGRATIONS = [
  InitialSchema1785620295283,
  ActivityGrading1785899000000,
  ActivityAttachments1785920000000,
  ActivityExamples1785940000000,
];
