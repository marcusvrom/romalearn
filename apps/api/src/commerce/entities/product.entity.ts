import { ProductType, PublicationStatus } from '@romalearn/contracts';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Course } from '../../catalog/entities/course.entity';
import { Program } from '../../catalog/entities/program.entity';
import { Offer } from './offer.entity';

/**
 * Algo comercializável. O produto aponta para o conteúdo acadêmico
 * (curso ou trilha), mas nunca carrega preço — isso é papel da oferta.
 */
@Entity('products')
export class Product extends BaseEntity {
  @Index('idx_products_slug', { unique: true })
  @Column({ type: 'varchar', length: 160 })
  slug: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', default: '' })
  description: string;

  @Column({ type: 'varchar', length: 16 })
  type: ProductType;

  @Column({ type: 'varchar', length: 16, default: PublicationStatus.DRAFT })
  status: PublicationStatus;

  @Column({ type: 'uuid', nullable: true })
  courseId: string | null;

  @ManyToOne(() => Course, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course | null;

  @Column({ type: 'uuid', nullable: true })
  programId: string | null;

  @ManyToOne(() => Program, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'programId' })
  program: Program | null;

  @OneToMany(() => Offer, (offer) => offer.product)
  offers: Offer[];
}
