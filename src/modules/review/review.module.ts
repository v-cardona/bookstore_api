import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookRepository } from '../book/book.repository';
import { UserRepository } from '../user/user.repository';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './review.repository';
import { ReviewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewRepository, BookRepository, UserRepository])],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}
