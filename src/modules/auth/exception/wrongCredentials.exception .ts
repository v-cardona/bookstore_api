import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
 
export class WrongCredentials extends UnauthorizedException {
  constructor() {
    super(`Username or password are incorrect`);
  }
}