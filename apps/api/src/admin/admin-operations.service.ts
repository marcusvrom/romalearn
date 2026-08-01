import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  AdminDashboardDto,
  AuditAction,
  CertificateStatus,
  AuditLogDto,
  EnrollmentStatus,
  EntitlementSource,
  OfferStatus,
  OrderStatus,
  PaginatedResult,
  PublicationStatus,
  UserRole,
  WebhookEventStatus,
} from '@romalearn/contracts';
import { Repository } from 'typeorm';
import { Course } from '../catalog/entities/course.entity';
import { Certificate } from '../certificates/entities/certificate.entity';
import { Coupon } from '../commerce/entities/coupon.entity';
import { Offer } from '../commerce/entities/offer.entity';
import { Order } from '../commerce/entities/order.entity';
import { Product } from '../commerce/entities/product.entity';
import { WebhookEvent } from '../commerce/entities/webhook-event.entity';
import { DomainErrors } from '../common/errors/domain-error';
import { slugify } from '../common/utils/slug';
import { Enrollment } from '../learning/entities/enrollment.entity';
import { Entitlement } from '../learning/entities/entitlement.entity';
import { EnrollmentService } from '../learning/enrollment.service';
import { EntitlementService } from '../learning/entitlement.service';
import { AuditService } from '../platform/audit.service';
import { AuditLog } from '../platform/entities/audit-log.entity';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { Actor } from './admin-content.service';
import {
  GrantAccessDto,
  RevokeAccessDto,
  UpdateUserRolesDto,
  UpsertCouponDto,
  UpsertOfferDto,
  UpsertProductDto,
} from './dto/admin.dto';

@Injectable()
export class AdminOperationsService {
  constructor(
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(Offer) private readonly offers: Repository<Offer>,
    @InjectRepository(Coupon) private readonly coupons: Repository<Coupon>,
    @InjectRepository(Order) private readonly orders: Repository<Order>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Course) private readonly courses: Repository<Course>,
    @InjectRepository(Enrollment) private readonly enrollments: Repository<Enrollment>,
    @InjectRepository(Entitlement) private readonly entitlements: Repository<Entitlement>,
    @InjectRepository(Certificate) private readonly certificates: Repository<Certificate>,
    @InjectRepository(WebhookEvent) private readonly webhookEvents: Repository<WebhookEvent>,
    @InjectRepository(AuditLog) private readonly auditLogs: Repository<AuditLog>,
    private readonly entitlementService: EntitlementService,
    private readonly enrollmentService: EnrollmentService,
    private readonly usersService: UsersService,
    private readonly auditService: AuditService,
  ) {}

  // ------------------------------------------------------------------
  // Painel
  // ------------------------------------------------------------------

  async dashboard(): Promise<AdminDashboardDto> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 86_400_000);

    const [totalUsers, recentUsers] = await Promise.all([
      this.users.count(),
      this.users
        .createQueryBuilder('u')
        .where('u."createdAt" >= :since', { since: thirtyDaysAgo })
        .getCount(),
    ]);

    const [totalEnrollments, activeEnrollments, completedEnrollments] = await Promise.all([
      this.enrollments.count(),
      this.enrollments.count({ where: { status: EnrollmentStatus.ACTIVE } }),
      this.enrollments.count({ where: { status: EnrollmentStatus.COMPLETED } }),
    ]);

    const [totalCourses, publishedCourses, draftCourses] = await Promise.all([
      this.courses.count(),
      this.courses.count({ where: { status: PublicationStatus.PUBLISHED } }),
      this.courses.count({ where: { status: PublicationStatus.DRAFT } }),
    ]);

    const [totalOrders, approvedOrders, pendingOrders] = await Promise.all([
      this.orders.count(),
      this.orders.count({ where: { status: OrderStatus.APPROVED } }),
      this.orders.count({ where: { status: OrderStatus.PENDING } }),
    ]);

    // Alias curto: `order` também é palavra reservada no PostgreSQL.
    const revenue = await this.orders
      .createQueryBuilder('o')
      .select('COALESCE(SUM(o."totalCents"), 0)', 'total')
      .where('o.status = :status', { status: OrderStatus.APPROVED })
      .getRawOne<{ total: string }>();

    const [issuedCertificates, revokedCertificates] = await Promise.all([
      this.certificates.count(),
      this.certificates.count({ where: { status: CertificateStatus.REVOKED } }),
    ]);

    const [failedWebhooks, pendingWebhooks] = await Promise.all([
      this.webhookEvents.count({ where: { status: WebhookEventStatus.FAILED } }),
      this.webhookEvents.count({ where: { status: WebhookEventStatus.RECEIVED } }),
    ]);

    return {
      users: { total: totalUsers, last30Days: recentUsers },
      enrollments: {
        total: totalEnrollments,
        active: activeEnrollments,
        completed: completedEnrollments,
      },
      courses: { total: totalCourses, published: publishedCourses, draft: draftCourses },
      orders: {
        total: totalOrders,
        approved: approvedOrders,
        pending: pendingOrders,
        revenueCents: Number(revenue?.total ?? 0),
      },
      certificates: { issued: issuedCertificates, revoked: revokedCertificates },
      webhooks: { failed: failedWebhooks, pending: pendingWebhooks },
    };
  }

  // ------------------------------------------------------------------
  // Produtos, ofertas e cupons
  // ------------------------------------------------------------------

  listProducts(): Promise<Product[]> {
    return this.products.find({ relations: { offers: true }, order: { name: 'ASC' } });
  }

  async createProduct(dto: UpsertProductDto, actor: Actor): Promise<Product> {
    const product = await this.products.save(
      this.products.create({
        slug: slugify(dto.slug ?? dto.name),
        name: dto.name,
        description: dto.description ?? '',
        type: dto.type,
        courseId: dto.courseId ?? null,
        programId: dto.programId ?? null,
        status: dto.status ?? PublicationStatus.DRAFT,
      }),
    );

    await this.audit(
      actor,
      AuditAction.CREATE,
      'Product',
      product.id,
      `Produto "${product.name}" criado.`,
    );
    return product;
  }

  async updateProduct(id: string, dto: UpsertProductDto, actor: Actor): Promise<Product> {
    const product = await this.products.findOne({ where: { id } });
    if (!product) throw DomainErrors.notFound('Produto não encontrado.');

    Object.assign(product, {
      name: dto.name ?? product.name,
      description: dto.description ?? product.description,
      type: dto.type ?? product.type,
      courseId: dto.courseId ?? product.courseId,
      programId: dto.programId ?? product.programId,
      status: dto.status ?? product.status,
    });

    const saved = await this.products.save(product);
    await this.audit(
      actor,
      AuditAction.UPDATE,
      'Product',
      id,
      `Produto "${saved.name}" atualizado.`,
    );
    return saved;
  }

  listOffers(): Promise<Offer[]> {
    return this.offers.find({ relations: { product: true }, order: { createdAt: 'DESC' } });
  }

  async createOffer(dto: UpsertOfferDto, actor: Actor): Promise<Offer> {
    const offer = await this.offers.save(
      this.offers.create({
        slug: slugify(dto.slug ?? `${dto.name}-${Date.now()}`),
        productId: dto.productId,
        name: dto.name,
        kind: dto.kind,
        status: dto.status ?? OfferStatus.DRAFT,
        environment: dto.environment,
        priceCents: dto.priceCents,
        compareAtPriceCents: dto.compareAtPriceCents ?? null,
        installmentsAllowed: dto.installmentsAllowed ?? 1,
        accessDurationDays: dto.accessDurationDays ?? null,
      }),
    );

    await this.audit(
      actor,
      AuditAction.CREATE,
      'Offer',
      offer.id,
      `Oferta "${offer.name}" criada (${offer.environment}).`,
      { priceCents: offer.priceCents, environment: offer.environment },
    );
    return offer;
  }

  async updateOffer(id: string, dto: UpsertOfferDto, actor: Actor): Promise<Offer> {
    const offer = await this.offers.findOne({ where: { id } });
    if (!offer) throw DomainErrors.notFound('Oferta não encontrada.');

    Object.assign(offer, {
      name: dto.name ?? offer.name,
      kind: dto.kind ?? offer.kind,
      status: dto.status ?? offer.status,
      environment: dto.environment ?? offer.environment,
      priceCents: dto.priceCents ?? offer.priceCents,
      compareAtPriceCents: dto.compareAtPriceCents ?? offer.compareAtPriceCents,
      installmentsAllowed: dto.installmentsAllowed ?? offer.installmentsAllowed,
      accessDurationDays: dto.accessDurationDays ?? offer.accessDurationDays,
    });

    const saved = await this.offers.save(offer);
    await this.audit(actor, AuditAction.UPDATE, 'Offer', id, `Oferta "${saved.name}" atualizada.`, {
      priceCents: saved.priceCents,
    });
    return saved;
  }

  listCoupons(): Promise<Coupon[]> {
    return this.coupons.find({ order: { createdAt: 'DESC' } });
  }

  async createCoupon(dto: UpsertCouponDto, actor: Actor): Promise<Coupon> {
    const coupon = await this.coupons.save(
      this.coupons.create({
        code: dto.code,
        description: dto.description ?? '',
        discountType: dto.discountType,
        discountValue: dto.discountValue,
        offerId: dto.offerId ?? null,
        maxRedemptions: dto.maxRedemptions ?? null,
        active: dto.active ?? true,
      }),
    );

    await this.audit(
      actor,
      AuditAction.CREATE,
      'Coupon',
      coupon.id,
      `Cupom ${coupon.code} criado.`,
    );
    return coupon;
  }

  async setCouponActive(id: string, active: boolean, actor: Actor): Promise<Coupon> {
    const coupon = await this.coupons.findOne({ where: { id } });
    if (!coupon) throw DomainErrors.notFound('Cupom não encontrado.');

    coupon.active = active;
    const saved = await this.coupons.save(coupon);

    await this.audit(
      actor,
      AuditAction.UPDATE,
      'Coupon',
      id,
      `Cupom ${coupon.code} ${active ? 'ativado' : 'desativado'}.`,
    );
    return saved;
  }

  // ------------------------------------------------------------------
  // Pedidos
  // ------------------------------------------------------------------

  async listOrders(page = 1, pageSize = 25): Promise<PaginatedResult<Order>> {
    const [items, total] = await this.orders.findAndCount({
      relations: { user: true, payments: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
  }

  // ------------------------------------------------------------------
  // Usuários, matrículas e permissões
  // ------------------------------------------------------------------

  async listUsers(search?: string, page = 1, pageSize = 25): Promise<PaginatedResult<User>> {
    // Alias curto: `user` é palavra reservada no PostgreSQL.
    const query = this.users.createQueryBuilder('u').orderBy('u."createdAt"', 'DESC');

    if (search) {
      // ILIKE com parâmetro: o TypeORM escapa o valor (sem SQL injection).
      query.where('u.name ILIKE :search OR u.email ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [items, total] = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getManyAndCount();

    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) || 1 };
  }

  async updateUserRoles(id: string, dto: UpdateUserRolesDto, actor: Actor): Promise<User> {
    const user = await this.usersService.findByIdOrFail(id);

    // Um administrador não pode remover o próprio papel e se trancar fora.
    if (user.id === actor.id && !dto.roles.includes(UserRole.ADMIN)) {
      throw DomainErrors.forbidden('Você não pode remover o seu próprio papel de administrador.');
    }

    const previous = user.roles;
    user.roles = dto.roles.length > 0 ? dto.roles : [UserRole.STUDENT];
    const saved = await this.users.save(user);

    await this.audit(
      actor,
      AuditAction.UPDATE,
      'User',
      id,
      `Papéis de ${user.email} atualizados.`,
      {
        from: previous,
        to: saved.roles,
      },
    );

    return saved;
  }

  async anonymizeUser(id: string, actor: Actor, reason: string): Promise<void> {
    const user = await this.usersService.findByIdOrFail(id);
    const email = user.email;

    await this.usersService.anonymize(id);

    await this.audit(actor, AuditAction.ANONYMIZE_USER, 'User', id, `Conta ${email} anonimizada.`, {
      reason,
    });
  }

  listEnrollments(userId?: string): Promise<Enrollment[]> {
    return this.enrollments.find({
      where: userId ? { userId } : {},
      relations: { user: true, course: true },
      order: { createdAt: 'DESC' },
      take: 200,
    });
  }

  listEntitlements(userId: string): Promise<Entitlement[]> {
    return this.entitlementService.listForUser(userId);
  }

  /** Liberação manual: mesma permissão de uma compra, com motivo auditado. */
  async grantAccess(dto: GrantAccessDto, actor: Actor): Promise<Entitlement> {
    const user = await this.usersService.findByIdOrFail(dto.userId);

    const entitlement = await this.entitlementService.grant({
      userId: dto.userId,
      scope: dto.scope,
      courseId: dto.courseId ?? null,
      programId: dto.programId ?? null,
      source: EntitlementSource.MANUAL_GRANT,
      grantedById: actor.id,
    });

    if (dto.courseId) {
      await this.enrollmentService.ensureEnrollment(
        dto.userId,
        dto.courseId,
        EntitlementSource.MANUAL_GRANT,
      );
    } else if (dto.programId) {
      await this.enrollmentService.ensureEnrollmentsForProgram(
        dto.userId,
        dto.programId,
        EntitlementSource.MANUAL_GRANT,
      );
    }

    await this.audit(
      actor,
      AuditAction.GRANT_ACCESS,
      'Entitlement',
      entitlement.id,
      `Acesso liberado manualmente para ${user.email}.`,
      { reason: dto.reason, scope: dto.scope, courseId: dto.courseId, programId: dto.programId },
    );

    return entitlement;
  }

  async revokeAccess(entitlementId: string, dto: RevokeAccessDto, actor: Actor): Promise<void> {
    const entitlement = await this.entitlements.findOne({ where: { id: entitlementId } });
    if (!entitlement) throw DomainErrors.notFound('Permissão não encontrada.');

    await this.entitlementService.revoke(entitlementId, dto.reason);

    await this.audit(
      actor,
      AuditAction.REVOKE_ACCESS,
      'Entitlement',
      entitlementId,
      'Acesso revogado manualmente.',
      { reason: dto.reason },
    );
  }

  // ------------------------------------------------------------------
  // Auditoria
  // ------------------------------------------------------------------

  async listAuditLogs(page = 1, pageSize = 50): Promise<PaginatedResult<AuditLogDto>> {
    const [items, total] = await this.auditLogs.findAndCount({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      items: items.map((log) => ({
        id: log.id,
        actorId: log.actorId,
        actorEmail: log.actorEmail,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        summary: log.summary,
        metadata: log.metadata,
        ipAddress: log.ipAddress,
        createdAt: log.createdAt.toISOString(),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
    };
  }

  private audit(
    actor: Actor,
    action: AuditAction,
    entityType: string,
    entityId: string | null,
    summary: string,
    metadata?: Record<string, unknown>,
  ) {
    return this.auditService.record({
      actorId: actor.id,
      actorEmail: actor.email,
      action,
      entityType,
      entityId,
      summary,
      metadata: metadata ?? null,
    });
  }
}
