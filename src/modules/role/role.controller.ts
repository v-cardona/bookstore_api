import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateRoleDto, ReadRoleDto, UpdateRoleDto } from './dto/index.dto';
import { RoleService } from './role.service';

@Controller('roles')
export class RoleController {
    constructor(private readonly _roleService: RoleService) {}

    @Get(':id')
    getRole(@Param('id', ParseIntPipe) id: number): Promise<ReadRoleDto> {
        return this._roleService.get(id);
    }
    
    @Get()
    getRoles(): Promise<ReadRoleDto []> {
        return this._roleService.getAll();
    }

    @Post()
    createRole(@Body() role: Partial<CreateRoleDto>):  Promise<ReadRoleDto> {
        return this._roleService.create(role);
    }

    @Patch(':id')
    updateRole(@Param('id', ParseIntPipe) id: number, @Body() role: Partial<UpdateRoleDto>):  Promise<ReadRoleDto> {
        return this._roleService.update(id, role);
    }

    @Delete(':id')
    deleteRole(@Param('id', ParseIntPipe) id: number):  Promise<boolean> {
        return this._roleService.delete(id);
    }
}
