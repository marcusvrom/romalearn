import { Injectable, inject } from '@angular/core';
import {
  API_ROUTES,
  CourseDetailDto,
  CourseSummaryDto,
  ProductDto,
  ProgramSummaryDto,
} from '@romalearn/contracts';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

/** Leitura do catálogo público (não exige autenticação). */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly api = inject(ApiService);

  listCourses(): Observable<CourseSummaryDto[]> {
    return this.api.get<CourseSummaryDto[]>(API_ROUTES.catalog.courses);
  }

  findCourse(slug: string): Observable<CourseDetailDto> {
    return this.api.get<CourseDetailDto>(API_ROUTES.catalog.course(slug));
  }

  listPrograms(): Observable<ProgramSummaryDto[]> {
    return this.api.get<ProgramSummaryDto[]>(API_ROUTES.catalog.programs);
  }

  findProgram(slug: string): Observable<ProgramSummaryDto> {
    return this.api.get<ProgramSummaryDto>(API_ROUTES.catalog.program(slug));
  }

  listProducts(): Observable<ProductDto[]> {
    return this.api.get<ProductDto[]>('/commerce/products');
  }
}
