import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Course } from './course.entity';
import { Lesson } from './lesson.entity';

/** Uma "Parte" do e-book: agrupa capítulos/aulas dentro de um curso. */
@Entity('sections')
@Index('idx_sections_course_order', ['courseId', 'order'])
export class Section extends BaseEntity {
  @Column({ type: 'uuid' })
  courseId: string;

  @ManyToOne(() => Course, (course) => course.sections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @Column({ type: 'int', default: 0 })
  order: number;

  @OneToMany(() => Lesson, (lesson) => lesson.section)
  lessons: Lesson[];
}
