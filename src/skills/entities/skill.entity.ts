import { Project } from '../../projects/entities/project.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 64, type: 'varchar' })
  name: string;

  @ManyToMany(() => Project, (project) => project.skills)
  projects: Project[];
}
