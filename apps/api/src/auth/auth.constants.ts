/** Nomes dos cookies de sessão. Sempre HttpOnly. */
export const ACCESS_TOKEN_COOKIE = 'romalearn_at';
export const REFRESH_TOKEN_COOKIE = 'romalearn_rt';

/** Caminho restrito do cookie de refresh: só é enviado na rota de renovação. */
export const REFRESH_COOKIE_PATH = '/api/auth';
