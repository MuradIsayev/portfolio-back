import { PrimaryGeneratedColumn, Entity, Column } from "typeorm";

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    blockId: string;

    @Column({ length: 64 })
    title: string;

    @Column({ length: 1024 })
    description: string;

    @Column()
    minsRead: number;

    @Column({ nullable: true })
    createdAt: string;
}