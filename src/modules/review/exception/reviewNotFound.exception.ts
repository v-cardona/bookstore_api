import { NotFoundException } from '@nestjs/common';
 
export class ReviewNotFoundException extends NotFoundException {
  constructor(reviewId: number) {
    super(`Review with id ${reviewId} not found`);
  }
}