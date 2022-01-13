import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Version } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { VersioningEnum } from 'src/shared/versioning.enum';
import { CreateRoleDto, ReadRoleDto, UpdateRoleDto } from './dto/index.dto';
import { RoleService } from './role.service';

@Controller({path: 'roles', version: VersioningEnum.V1})
@ApiTags('Roles')
export class RoleController {
    constructor(private readonly _roleService: RoleService) {}

    /**
     * Get role by id
     * @param roleId 
     * @returns [ReadRoleDto]
     */
    @Get(':roleId')
    @ApiBadRequestResponse({description: '[roleId] is not sent'})
    getRole(@Param('roleId', ParseIntPipe) roleId: number): Promise<ReadRoleDto> {
        return this._roleService.get(roleId);
    }
    
    /**
     * Get all roles
     * @returns [ReadRoleDto[]]
     */
    @Get()
    getRoles(): Promise<ReadRoleDto []> {
        return this._roleService.getAll();
    }

    /**
     * Create a role
     * @param role 
     * @returns The [ReadRoleDto] created
     */
    @Post()
    createRole(@Body() role: CreateRoleDto):  Promise<ReadRoleDto> {
        return this._roleService.create(role);
    }

    /**
     * Updates a role
     * @param roleId 
     * @param role 
     * @returns The [ReadRoleDto] updated
     */
    @Patch(':roleId')
    @Version(VersioningEnum.V2)
    @ApiNotFoundResponse({description: 'The role with that [roleId] does not exist'})
    updateRole(@Param('roleId', ParseIntPipe) roleId: number, @Body() role: UpdateRoleDto):  Promise<ReadRoleDto> {
        return this._roleService.update(roleId, role);
    }

    /**
     * Deletes the role by [roleId]
     * @param roleId 
     * @returns [true] if deleted
     */
    @Delete(':roleId')
    @ApiNotFoundResponse({description: 'The role with that [roleId] does not exist'})
    deleteRole(@Param('roleId', ParseIntPipe) roleId: number):  Promise<boolean> {
        return this._roleService.delete(roleId);
    }
}
