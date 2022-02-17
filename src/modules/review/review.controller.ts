import { Body, Controller, Delete, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { VersioningEnum } from 'src/shared/versioning.enum';
import { UpdateBookDto } from '../book/dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReadReviewDto } from './dto/read-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewService } from './review.service';

type NewType = UpdateBookDto;

@Controller({version: VersioningEnum.V1, path: 'review'})
@ApiTags('Reviews')
export class ReviewController {
    constructor(private readonly _reviewService: ReviewService) {}

    
  /**
   * Create a review of a book.
   * @param review 
   * @returns [ReadReviewDto]
   */
  @Post()
  @ApiNotFoundResponse({description: 'Thre\'s not an user or book with that id'})
  @ApiCreatedResponse({description: 'Review created', type: ReadReviewDto})
  createBook(@Body() book: CreateReviewDto): Promise<ReadReviewDto> {
    return this._reviewService.create(book);
  }
  
  /**
   * Update review of book
   * @param reviewId
   * @returns 
   */
   @Patch(':reviewId')
   @ApiNotFoundResponse({description: 'The review with reviewId does not exist'})
   updateBook(
     @Param('reviewId', ParseIntPipe) reviewId: number,
     @Body() review: UpdateReviewDto,
   ): Promise<ReadReviewDto> {
     return this._reviewService.update(reviewId, review);
   }
   
  /**
   * Delete a review
   * @param reviewId 
   * @returns bool
   */
  @Delete(':reviewId')
  @ApiNotFoundResponse({description: 'The review with reviewId does not exist'})
  deleteReview(@Param('reviewId', ParseIntPipe) reviewId: number): Promise<boolean> {
    return this._reviewService.delete(reviewId);
  }
}
