import { IsString, IsNotEmpty, MaxLength, IsArray, IsEnum, IsNotEmptyObject, MinLength, ArrayNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../../shared/gender.enum';
import { User } from 'src/modules/user/user.entity';
import { Book } from 'src/modules/book/book.entity';
import { Exclude } from 'class-transformer';

export class ReadReviewDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  @ApiProperty({example: 'Excelent book 10/10'})
  readonly comment: string;

  @Exclude()
  readonly user: User;

  @Exclude()
  readonly book: Book;

  @Exclude()
  readonly createdAt: Date;
  
  readonly updatedAt: Date;
}