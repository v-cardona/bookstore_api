import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseGuards, UseInterceptors, Version } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiHeader, ApiUnauthorizedResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/role.enum';
import { ReadUserDto, UpdateUserDto } from './dto';
import { UserService } from './user.service';
import { VersioningEnum } from 'src/shared/versioning.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { PublicFile } from '../files/publicFile.entity';
import { ReadPublicFilerDto } from '../files/dto/read-public-file.dto';

@Controller({path: 'users', version: VersioningEnum.V1})
@ApiTags('Users')
@ApiBearerAuth()
@ApiHeader({
    name: 'authorization',
    description: 'Token associate to login. Must be inserted by this way: Bearer [token]',
})
@UseGuards(AuthGuard(), RoleGuard)
@ApiUnauthorizedResponse({description: 'Not authorized to this request'})
export class UserController {
    constructor(private readonly _userService: UserService) {}

    /**
     * Get user by id
     * @param userId 
     * @returns [ReadUserDto]
     */
    @Get(':userId')
    @ApiBadRequestResponse({description: 'User id must be sent'})
    @ApiNotFoundResponse({description: 'The user with [userId] does not exist'})
    getUser(@Param('userId', ParseIntPipe) userId: number): Promise<ReadUserDto> {
        return this._userService.get(userId);
    }
    
    /**
     * Get all user. Only administator role user can use this request
     * @returns [ReadUserDto []]
     */
    @Get()
    @Roles(RoleType.ADMINISTRATOR)
    getUsers(): Promise<ReadUserDto []> {
        return this._userService.getAll();
    }

    /**
     * Update user
     * @param userId 
     * @param user 
     * @returns The [ReadUserDto] updated
     */
    @Patch(':userId')
    @Version(VersioningEnum.V2)
    @ApiNotFoundResponse({description: 'The user with [userId] does not exist'})
    updateUser(@Param('userId', ParseIntPipe) userId: number, @Body() user: UpdateUserDto):  Promise<ReadUserDto> {
        return this._userService.update(userId, user);
    }

    /**
     * Delete user by userId
     * @param userId 
     * @returns [true] if deleted
     */
    @Delete(':userId')
    @ApiNotFoundResponse({description: 'The user with [userId] does not exist'})
    deleteUser(@Param('userId', ParseIntPipe) userId: number):  Promise<boolean> {
        return this._userService.delete(userId);
    }

    /**
     * Set a role by [roleId] to a User by [userId]
     * @param userId 
     * @param roleId 
     * @returns [true] if set successfully
     */
    @Post('setRole/:userId/:roleId')
    @ApiNotFoundResponse({description: 'The user with [userId] or the role with [roleId] does not exist'})
    setRoleToUser(@Param('userId', ParseIntPipe) userId: number, @Param('roleId', ParseIntPipe) roleId: number):  Promise<boolean> {
        return this._userService.setRoleToUser(userId, roleId);
    }

    /**
     * Upload a avatar to the [userId]
     * @param userId 
     * @param file 
     * @returns [ReadPublicFilerDto] url of the download file
     */
    @Post('avatar/:userId')
    @UseInterceptors(FileInterceptor('file'))
    @ApiNotFoundResponse({description: 'The user with [userId] does not exist'})
    async addAvatar(@Param('userId', ParseIntPipe) userId: number, @UploadedFile() file: Express.Multer.File): Promise<ReadPublicFilerDto> {
        return this._userService.addAvatar(userId, file.buffer, file.originalname);
    }

    /**
     * Delete the user's avatar 
     * @param userId 
     * @returns [true] if deleted successfully
     */
    @Delete('avatar/:userId')
    @ApiNotFoundResponse({description: 'The user with [userId] does not exist'})
    async deleteAvatar(@Param('userId', ParseIntPipe) userId: number) {
        return this._userService.deleteAvatar(userId);
    }
    
}
