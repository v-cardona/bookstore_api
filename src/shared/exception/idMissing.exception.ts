import { ConflictException, NotFoundException } from '@nestjs/common';
 
export class IdMissingException extends ConflictException {
  constructor() {
    super(`You must provide an id on the request`);
  }
}