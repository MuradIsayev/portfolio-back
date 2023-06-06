import { WorkSchedule } from 'src/work-schedule/entities/work-schedule.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Experience {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 64, type: 'varchar' })
  position: string;

  @Column({ length: 1024, type: 'varchar' })
  description: string;

  @Column({ length: 64, type: 'varchar' })
  company: string;

  @Column({ type: 'varchar' })
  startedAt: string;

  @Column({ nullable: true, type: 'varchar' })
  endedAt: string;

  @ManyToOne(() => WorkSchedule)
  @JoinColumn({ name: 'workScheduleId' })
  workSchedule: WorkSchedule;
}
