import { Tag } from 'src/tags/entities/tag.entity';
import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 1024, type: 'varchar' })
  blockId: string;

  @Column({ length: 1024, type: 'varchar' })
  title: string;

  @Column({ length: 1024, type: 'varchar' })
  description: string;

  @Column({ type: 'int' })
  minsRead: number;

  @Column({ nullable: true, type: 'varchar' })
  createdAt: string;

  @ManyToMany(() => Tag, (tag) => tag.blogs, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  tags: Tag[];
}
