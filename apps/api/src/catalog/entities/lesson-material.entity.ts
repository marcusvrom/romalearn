import { MaterialKind } from '@romalearn/contracts';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Lesson } from './lesson.entity';

/** Material de apoio (e-book oficial, planilha modelo, link externo). */
@Entity('lesson_materials')
@Index('idx_lesson_materials_lesson_order', ['lessonId', 'order'])
export class LessonMaterial extends BaseEntity {
  @Column({ type: 'uuid' })
  lessonId: string;

  @ManyToOne(() => Lesson, (lesson) => lesson.materials, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lessonId' })
  lesson: Lesson;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 24, default: MaterialKind.PDF })
  kind: MaterialKind;

  /** Chave no bucket privado; servida por URL assinada e temporária. */
  @Column({ type: 'varchar', length: 512, nullable: true })
  storageKey: string | null;

  /** Alternativa à chave de storage, para materiais do tipo LINK. */
  @Column({ type: 'varchar', length: 512, nullable: true })
  externalUrl: string | null;

  @Column({
    type: 'bigint',
    nullable: true,
    transformer: {
      to: (value: number | null) => value,
      from: (value: string | null) => (value === null ? null : Number(value)),
    },
  })
  sizeBytes: number | null;

  @Column({ type: 'int', default: 0 })
  order: number;
}
