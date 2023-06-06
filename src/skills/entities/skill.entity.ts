import { Project } from 'src/projects/entities/project.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Project, (project) => project.skills)
  projects: Project[];
}
