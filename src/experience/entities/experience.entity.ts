import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 64 })
  position: string;

  @Column({ length: 1024 })
  description: string;

  @Column({ length: 64 })
  company: string;

  @Column()
  workSchedule: string;

  @Column()
  startedAt: Date;

  @Column({ nullable: true })
  endedAt: Date;
}
