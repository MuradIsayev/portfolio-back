import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WorkSchedule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 64 })
    type: string;
}
