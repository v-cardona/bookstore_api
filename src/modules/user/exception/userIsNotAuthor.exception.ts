import { ConflictException, NotFoundException } from '@nestjs/common';
 
export class UserIsNotAuthorException extends ConflictException {
  constructor(authorId: number) {
    super(`This user with id ${authorId} is not an author`);
  }
}