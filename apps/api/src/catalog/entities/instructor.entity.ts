import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';

/** Pessoa ou organização responsável pelo conteúdo de um curso. */
@Entity('instructors')
export class Instructor extends BaseEntity {
  @Column({ type: 'varchar', length: 160 })
  name: string;

  @Column({ type: 'varchar', length: 160, nullable: true })
  title: string | null;

  @Column({ type: 'text', nullable: true })
  bio: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  avatarUrl: string | null;
}
