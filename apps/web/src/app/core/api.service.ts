import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import type { ApiErrorResponse } from '@romalearn/contracts';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PLATFORM_CONFIG } from './platform.config';

/** Erro já traduzido para exibição direta na interface. */
export interface FriendlyError {
  code: string;
  message: string;
  status: number;
}

/**
 * Distingue um erro vindo da API de qualquer outra coisa.
 *
 * Um `SyntaxError` de JSON também tem `message`, mas é texto técnico: nunca
 * deve chegar ao usuário. Só o corpo padronizado da API é exibível.
 */
function isApiError(body: unknown): body is ApiErrorResponse {
  return (
    typeof body === 'object' &&
    body !== null &&
    !(body instanceof Error) &&
    typeof (body as ApiErrorResponse).message === 'string' &&
    typeof (body as ApiErrorResponse).statusCode === 'number'
  );
}

export function toFriendlyError(error: unknown): FriendlyError {
  if (error instanceof HttpErrorResponse) {
    const body: unknown = error.error;

    if (isApiError(body)) {
      return { code: body.error ?? 'ERRO', message: body.message, status: error.status };
    }

    // Resposta que não é JSON da API: em desenvolvimento, quase sempre o HTML
    // do próprio front — sinal de que /api não está chegando na API.
    if (body instanceof SyntaxError) {
      return {
        code: 'RESPOSTA_INVALIDA',
        message:
          'O servidor respondeu em um formato inesperado. Se você está rodando o projeto localmente, confira se a API está no ar em http://localhost:3333/api.',
        status: error.status,
      };
    }

    if (error.status === 0) {
      return {
        code: 'OFFLINE',
        message: 'Não conseguimos falar com o servidor. Verifique sua conexão e tente de novo.',
        status: 0,
      };
    }
  }

  return {
    code: 'ERRO_INESPERADO',
    message: 'Algo deu errado. Tente novamente em alguns instantes.',
    status: 500,
  };
}

/**
 * Cliente HTTP da plataforma.
 *
 * Envia cookies em todas as chamadas (`withCredentials`) e converte erros da
 * API em mensagens prontas em português.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(PLATFORM_CONFIG);

  get<T>(path: string, params?: Record<string, string | number | boolean>): Observable<T> {
    return this.http
      .get<T>(this.url(path), { withCredentials: true, params: this.toParams(params) })
      .pipe(catchError((error) => throwError(() => toFriendlyError(error))));
  }

  /**
   * `FormData` é enviado como está: o navegador precisa definir o
   * `Content-Type` com o boundary do multipart, então não fixamos cabeçalho.
   */
  post<T>(path: string, body?: unknown): Observable<T> {
    return this.http
      .post<T>(this.url(path), body ?? {}, { withCredentials: true })
      .pipe(catchError((error) => throwError(() => toFriendlyError(error))));
  }

  patch<T>(path: string, body?: unknown): Observable<T> {
    return this.http
      .patch<T>(this.url(path), body ?? {}, { withCredentials: true })
      .pipe(catchError((error) => throwError(() => toFriendlyError(error))));
  }

  put<T>(path: string, body?: unknown): Observable<T> {
    return this.http
      .put<T>(this.url(path), body ?? {}, { withCredentials: true })
      .pipe(catchError((error) => throwError(() => toFriendlyError(error))));
  }

  delete<T>(path: string): Observable<T> {
    return this.http
      .delete<T>(this.url(path), { withCredentials: true })
      .pipe(catchError((error) => throwError(() => toFriendlyError(error))));
  }

  /** URL absoluta de um recurso da API (ex.: PDF do certificado). */
  absolute(path: string): string {
    return this.url(path);
  }

  private url(path: string): string {
    const base = this.config.apiBaseUrl.replace(/\/$/, '');
    return `${base}${path.startsWith('/') ? path : `/${path}`}`;
  }

  private toParams(params?: Record<string, string | number | boolean>): HttpParams | undefined {
    if (!params) return undefined;

    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    }
    return httpParams;
  }
}
