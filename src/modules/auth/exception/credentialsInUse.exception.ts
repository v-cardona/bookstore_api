import { ConflictException, NotFoundException } from '@nestjs/common';
 
export class CredentialsInUse extends ConflictException {
  constructor() {
    super(`Username or email is already in use`);
  }
}