import {BaseEntity, Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import { Role } from '../role/role.entity';
import { UserDetails } from './user.details.entity';
import { status } from '../../shared/entity-status.enum';
import { Book } from '../book/book.entity';
import { PublicFile } from '../files/publicFile.entity';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({type: 'varchar', unique: true, length: 25, nullable: false})
    username: string;

    @Column({type: 'varchar', nullable: false})
    email: string;

    @Column({type: 'varchar', nullable: false})
    password: string;

    @OneToOne(type => UserDetails, {cascade: true, nullable: false, eager: true,})
    @JoinColumn({name: 'detail_id'})
    details: UserDetails;

    @ManyToMany(type => Role, role => role.users, {eager: true})
    @JoinTable({name: 'user_roles'})
    /**
     * List of user's roles
     */
    roles: Role[];
    
    @ManyToMany(type => Book, book => book.authors, )
    @JoinTable({name: 'user_books'})
    /**
     * List of books that the user is author
     */
    books: Book[];

    @JoinColumn()
    @OneToOne(
        () => PublicFile,
        {
        eager: true,
        nullable: true
        }
    )
    public avatar?: PublicFile;

    @Column({type: 'varchar', default: status.ACTIVE, length: 8})
    status: string;

    @CreateDateColumn({type: 'timestamp', name: 'created_at'})
    createdAt: Date;
    
    @UpdateDateColumn({type: 'timestamp', name: 'updated_at'})
    updatedAt: Date;
}