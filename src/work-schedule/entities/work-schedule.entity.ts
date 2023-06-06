import { Experience } from 'src/experience/entities/experience.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WorkSchedule {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 64, type: 'varchar' })
  type: string;
}
