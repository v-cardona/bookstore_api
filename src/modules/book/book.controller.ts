import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Version } from '@nestjs/common';
import { Roles } from '../role/decorators/role.decorator';
import { RoleType } from '../role/role.enum';
import { BookService } from './book.service';
import { CreateBookDto, ReadBookDto, UpdateBookDto } from './dto';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { VersioningEnum } from 'src/shared/versioning.enum';

@Controller({version: VersioningEnum.V1, path: 'book'})
@ApiTags('Books')
export class BookController {
  constructor(private readonly _bookService: BookService) {}

  /**
   * Get book with bookId
   * @param bookId 
   * @returns [ReadBookDto]
   */
  @Get(':bookId')
  @ApiNotFoundResponse({description: 'The book with bookId does not exist'})
  getBook(@Param('bookId', ParseIntPipe) bookId: number): Promise<ReadBookDto> {
    return this._bookService.get(bookId);
  }
  
  /**
   * Get the list of books of the author's id
   * @param authorId 
   * @returns [ReadBookDto[]]
   */
  @Get('author/:authorId')
  @ApiBadRequestResponse({description: 'Author id must be sent'})
  getBooksByAuthor(@Param('authorId', ParseIntPipe) authorId: number): Promise<ReadBookDto[]> {
    return this._bookService.getBooksByAuthor(authorId);
  }

  /**
   * Get all books
   * @returns [ReadBookDto[]]
   */
  @Get()
  getAllBooks(): Promise<ReadBookDto[]> {
    return this._bookService.getAll();
  }

  /**
   * Create a new book. The user who mades the request must be an author and also the user on authors array
   * @param book 
   * @returns [ReadBookDto]
   */
  @Post()
  @Roles(RoleType.AUTHOR)
  @ApiNotFoundResponse({description: 'Thre\'s not an user with that id'})
  @ApiConflictResponse({description: 'Thre\'s not an author\s role on author\'s array'})
  @ApiCreatedResponse({description: 'Book created', type: ReadBookDto})
  createBook(@Body() book: CreateBookDto): Promise<ReadBookDto> {
    return this._bookService.create(book);
  }

  /**
   * Update book constant, only name and description
   * @param bookId
   * @param book 
   * @returns 
   */
  @Patch(':bookId')
  @Version(VersioningEnum.V2)
  @ApiNotFoundResponse({description: 'The book with bookId does not exist'})
  updateBook(
    @Param('bookId', ParseIntPipe) bookId: number,
    @Body() book: UpdateBookDto,
  ): Promise<ReadBookDto> {
    return this._bookService.update(bookId, book);
  }

  /**
   * Delete book
   * @param bookId 
   * @returns bool
   */
  @Delete(':bookId')
  @ApiNotFoundResponse({description: 'The book with bookId does not exist'})
  deleteBook(@Param('bookId', ParseIntPipe) bookId: number): Promise<boolean> {
    return this._bookService.delete(bookId);
  }
}