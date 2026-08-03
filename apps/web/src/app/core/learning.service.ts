import { Injectable, inject } from '@angular/core';
import {
  API_ROUTES,
  ActivitySubmissionDto,
  CertificateDto,
  CheckoutResultDto,
  CoursePlayerDto,
  CourseProgressDto,
  EnrolledCourseDto,
  LessonContentDto,
  LessonProgressDto,
  OrderDto,
  PaymentMethod,
  QuizAttemptResultDto,
} from '@romalearn/contracts';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

/** Área autenticada: estudo, progresso, compras e certificados. */
@Injectable({ providedIn: 'root' })
export class LearningService {
  private readonly api = inject(ApiService);

  // ----- Estudo ------------------------------------------------------

  myCourses(): Observable<EnrolledCourseDto[]> {
    return this.api.get<EnrolledCourseDto[]>(API_ROUTES.learning.myCourses);
  }

  player(courseSlug: string): Observable<CoursePlayerDto> {
    return this.api.get<CoursePlayerDto>(API_ROUTES.learning.player(courseSlug));
  }

  lesson(courseSlug: string, lessonSlug: string): Observable<LessonContentDto> {
    return this.api.get<LessonContentDto>(API_ROUTES.learning.lesson(courseSlug, lessonSlug));
  }

  /** Salvamento automático: informa o tempo desde a última chamada. */
  saveProgress(
    lessonId: string,
    payload: { elapsedSeconds: number; positionSeconds?: number; watchRatio?: number },
  ): Observable<LessonProgressDto> {
    return this.api.post<LessonProgressDto>(API_ROUTES.learning.heartbeat(lessonId), payload);
  }

  completeLesson(
    lessonId: string,
    confirmed = true,
  ): Observable<{ progress: LessonProgressDto; course: CourseProgressDto }> {
    return this.api.post(API_ROUTES.learning.complete(lessonId), { confirmed });
  }

  submitActivity(
    lessonId: string,
    notes: string,
    arquivo?: File | null,
  ): Observable<ActivitySubmissionDto> {
    const rota = API_ROUTES.learning.submitActivity(lessonId);

    if (!arquivo) {
      return this.api.post<ActivitySubmissionDto>(rota, { notes });
    }

    const dados = new FormData();
    dados.append('notes', notes);
    dados.append('arquivo', arquivo, arquivo.name);
    return this.api.post<ActivitySubmissionDto>(rota, dados);
  }

  submitQuiz(
    quizId: string,
    answers: { questionId: string; selectedOptionIds: string[] }[],
  ): Observable<QuizAttemptResultDto> {
    return this.api.post<QuizAttemptResultDto>(API_ROUTES.learning.submitQuiz(quizId), { answers });
  }

  // ----- Comércio ----------------------------------------------------

  enrollFree(courseSlug: string): Observable<{ enrollmentId: string; courseSlug: string }> {
    return this.api.post(API_ROUTES.commerce.enrollFree, { courseSlug });
  }

  checkout(
    offerId: string,
    method: PaymentMethod,
    couponCode?: string,
  ): Observable<CheckoutResultDto> {
    return this.api.post<CheckoutResultDto>(API_ROUTES.commerce.checkout, {
      offerId,
      method,
      ...(couponCode ? { couponCode } : {}),
    });
  }

  validateCoupon(
    code: string,
    offerId: string,
  ): Observable<{
    valid: boolean;
    subtotalCents: number;
    discountCents: number;
    totalCents: number;
    currency: string;
  }> {
    return this.api.post(API_ROUTES.commerce.validateCoupon, { code, offerId });
  }

  orders(): Observable<OrderDto[]> {
    return this.api.get<OrderDto[]>(API_ROUTES.commerce.orders);
  }

  // ----- Certificados -------------------------------------------------

  certificates(): Observable<CertificateDto[]> {
    return this.api.get<CertificateDto[]>(API_ROUTES.certificates.mine);
  }

  certificatePdfUrl(id: string): string {
    return this.api.absolute(API_ROUTES.certificates.pdf(id));
  }
}
