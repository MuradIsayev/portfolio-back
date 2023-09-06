import { Skill } from '../../skills/entities/skill.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 64, type: 'varchar' })
  name: string;

  @ManyToMany(() => Skill, (skill) => skill.projects, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  skills: Skill[];

  @Column({ length: 1024, type: 'varchar' })
  description: string;

  @Column({ length: 1024, type: 'varchar' })
  url: string;
}
