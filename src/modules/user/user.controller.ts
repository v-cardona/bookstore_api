import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(AuthGuard())
export class UserController {
    constructor(private readonly _userService: UserService) {}

    @Get(':id')
    async getUser(@Param('id', ParseIntPipe) id: number): Promise<User> {
        const user = await this._userService.get(id);
        return user;
    }
    
    @Get()
    async getUsers(): Promise<User []> {
        const users = await this._userService.getAll();
        return users;
    }

    @Post()
    async createUser(@Body() user: User):  Promise<User> {
        const createdUser = await this._userService.create(user);
        return createdUser;
    }

    @Patch(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() user: User):  Promise<boolean> {
        await this._userService.update(id, user);
        return true;
    }

    @Delete(':id')
    async deleteUser(@Param('id', ParseIntPipe) id: number):  Promise<boolean> {
        await this._userService.delete(id);
        return true;
    }
}
