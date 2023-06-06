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

  @Column({ type: 'date' })
  startedAt: Date;

  @Column({ nullable: true, type: 'date' })
  endedAt: Date;

  @ManyToOne(() => WorkSchedule)
  @JoinColumn({ name: 'workScheduleId' })
  workSchedule: WorkSchedule;
}
