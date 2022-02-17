import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Book } from "../book/book.entity";
import { Exclude } from "class-transformer";

@Entity('reviews')
export class Review extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => User, user => user.reviews,)
    user: User;

    @ManyToOne(() => Book, book => book.reviews)
    book: Book;

    @Column('varchar', {length: 250})
    /**
     * Comment of the book
     */
    comment: string;

    @CreateDateColumn({type: 'timestamp', name: 'created_at'})
    createdAt: Date;
    
    @UpdateDateColumn({type: 'timestamp', name: 'updated_at'})
    updatedAt: Date;
}