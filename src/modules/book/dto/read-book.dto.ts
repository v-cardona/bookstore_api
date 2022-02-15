import { IsString, IsNumber, MaxLength } from 'class-validator';
import { Exclude, Expose, Type } from 'class-transformer';
import { ReadUserDto } from '../../user/dto';
import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '../../../shared/gender.enum';


@Exclude()
export class ReadBookDto {
  @Expose()
  @IsNumber()
  readonly id: number;

  @Expose()
  @IsString()
  @MaxLength(100)
  @ApiProperty({example: 'NestJs for Dummies'})
  readonly name: string;

  @Expose()
  @IsString()
  @MaxLength(500)
  @ApiProperty({example: 'NestJs for Dummies description'})
  readonly description: string;

  @Expose()
  @Type(type => ReadUserDto)
  readonly authors: ReadUserDto[];

  
  @Expose()
  readonly genders: Gender[];
}