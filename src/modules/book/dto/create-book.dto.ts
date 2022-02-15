import { IsString, IsNotEmpty, MaxLength, IsArray, IsEnum, IsNotEmptyObject, MinLength, ArrayNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../../shared/gender.enum';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty({example: 'NestJs for Dummies'})
  readonly name: string;

  @IsString()
  @MaxLength(500)
  @ApiProperty({example: 'NestJs for Dummies description'})
  readonly description: string;

  @IsNotEmpty()
  /**
   * List of author user's id
   */
  readonly authors: number[];

  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(Gender, { each: true })
  /**
   * List of genders of the book
   */
  readonly genders: Gender[]
}