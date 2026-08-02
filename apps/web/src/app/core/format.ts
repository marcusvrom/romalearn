/** Formatações em português do Brasil usadas em toda a interface. */

export function formatCurrency(cents: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(cents / 100);
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'long' }).format(date);
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '—';
  const date = typeof value === 'string' ? new Date(value) : value;
  return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
}

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}min`;
}

/** Rótulos amigáveis. Nenhum termo interno aparece para o aluno. */
export const LESSON_TYPE_LABEL: Record<string, string> = {
  RICH_TEXT: 'Leitura',
  VIDEO: 'Vídeo',
  PDF: 'PDF',
  DOWNLOAD: 'Download',
  PRACTICAL_ACTIVITY: 'Atividade prática',
  QUIZ: 'Questionário',
};

export const LESSON_TYPE_ICON: Record<string, string> = {
  RICH_TEXT: '📖',
  VIDEO: '🎬',
  PDF: '📄',
  DOWNLOAD: '⬇️',
  PRACTICAL_ACTIVITY: '✍️',
  QUIZ: '✅',
};

export const ORDER_STATUS_LABEL: Record<string, string> = {
  PENDING: 'Aguardando pagamento',
  PROCESSING: 'Processando',
  APPROVED: 'Aprovado',
  REJECTED: 'Recusado',
  CANCELLED: 'Cancelado',
  EXPIRED: 'Expirado',
  REFUNDED: 'Reembolsado',
};

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  PIX: 'Pix',
  CREDIT_CARD: 'Cartão de crédito',
  BOLETO: 'Boleto',
  NONE: 'Sem cobrança',
};
