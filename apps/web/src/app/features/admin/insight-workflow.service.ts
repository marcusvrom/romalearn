import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type InsightWorkflowStatus = 'NEW' | 'IN_REVIEW' | 'RESOLVED' | 'IGNORED';
export type InsightFeedback = 'USEFUL' | 'NOT_USEFUL';

export interface InsightWorkflowState {
  status: InsightWorkflowStatus;
  feedback: InsightFeedback | null;
  note: string | null;
  updatedAt: string;
}

@Injectable({ providedIn: 'root' })
export class InsightWorkflowService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'romalearn.admin.insight-workflow.v1';
  private readonly statesSignal = signal<Record<string, InsightWorkflowState>>({});

  readonly states = this.statesSignal.asReadonly();

  constructor() {
    this.restore();
  }

  get(insightId: string): InsightWorkflowState {
    return (
      this.statesSignal()[insightId] ?? {
        status: 'NEW',
        feedback: null,
        note: null,
        updatedAt: new Date(0).toISOString(),
      }
    );
  }

  setStatus(insightId: string, status: InsightWorkflowStatus): void {
    this.patch(insightId, { status });
  }

  setFeedback(insightId: string, feedback: InsightFeedback | null): void {
    this.patch(insightId, { feedback });
  }

  setNote(insightId: string, note: string | null): void {
    this.patch(insightId, { note: note?.trim() || null });
  }

  private patch(insightId: string, partial: Partial<InsightWorkflowState>): void {
    const current = this.get(insightId);
    const next = {
      ...this.statesSignal(),
      [insightId]: {
        ...current,
        ...partial,
        updatedAt: new Date().toISOString(),
      },
    };

    this.statesSignal.set(next);
    this.persist(next);
  }

  private restore(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return;
      this.statesSignal.set(JSON.parse(raw) as Record<string, InsightWorkflowState>);
    } catch {
      this.statesSignal.set({});
    }
  }

  private persist(states: Record<string, InsightWorkflowState>): void {
    if (!isPlatformBrowser(this.platformId)) return;

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(states));
    } catch {
      // O workflow continua funcional na sessão mesmo se o armazenamento local falhar.
    }
  }
}
