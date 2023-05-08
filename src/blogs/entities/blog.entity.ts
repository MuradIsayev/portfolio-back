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

  @ManyToMany(() => Tag, (tag) => tag.blogs, {
    eager: true,
    cascade: true,
  })
  @JoinTable()
  tags: Tag[];
}
