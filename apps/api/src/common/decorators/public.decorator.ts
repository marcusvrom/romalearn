import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'romalearn:isPublic';

/**
 * Marca uma rota como pública.
 *
 * O guard de autenticação é global: sem este decorador, toda rota exige
 * sessão válida. Esconder botões no front nunca substitui esta verificação.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const OPTIONAL_AUTH_KEY = 'romalearn:optionalAuth';

/**
 * Rota pública que enriquece a resposta quando há sessão
 * (ex.: catálogo mostrando "você já tem acesso").
 */
export const OptionalAuth = () => SetMetadata(OPTIONAL_AUTH_KEY, true);
