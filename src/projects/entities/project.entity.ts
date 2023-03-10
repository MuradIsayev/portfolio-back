import { Skill } from 'src/skills/entities/skill.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Skill, (skill) => skill.projects, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  skills: Skill[];

  @Column()
  description: string;

  @Column()
  url: string;
}
