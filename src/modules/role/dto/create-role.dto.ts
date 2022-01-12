import { OmitType } from '@nestjs/swagger';
import { ReadRoleDto } from './read-role.dto';

export class CreateRoleDto extends OmitType(ReadRoleDto, ['id'] as const) {}