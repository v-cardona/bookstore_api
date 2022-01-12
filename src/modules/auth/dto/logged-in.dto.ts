import { IsString } from 'class-validator';
import { ReadUserDto } from '../../user/dto';
import { Type, Exclude, Expose } from 'class-transformer';

@Exclude()
export class LoggedInDto {
  @Expose()
  @IsString()
  /**
   * Token that will be use on header request
   */
  token: string;

  @Expose()
  @Type(() => ReadUserDto)
  user: ReadUserDto;
}