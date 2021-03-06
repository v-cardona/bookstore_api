import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Version } from '@nestjs/common';
import { Roles } from '../role/decorators/role.decorator';
import { RoleType } from '../role/role.enum';
import { BookService } from './book.service';
import { CreateBookDto, ReadBookDto, ReadBooksSearchResultDto, UpdateBookDto } from './dto';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { VersioningEnum } from 'src/shared/versioning.enum';
import { PaginationParams } from 'src/shared/paginationParams';
import { ReadReviewDto } from '../review/dto/read-review.dto';

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
   * Get all books or filter by name contains the search
   * @returns [ReadBookDto[]]
   */
  @Get()
  @ApiQuery({
    name: 'search',
    description: 'search on name and description of book',
    required: false
  })
  @ApiQuery({
    name: 'limit',
    description: 'max results to get, max: 40, defalt: 20',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'offset',
    description: 'get books with starting on the selected offset',
    required: false,
    type: 'number',
  })
  getAllBooks(
    @Query('search') search: string,
    @Query() { offset, limit }: PaginationParams
  ): Promise<ReadBooksSearchResultDto> {
    if (search) {
      return this._bookService.searchForBooks(search, offset, limit);
    }
    return this._bookService.getAll(offset, limit);
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
  
  /**
   * Get reviews of bookId
   * @param bookId 
   * @returns [ReadReviewDto]
   */
   @Get('/reviews/:bookId')
   @ApiNotFoundResponse({description: 'The book with bookId does not exist'})
   getReviewsOfBook(@Param('bookId', ParseIntPipe) bookId: number): Promise<ReadReviewDto[]> {
     return this._bookService.getReviews(bookId);
   }
}