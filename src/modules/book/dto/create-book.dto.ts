import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
}