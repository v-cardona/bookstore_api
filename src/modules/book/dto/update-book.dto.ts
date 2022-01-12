import { CreateBookDto } from '.';
import { OmitType } from '@nestjs/swagger';

export class UpdateBookDto extends OmitType(CreateBookDto, ['authors'] as const){}