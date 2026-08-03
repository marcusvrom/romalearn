import { Injectable, inject } from '@angular/core';
import {
  AdminDashboardDto,
  AuditLogDto,
  CertificateDto,
  CouponDto,
  CourseDetailDto,
  OfferDto,
  OrderDto,
  PaginatedResult,
  PlatformSettingsDto,
  ProductDto,
  UserDto,
  WebhookEventDto,
} from '@romalearn/contracts';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';

/** Entidades administrativas com campos que o aluno nunca vê. */
export interface AdminCourse extends Omit<CourseDetailDto, 'sections' | 'access'> {
  completionCriteria: {
    minimumLessonCompletionPercent: number;
    requireAllQuizzesPassed: boolean;
    requireAllActivitiesSubmitted: boolean;
  };
}

export interface AdminSection {
  id: string;
  courseId: string;
  title: string;
  summary: string | null;
  order: number;
}

export interface AdminLesson {
  id: string;
  courseId: string;
  sectionId: string;
  slug: string;
  title: string;
  type: string;
  order: number;
  estimatedMinutes: number;
  completionRule: string;
  completionThreshold: number | null;
  contentMarkdown: string | null;
  videoUrl: string | null;
  activityInstructions: string | null;
  isPreview: boolean;
  status: string;
}

export interface AdminEnrollment {
  id: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  user: UserDto;
  course: { id: string; title: string; slug: string };
}

/** Chamadas do painel administrativo. A autorização é feita no backend. */
@Injectable({ providedIn: 'root' })
export class AdminService {
  private readonly api = inject(ApiService);

  dashboard(): Observable<AdminDashboardDto> {
    return this.api.get<AdminDashboardDto>('/admin/dashboard');
  }

  // ----- Conteúdo -----------------------------------------------------

  listCourses(): Observable<AdminCourse[]> {
    return this.api.get<AdminCourse[]>('/admin/courses');
  }

  findCourse(id: string): Observable<AdminCourse> {
    return this.api.get<AdminCourse>(`/admin/courses/${id}`);
  }

  createCourse(payload: Record<string, unknown>): Observable<AdminCourse> {
    return this.api.post<AdminCourse>('/admin/courses', payload);
  }

  updateCourse(id: string, payload: Record<string, unknown>): Observable<AdminCourse> {
    return this.api.put<AdminCourse>(`/admin/courses/${id}`, payload);
  }

  publishCourse(id: string): Observable<AdminCourse> {
    return this.api.post<AdminCourse>(`/admin/courses/${id}/publish`);
  }

  unpublishCourse(id: string): Observable<AdminCourse> {
    return this.api.post<AdminCourse>(`/admin/courses/${id}/unpublish`);
  }

  listSections(courseId: string): Observable<AdminSection[]> {
    return this.api.get<AdminSection[]>(`/admin/courses/${courseId}/sections`);
  }

  listLessons(courseId: string): Observable<AdminLesson[]> {
    return this.api.get<AdminLesson[]>(`/admin/courses/${courseId}/lessons`);
  }

  createSection(payload: Record<string, unknown>): Observable<AdminSection> {
    return this.api.post<AdminSection>('/admin/sections', payload);
  }

  updateSection(id: string, payload: Record<string, unknown>): Observable<AdminSection> {
    return this.api.put<AdminSection>(`/admin/sections/${id}`, payload);
  }

  deleteSection(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/sections/${id}`);
  }

  createLesson(payload: Record<string, unknown>): Observable<AdminLesson> {
    return this.api.post<AdminLesson>('/admin/lessons', payload);
  }

  updateLesson(id: string, payload: Record<string, unknown>): Observable<AdminLesson> {
    return this.api.put<AdminLesson>(`/admin/lessons/${id}`, payload);
  }

  deleteLesson(id: string): Observable<void> {
    return this.api.delete<void>(`/admin/lessons/${id}`);
  }

  reorder(kind: 'sections' | 'lessons', items: { id: string; order: number }[]): Observable<void> {
    return this.api.post<void>(`/admin/${kind}/reorder`, { items });
  }

  getQuiz(lessonId: string): Observable<unknown> {
    return this.api.get(`/admin/lessons/${lessonId}/quiz`);
  }

  upsertQuiz(payload: Record<string, unknown>): Observable<unknown> {
    return this.api.put('/admin/quizzes', payload);
  }

  // ----- Comércio -----------------------------------------------------

  listProducts(): Observable<ProductDto[]> {
    return this.api.get<ProductDto[]>('/admin/products');
  }

  listOffers(): Observable<OfferDto[]> {
    return this.api.get<OfferDto[]>('/admin/offers');
  }

  listCoupons(): Observable<CouponDto[]> {
    return this.api.get<CouponDto[]>('/admin/coupons');
  }

  createCoupon(payload: Record<string, unknown>): Observable<CouponDto> {
    return this.api.post<CouponDto>('/admin/coupons', payload);
  }

  setCouponActive(id: string, active: boolean): Observable<CouponDto> {
    return this.api.patch<CouponDto>(`/admin/coupons/${id}/active`, { active });
  }

  listOrders(page = 1): Observable<PaginatedResult<OrderDto>> {
    return this.api.get<PaginatedResult<OrderDto>>('/admin/orders', { page });
  }

  refundOrder(id: string, reason: string): Observable<void> {
    return this.api.post<void>(`/admin/orders/${id}/refund`, { reason });
  }

  listWebhooks(): Observable<WebhookEventDto[]> {
    return this.api.get<WebhookEventDto[]>('/admin/webhooks');
  }

  replayWebhook(id: string): Observable<{ status: string }> {
    return this.api.post<{ status: string }>(`/admin/webhooks/${id}/replay`);
  }

  // ----- Pessoas -------------------------------------------------------

  listUsers(search?: string, page = 1): Observable<PaginatedResult<UserDto>> {
    return this.api.get<PaginatedResult<UserDto>>('/admin/users', {
      page,
      ...(search ? { search } : {}),
    });
  }

  updateUserRoles(id: string, roles: string[]): Observable<UserDto> {
    return this.api.patch<UserDto>(`/admin/users/${id}/roles`, { roles });
  }

  listEnrollments(userId?: string): Observable<AdminEnrollment[]> {
    return this.api.get<AdminEnrollment[]>('/admin/enrollments', userId ? { userId } : undefined);
  }

  listEntitlements(userId: string): Observable<unknown[]> {
    return this.api.get<unknown[]>(`/admin/users/${userId}/entitlements`);
  }

  grantAccess(payload: Record<string, unknown>): Observable<unknown> {
    return this.api.post('/admin/entitlements/grant', payload);
  }

  revokeAccess(id: string, reason: string): Observable<void> {
    return this.api.post<void>(`/admin/entitlements/${id}/revoke`, { reason });
  }

  // ----- Certificados e plataforma --------------------------------------

  listCertificates(): Observable<CertificateDto[]> {
    return this.api.get<CertificateDto[]>('/admin/certificates');
  }

  revokeCertificate(id: string, reason: string): Observable<CertificateDto> {
    return this.api.post<CertificateDto>(`/admin/certificates/${id}/revoke`, { reason });
  }

  reissueCertificate(id: string, reason: string): Observable<CertificateDto> {
    return this.api.post<CertificateDto>(`/admin/certificates/${id}/reissue`, { reason });
  }

  settings(): Observable<PlatformSettingsDto> {
    return this.api.get<PlatformSettingsDto>('/admin/settings');
  }

  updateSettings(payload: Partial<PlatformSettingsDto>): Observable<PlatformSettingsDto> {
    return this.api.patch<PlatformSettingsDto>('/admin/settings', payload);
  }

  auditLogs(page = 1): Observable<PaginatedResult<AuditLogDto>> {
    return this.api.get<PaginatedResult<AuditLogDto>>('/admin/audit-logs', { page });
  }
}
