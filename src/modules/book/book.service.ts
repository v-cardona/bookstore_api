import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { BookRepository } from './book.repository';
import { status} from '../../shared/entity-status.enum';
import { CreateBookDto, ReadBookDto, ReadBooksSearchResultDto, UpdateBookDto } from './dto';
import { plainToClass } from 'class-transformer';
import { Book } from './book.entity';
import { User } from '../user/user.entity';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/role.enum';
import {BookNotFoundException} from './exception/bookNotFound.exception';
import { UserIsNotAuthorException } from '../user/exception/userIsNotAuthor.exception';
import { UserNotFoundException } from '../user/exception/userNotFound.exception';
import { IdMissingException } from 'src/shared/exception/idMissing.exception';
import { Connection, FindManyOptions, MoreThan } from 'typeorm';

@Injectable()
export class BookService {
    constructor(
        @InjectRepository(BookRepository)
        private readonly _bookRepository: BookRepository,
        @InjectRepository(UserRepository)
        private readonly _userRepository: UserRepository,
        private connection: Connection,
    ) {
        
    }

    async get(bookId: number): Promise<ReadBookDto> {
        if (!bookId) {
            throw new BadRequestException();
        }

        const book: Book = await this._bookRepository.findOne(bookId, {where: {status: status.ACTIVE}})
    
        if (!book) {
            throw new BookNotFoundException(bookId);
        }

        return plainToClass(ReadBookDto, book);
    }

    async getAll(offset?: number, limit?: number): Promise<ReadBooksSearchResultDto> {
      const where: FindManyOptions<Book>['where'] = {};
      where.status = status.ACTIVE;
    
      const [items, total_results] = await this._bookRepository.findAndCount({
        where,
        order: {
          id: 'ASC'
        },
        skip: offset,
        take: limit
      });
      const books = items.map((book) => plainToClass(ReadBookDto, book));
    
      const result = {
        total_results: total_results,
        results: books
      }

      return plainToClass(ReadBooksSearchResultDto, result);
    }

    async getBooksByAuthor(authorId: number): Promise<ReadBookDto []> {
        if (!authorId) {
            throw new IdMissingException();
        }
        const books: Book[] = await this._bookRepository
          .createQueryBuilder('books')
          .leftJoinAndSelect('books.authors', 'users')
          .where('books.status = :status', { status: status.ACTIVE })
          .andWhere('users.id = :id ', { id: authorId })
          .getMany();

        return books.map((book) => plainToClass(ReadBookDto, book));
    } 
    
  async create(book: Partial<CreateBookDto>): Promise<ReadBookDto> {
    const authors: User[] = [];

    for (const authorId of book.authors) {
      const authorExists = await this._userRepository.findOne(authorId, {
        where: { status: status.ACTIVE },
      });

      if (!authorExists) {
        throw new UserNotFoundException(authorId);
      }

      const isAuthor = authorExists.roles.some(
        (role: Role) => role.name === RoleType.AUTHOR,
      );

      if (!isAuthor) {
        throw new UserIsNotAuthorException(authorId);
      }

      authors.push(authorExists);
    }

    const savedBook: Book = await this._bookRepository.save({
        name: book.name,
        description: book.description,
        authors,
      });
  
      return plainToClass(ReadBookDto, savedBook);
    }

  async createByAuthor(book: Partial<CreateBookDto>, authorId: number) {
    const author = await this._userRepository.findOne(authorId, {
      where: { status: status.ACTIVE },
    });

    const isAuthor = author.roles.some(
      (role: Role) => role.name === RoleType.AUTHOR,
    );

    if (!isAuthor) {
      throw new UserIsNotAuthorException(authorId);
    }

    const savedBook: Book = await this._bookRepository.save({
      name: book.name,
      description: book.description,
      author,
    });

    return plainToClass(ReadBookDto, savedBook);
  }
  async update(
    bookId: number,
    book: UpdateBookDto,
  ): Promise<ReadBookDto> {
    const bookExists = await this._bookRepository.findOne(bookId, {
      where: { status: status.ACTIVE },
    });

    if (!bookExists) {
      throw new BookNotFoundException(bookId);
    }

    bookExists.name = book.name;
    bookExists.description = book.description;

    const updatedBook = await this._bookRepository.save(bookExists);
    return plainToClass(ReadBookDto, updatedBook);
  }

  async delete(id: number): Promise<boolean> {
    const bookExists = await this._bookRepository.findOne(id, {
      where: { status: status.ACTIVE },
    });

    if (!bookExists) {
      throw new BookNotFoundException(id);
    }

    await this._bookRepository.update(id, { status: status.INACTIVE });
    return true;
  }

  async searchForBooks(text: string, offset?: number, limit?: number): Promise<ReadBooksSearchResultDto> {
    
    const [ books, total_results] = await this._bookRepository.createQueryBuilder()
      .select()
      .where('name ILIKE :searchTerm', {searchTerm: `%${text}%`})
      .andWhere('status = :status', {status: status.ACTIVE})
      .limit(limit)
      .offset(offset)
      .getManyAndCount();
      
      const result = {
        total_results: total_results,
        results: books
      }

      return plainToClass(ReadBooksSearchResultDto, result);
  }

}
