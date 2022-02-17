import { IsString, IsNotEmpty, MaxLength, IsArray, IsEnum, IsNotEmptyObject, MinLength, ArrayNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../../shared/gender.enum';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(250)
  @ApiProperty({example: 'Excelent book 10/10'})
  readonly comment: string;

  @IsNumber()
  readonly bookId: number;

  @IsNumber()
  readonly userId: number;

}