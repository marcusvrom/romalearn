import { InitialSchema1785620295283 } from './1785620295283-InitialSchema';
import { ActivityGrading1785899000000 } from './1785899000000-ActivityGrading';

/**
 * Registro explícito das migrations, em ordem cronológica.
 *
 * Usar imports em vez de glob mantém o mesmo conjunto no build compilado,
 * na CLI do TypeORM e nos testes — um glob de arquivos `.ts` não é resolvido
 * pelo executor de testes e faria a suíte rodar contra um banco vazio.
 *
 * Ao gerar uma nova migration, acrescente-a no fim desta lista.
 */
export const MIGRATIONS = [InitialSchema1785620295283, ActivityGrading1785899000000];
