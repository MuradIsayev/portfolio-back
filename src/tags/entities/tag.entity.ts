import { Blog } from "src/blogs/entities/blog.entity";
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from "typeorm";

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @ManyToMany(() => Blog, (blog) => blog.tags)
    blogs: Blog[];
}
