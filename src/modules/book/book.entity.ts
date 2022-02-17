import { BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../user/user.entity";
import { status } from '../../shared/entity-status.enum'
import { Gender } from "../../shared/gender.enum";
import { Review } from "../review/review.entity";

@Entity('books')
export class Book extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', length: 100, nullable: false})
    /**
     * Title of the book
     * @example The Lord of the Rings
     */
    name: string;

    @Column({type: 'varchar', length: 500,})
    /**
     * Description of the book
     */
    description: string;

    
    @Column({type: 'tsvector', select: false, nullable: true})
    /**
     * Description of the book
     */
    description_vector: string;

    @ManyToMany(type => User, user => user.books, {eager: true})
    @JoinColumn()
    /**
     * List of users with role author
     */
    authors: User[]

    @Column({
        type: "enum",
        enum: Gender,
        nullable: true,
        array: true
    })
    /**
     * List of genders of the book
     */
    genders: Gender[];
    
    @OneToMany(() => Review, review => review.book)
    reviews: Review[]
    
    @Column({type: 'varchar', default: status.ACTIVE, length: 8})
    status: string;

    @CreateDateColumn({type: 'timestamp', name: 'created_at'})
    createdAt: Date;
    
    @UpdateDateColumn({type: 'timestamp', name: 'updated_at'})
    updatedAt: Date;
}