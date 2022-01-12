import { OmitType } from '@nestjs/swagger';
import { ReadRoleDto } from './read-role.dto';

export class UpdateRoleDto extends OmitType(ReadRoleDto, ['id'] as const) {}