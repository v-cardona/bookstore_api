import { NotFoundException } from '@nestjs/common';
 
export class BookNotFoundException extends NotFoundException {
  constructor(bookId: number) {
    super(`Book with id ${bookId} not found`);
  }
}