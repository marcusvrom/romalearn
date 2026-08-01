import { Injectable, Logger } from '@nestjs/common';

export interface DomainEventMap {
  'course.completed': { userId: string; courseId: string; enrollmentId: string };
  'program.completed': { userId: string; programId: string };
  'access.granted': { userId: string; courseId: string | null; programId: string | null };
}

type Handler<K extends keyof DomainEventMap> = (payload: DomainEventMap[K]) => Promise<void> | void;

/**
 * Barramento de eventos em processo.
 *
 * Mantém as fronteiras dos módulos: "aprendizagem" anuncia que um curso foi
 * concluído sem conhecer "certificados". Se um dia esses módulos virarem
 * serviços separados, basta trocar a implementação por uma fila.
 */
@Injectable()
export class DomainEventsService {
  private readonly logger = new Logger(DomainEventsService.name);
  private readonly handlers = new Map<string, Handler<never>[]>();

  on<K extends keyof DomainEventMap>(event: K, handler: Handler<K>): void {
    const list = this.handlers.get(event) ?? [];
    list.push(handler as Handler<never>);
    this.handlers.set(event, list);
  }

  /**
   * Publica um evento. Falhas de um assinante são registradas e não
   * interrompem o fluxo principal nem os demais assinantes.
   */
  async emit<K extends keyof DomainEventMap>(event: K, payload: DomainEventMap[K]): Promise<void> {
    const list = this.handlers.get(event) ?? [];

    for (const handler of list) {
      try {
        await (handler as Handler<K>)(payload);
      } catch (error) {
        this.logger.error({
          message: 'assinante de evento falhou',
          event,
          detail: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }
}
