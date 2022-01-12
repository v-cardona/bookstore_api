import { PickType } from '@nestjs/swagger';
import { ReadUserDto } from ".";

export class UpdateUserDto extends PickType(ReadUserDto, ['username'] as const) {}