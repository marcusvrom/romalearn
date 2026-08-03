import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AdminDashboardDto,
  PlatformSettingsDto,
  PublicationStatus,
  UserRole,
} from '@romalearn/contracts';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { CertificatesService } from '../certificates/certificates.service';
import { CheckoutService } from '../commerce/checkout.service';
import { WebhookService } from '../commerce/webhook.service';
import { SettingsService } from '../platform/settings.service';
import { StorageService } from '../storage/storage.service';
import { UsersService } from '../users/users.service';
import { AdminContentService } from './admin-content.service';
import { AdminOperationsService } from './admin-operations.service';
import {
  GrantAccessDto,
  ReasonDto,
  ReorderDto,
  RevokeAccessDto,
  UpdateSettingsDto,
  UpdateUserRolesDto,
  UpsertCouponDto,
  UpsertCourseDto,
  UpsertLessonDto,
  UpsertMaterialDto,
  UpsertOfferDto,
  UpsertProductDto,
  UpsertQuizDto,
  UpsertSectionDto,
} from './dto/admin.dto';

/**
 * Painel administrativo.
 *
 * Toda a área exige papel administrativo — a proteção está aqui no backend,
 * não em botões escondidos no front-end. `CONTENT_MANAGER` pode editar
 * conteúdo; operações financeiras e de conta pedem `ADMIN` ou `SUPPORT`.
 */
@ApiTags('Administração')
@Controller('admin')
@Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER, UserRole.SUPPORT)
export class AdminController {
  constructor(
    private readonly contentService: AdminContentService,
    private readonly operationsService: AdminOperationsService,
    private readonly certificatesService: CertificatesService,
    private readonly checkoutService: CheckoutService,
    private readonly webhookService: WebhookService,
    private readonly settingsService: SettingsService,
    private readonly storageService: StorageService,
    private readonly usersService: UsersService,
  ) {}

  // ------------------------------------------------------------------
  // Painel
  // ------------------------------------------------------------------

  @Get('dashboard')
  @ApiOperation({ summary: 'Números gerais da plataforma.' })
  dashboard(): Promise<AdminDashboardDto> {
    return this.operationsService.dashboard();
  }

  // ------------------------------------------------------------------
  // Conteúdo
  // ------------------------------------------------------------------

  @Get('courses')
  listCourses() {
    return this.contentService.listCourses();
  }

  @Get('courses/:id')
  findCourse(@Param('id') id: string) {
    return this.contentService.findCourse(id);
  }

  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @Post('courses')
  createCourse(@Body() dto: UpsertCourseDto, @CurrentUser() actor: { id: string; email: string }) {
    return this.contentService.createCourse(dto, actor);
  }

  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @Put('courses/:id')
  updateCourse(
    @Param('id') id: string,
    @Body() dto: UpsertCourseDto,
    @CurrentUser() actor: { id: string; email: string },
  ) {
    return this.contentService.updateCourse(id, dto, actor);
  }

  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @Post('courses/:id/publish')
  @ApiOperation({ summary: 'Publica o curso (exige ao menos uma aula publicada).' })
  publishCourse(@Param('id') id: string, @CurrentUser() actor: { id: string; email: string }) {
    return this.contentService.setCourseStatus(id, PublicationStatus.PUBLISHED, actor);
  }

  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @Post('courses/:id/unpublish')
  unpublishCourse(@Param('id') id: string, @CurrentUser() actor: { id: string; email: string }) {
    return this.contentService.setCourseStatus(id, PublicationStatus.DRAFT, actor);
  }

  @Get('courses/:id/sections')
  listSections(@Param('id') courseId: string) {
    return this.contentService.listSections(courseId);
  }

  @Get('courses/:id/lessons')
  listLessons(@Param('id') courseId: string) {
    return this.contentService.listLessons(courseId);
  }

  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @Post('sections')
  createSection(
    @Body() dto: UpsertSectionDto,
    @CurrentUser() actor: { id: string; email: string },
  ) {
    return this.contentService.createSection(dto, actor);
  }

  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @Put('sections/:id')
  updateSection(
    @Param('id') id: string,
    @Body() dto: UpsertSectionDto,
    @CurrentUser() actor: { id: string; email: string },
  ) {
    return this.contentService.updateSection(id, dto, actor);
  }

  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @Delete('sections/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSection(@Param('id') id: string, @CurrentUser() actor: { id: string; email: string }) {
    return this.contentService.deleteSection(id, actor);
  }

  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @Post('lessons')
  createLesson(@Body() dto: UpsertLessonDto, @CurrentUser() actor: { id: string; email: string }) {
    return this.contentService.createLesson(dto, actor);
  }

  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @Put('lessons/:id')
  updateLesson(
    @Param('id') id: string,
    @Body() dto: UpsertLessonDto,
    @CurrentUser() actor: { id: string; email: string },
  ) {
    return this.contentService.updateLesson(id, dto, actor);
  }

  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @Delete('lessons/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteLesson(@Param('id') id: string, @CurrentUser() actor: { id: string; email: string }) {
    return this.contentService.deleteLesson(id, actor);
  }

  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @Post('sections/reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reordena as partes de um curso.' })
  reorderSections(@Body() dto: ReorderDto, @CurrentUser() actor: { id: string; email: string }) {
    return this.contentService.reorder('sections', dto, actor);
  }

  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @Post('lessons/reorder')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Reordena as aulas de uma parte.' })
  reorderLessons(@Body() dto: ReorderDto, @CurrentUser() actor: { id: string; email: string }) {
    return this.contentService.reorder('lessons', dto, actor);
  }

  @Get('lessons/:id/materials')
  listMaterials(@Param('id') lessonId: string) {
    return this.contentService.listMaterials(lessonId);
  }

  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @Post('materials')
  createMaterial(
    @Body() dto: UpsertMaterialDto,
    @CurrentUser() actor: { id: string; email: string },
  ) {
    return this.contentService.createMaterial(dto, actor);
  }

  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @Delete('materials/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteMaterial(@Param('id') id: string, @CurrentUser() actor: { id: string; email: string }) {
    return this.contentService.deleteMaterial(id, actor);
  }

  @Get('lessons/:id/quiz')
  getQuiz(@Param('id') lessonId: string) {
    return this.contentService.getQuiz(lessonId);
  }

  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @Put('quizzes')
  @ApiOperation({ summary: 'Cria ou substitui o questionário de uma aula.' })
  upsertQuiz(@Body() dto: UpsertQuizDto, @CurrentUser() actor: { id: string; email: string }) {
    return this.contentService.upsertQuiz(dto, actor);
  }

  /** Upload validado por tipo e tamanho antes de tocar o storage. */
  @Roles(UserRole.ADMIN, UserRole.CONTENT_MANAGER)
  @Post('uploads')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Envia um material ou imagem para o armazenamento.' })
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Query('category') category: 'material' | 'image' = 'material',
    @Query('public') isPublic?: string,
  ) {
    const stored = await this.storageService.upload({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
      folder: category === 'image' ? 'images' : 'materials',
      category,
      isPublic: isPublic === 'true',
    });

    const link = await this.storageService.urlFor(stored.key);
    return { ...stored, url: link.url };
  }

  // ------------------------------------------------------------------
  // Comércio
  // ------------------------------------------------------------------

  @Get('products')
  listProducts() {
    return this.operationsService.listProducts();
  }

  @Roles(UserRole.ADMIN)
  @Post('products')
  createProduct(
    @Body() dto: UpsertProductDto,
    @CurrentUser() actor: { id: string; email: string },
  ) {
    return this.operationsService.createProduct(dto, actor);
  }

  @Roles(UserRole.ADMIN)
  @Put('products/:id')
  updateProduct(
    @Param('id') id: string,
    @Body() dto: UpsertProductDto,
    @CurrentUser() actor: { id: string; email: string },
  ) {
    return this.operationsService.updateProduct(id, dto, actor);
  }

  @Get('offers')
  listOffers() {
    return this.operationsService.listOffers();
  }

  @Roles(UserRole.ADMIN)
  @Post('offers')
  createOffer(@Body() dto: UpsertOfferDto, @CurrentUser() actor: { id: string; email: string }) {
    return this.operationsService.createOffer(dto, actor);
  }

  @Roles(UserRole.ADMIN)
  @Put('offers/:id')
  updateOffer(
    @Param('id') id: string,
    @Body() dto: UpsertOfferDto,
    @CurrentUser() actor: { id: string; email: string },
  ) {
    return this.operationsService.updateOffer(id, dto, actor);
  }

  @Get('coupons')
  listCoupons() {
    return this.operationsService.listCoupons();
  }

  @Roles(UserRole.ADMIN)
  @Post('coupons')
  createCoupon(@Body() dto: UpsertCouponDto, @CurrentUser() actor: { id: string; email: string }) {
    return this.operationsService.createCoupon(dto, actor);
  }

  @Roles(UserRole.ADMIN)
  @Patch('coupons/:id/active')
  setCouponActive(
    @Param('id') id: string,
    @Body() body: { active: boolean },
    @CurrentUser() actor: { id: string; email: string },
  ) {
    return this.operationsService.setCouponActive(id, body.active, actor);
  }

  @Get('orders')
  listOrders(@Query('page') page = '1', @Query('pageSize') pageSize = '25') {
    return this.operationsService.listOrders(Number(page) || 1, Number(pageSize) || 25);
  }

  @Roles(UserRole.ADMIN)
  @Post('orders/:id/refund')
  @ApiOperation({ summary: 'Reembolsa o pedido e revoga o acesso concedido.' })
  refundOrder(
    @Param('id') id: string,
    @Body() dto: ReasonDto,
    @CurrentUser() actor: { id: string; email: string },
  ) {
    return this.checkoutService.refundOrder(id, actor.id, dto.reason);
  }

  @Get('webhooks')
  listWebhooks() {
    return this.webhookService.list();
  }

  @Roles(UserRole.ADMIN)
  @Post('webhooks/:id/replay')
  @ApiOperation({ summary: 'Reprocessa com segurança um webhook que falhou.' })
  replayWebhook(@Param('id') id: string) {
    return this.webhookService.replay(id);
  }

  // ------------------------------------------------------------------
  // Pessoas e acessos
  // ------------------------------------------------------------------

  @Get('users')
  async listUsers(
    @Query('search') search?: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '25',
  ) {
    const result = await this.operationsService.listUsers(
      search,
      Number(page) || 1,
      Number(pageSize) || 25,
    );
    return { ...result, items: result.items.map((user) => UsersService.toDto(user)) };
  }

  @Roles(UserRole.ADMIN)
  @Patch('users/:id/roles')
  async updateUserRoles(
    @Param('id') id: string,
    @Body() dto: UpdateUserRolesDto,
    @CurrentUser() actor: { id: string; email: string },
  ) {
    const user = await this.operationsService.updateUserRoles(id, dto, actor);
    return UsersService.toDto(user);
  }

  @Roles(UserRole.ADMIN)
  @Post('users/:id/anonymize')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Anonimiza a conta a pedido do titular (LGPD).' })
  anonymizeUser(
    @Param('id') id: string,
    @Body() dto: ReasonDto,
    @CurrentUser() actor: { id: string; email: string },
  ) {
    return this.operationsService.anonymizeUser(id, actor, dto.reason);
  }

  @Get('enrollments')
  listEnrollments(@Query('userId') userId?: string) {
    return this.operationsService.listEnrollments(userId);
  }

  @Get('users/:id/entitlements')
  listEntitlements(@Param('id') userId: string) {
    return this.operationsService.listEntitlements(userId);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Post('entitlements/grant')
  @ApiOperation({ summary: 'Libera acesso manualmente, com motivo auditado.' })
  grantAccess(@Body() dto: GrantAccessDto, @CurrentUser() actor: { id: string; email: string }) {
    return this.operationsService.grantAccess(dto, actor);
  }

  @Roles(UserRole.ADMIN, UserRole.SUPPORT)
  @Post('entitlements/:id/revoke')
  @HttpCode(HttpStatus.NO_CONTENT)
  revokeAccess(
    @Param('id') id: string,
    @Body() dto: RevokeAccessDto,
    @CurrentUser() actor: { id: string; email: string },
  ) {
    return this.operationsService.revokeAccess(id, dto, actor);
  }

  // ------------------------------------------------------------------
  // Certificados
  // ------------------------------------------------------------------

  @Get('certificates')
  async listCertificates() {
    const certificates = await this.certificatesService.listAll();
    return certificates.map((certificate) => this.certificatesService.toDto(certificate));
  }

  @Get('certificates/:id/events')
  listCertificateEvents(@Param('id') id: string) {
    return this.certificatesService.listEvents(id);
  }

  @Roles(UserRole.ADMIN)
  @Post('certificates/:id/reissue')
  async reissueCertificate(
    @Param('id') id: string,
    @Body() dto: ReasonDto,
    @CurrentUser() actor: { id: string; email: string },
  ) {
    const certificate = await this.certificatesService.reissue(id, actor.id, dto.reason);
    return this.certificatesService.toDto(certificate);
  }

  @Roles(UserRole.ADMIN)
  @Post('certificates/:id/revoke')
  async revokeCertificate(
    @Param('id') id: string,
    @Body() dto: ReasonDto,
    @CurrentUser() actor: { id: string; email: string },
  ) {
    const certificate = await this.certificatesService.revoke(id, actor.id, dto.reason);
    return this.certificatesService.toDto(certificate);
  }

  // ------------------------------------------------------------------
  // Configurações e auditoria
  // ------------------------------------------------------------------

  @Get('settings')
  settings(): Promise<PlatformSettingsDto> {
    return this.settingsService.getAll();
  }

  @Roles(UserRole.ADMIN)
  @Patch('settings')
  updateSettings(@Body() dto: UpdateSettingsDto): Promise<PlatformSettingsDto> {
    return this.settingsService.update(dto);
  }

  @Get('audit-logs')
  listAuditLogs(@Query('page') page = '1', @Query('pageSize') pageSize = '50') {
    return this.operationsService.listAuditLogs(Number(page) || 1, Number(pageSize) || 50);
  }
}
