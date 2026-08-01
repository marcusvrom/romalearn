import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CourseDetailDto, CourseSummaryDto, ProgramSummaryDto } from '@romalearn/contracts';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { OptionalAuth, Public } from '../common/decorators/public.decorator';
import { CatalogService } from './catalog.service';

@ApiTags('Catálogo')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Public()
  @Get('courses')
  @ApiOperation({ summary: 'Lista os cursos publicados.' })
  listCourses(): Promise<CourseSummaryDto[]> {
    return this.catalogService.listPublishedCourses();
  }

  /**
   * Autenticação opcional: visitantes veem a página de vendas; alunos com
   * acesso recebem também o campo `access`.
   */
  @OptionalAuth()
  @Get('courses/:slug')
  @ApiOperation({ summary: 'Detalha um curso publicado.' })
  findCourse(
    @Param('slug') slug: string,
    @CurrentUser('id') userId?: string,
  ): Promise<CourseDetailDto> {
    return this.catalogService.findCourseBySlug(slug, userId);
  }

  @Public()
  @Get('programs')
  @ApiOperation({ summary: 'Lista as trilhas publicadas.' })
  listPrograms(): Promise<ProgramSummaryDto[]> {
    return this.catalogService.listPublishedPrograms();
  }

  @Public()
  @Get('programs/:slug')
  @ApiOperation({ summary: 'Detalha uma trilha publicada.' })
  findProgram(@Param('slug') slug: string): Promise<ProgramSummaryDto> {
    return this.catalogService.findProgramBySlug(slug);
  }
}
