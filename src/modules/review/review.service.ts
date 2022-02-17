import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../book/book.entity';
import { BookRepository } from '../book/book.repository';
import { UserRepository } from '../user/user.repository';
import { CreateReviewDto } from './dto/create-review.dto';
import {status} from '../../shared/entity-status.enum'
import { BookNotFoundException } from '../book/exception/bookNotFound.exception';
import { User } from '../user/user.entity';
import { UserNotFoundException } from '../user/exception/userNotFound.exception';
import { ReviewRepository } from './review.repository';
import { Review } from './review.entity';
import { plainToClass } from 'class-transformer';
import { ReadReviewDto } from './dto/read-review.dto';
import { UpdateBookDto } from '../book/dto';
import { ReviewNotFoundException } from './exception/reviewNotFound.exception';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewService {
    
    constructor(
        @InjectRepository(ReviewRepository)
        private readonly _reviewRepository: ReviewRepository,
        @InjectRepository(BookRepository)
        private readonly _bookRepository: BookRepository,
        @InjectRepository(UserRepository)
        private readonly _userRepository: UserRepository,
    ) {
        
    }

    async create(review: CreateReviewDto): Promise<ReadReviewDto> {
        
        const bookId = review.bookId;
        const bookExists: Book = await this._bookRepository.findOne(bookId, {where: {status: status.ACTIVE}})
    
        if (!bookExists) {
            throw new BookNotFoundException(bookId);
        }
        
        const userId = review.userId;
        const userExists: User = await this._userRepository.findOne(userId, {where: {status: status.ACTIVE}})
    
        if (!userExists) {
            throw new UserNotFoundException(userId);
        }
        
        const savedReview: Review = await this._reviewRepository.save({
            book: bookExists,
            user: userExists,
            comment: review.comment
        });

        return plainToClass(ReadReviewDto, savedReview);
    }

    
    async update(reviewId: number, review: UpdateReviewDto): Promise<ReadReviewDto> {
        
        const reviewExists = await this._reviewRepository.findOne(reviewId,);
    
        if (!reviewExists) {
            throw new ReviewNotFoundException(reviewId);
        }
    
        reviewExists.comment = review.comment;
    
        const updatedReview = await this._reviewRepository.save(reviewExists);
        return plainToClass(ReadReviewDto, updatedReview);
    }
    
    async delete(reviewId: number): Promise<boolean> {
        const reviewExists = await this._reviewRepository.findOne(reviewId);
    
        if (!reviewExists) {
          throw new ReviewNotFoundException(reviewId);
        }
        const deleteResult = await this._reviewRepository.delete(reviewId);
        
        return deleteResult.affected > 0;
    }
}
