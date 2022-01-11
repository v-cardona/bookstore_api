import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/role.enum';
import { ReadUserDto, UpdateUserDto } from './dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthGuard(), RoleGuard)
export class UserController {
    constructor(private readonly _userService: UserService) {}

    @Get(':id')
    getUser(@Param('id', ParseIntPipe) id: number): Promise<ReadUserDto> {
        return this._userService.get(id);
    }
    
    @Get()
    @Roles(RoleType.ADMINISTRATOR)
    getUsers(): Promise<ReadUserDto []> {
        return this._userService.getAll();
    }

    @Patch(':id')
    updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: UpdateUserDto):  Promise<ReadUserDto> {
        return this._userService.update(id, user);
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number):  Promise<boolean> {
        return this._userService.delete(id);
    }

    @Post('setRole/:userId/:roleId')
    setRoleToUser(@Param('userId', ParseIntPipe) userId: number, @Param('roleId', ParseIntPipe) roleId: number):  Promise<boolean> {
        return this._userService.setRoleToUser(userId, roleId);
    }
}
