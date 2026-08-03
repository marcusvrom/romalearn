import { PublicationStatus } from '@romalearn/contracts';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Course } from './course.entity';

/** Trilha: conjunto ordenado de cursos vendido e certificado em conjunto. */
@Entity('programs')
export class Program extends BaseEntity {
  @Index('idx_programs_slug', { unique: true })
  @Column({ type: 'varchar', length: 160 })
  slug: string;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'varchar', length: 400 })
  shortDescription: string;

  @Column({ type: 'text', default: '' })
  fullDescription: string;

  @Column({ type: 'varchar', length: 512, nullable: true })
  coverImageUrl: string | null;

  @Column({ type: 'jsonb', default: () => `'[]'::jsonb` })
  objectives: string[];

  @Column({ type: 'varchar', length: 16, default: PublicationStatus.DRAFT })
  status: PublicationStatus;

  @Column({ type: 'int', default: 0 })
  order: number;

  @OneToMany(() => ProgramCourse, (item) => item.program)
  items: ProgramCourse[];
}

@Entity('program_courses')
@Index('idx_program_courses_unique', ['programId', 'courseId'], { unique: true })
export class ProgramCourse extends BaseEntity {
  @Column({ type: 'uuid' })
  programId: string;

  @ManyToOne(() => Program, (program) => program.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'programId' })
  program: Program;

  @Column({ type: 'uuid' })
  courseId: string;

  @ManyToOne(() => Course, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({ type: 'int', default: 0 })
  order: number;
}
