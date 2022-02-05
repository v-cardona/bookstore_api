import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../role/role.entity';
import { RoleRepository } from '../role/role.repository';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { status } from '../../shared/entity-status.enum';
import { ReadUserDto, UpdateUserDto } from './dto';
import { plainToClass } from 'class-transformer';
import { IdMissingException } from 'src/shared/exception/idMissing.exception';
import { RoleNotFoundException } from '../role/exception/RoleNotFound.exception';
import { FilesService } from '../files/files.service';
import { UserNotFoundException } from './exception/userNotFound.exception';
import { PublicFile } from '../files/publicFile.entity';
import { ReadPublicFilerDto } from '../files/dto/read-public-file.dto';
import { v4 as uuid } from 'uuid';
import { FilesDirectoriesStorage } from '../files/filesDirectories.constant';
import { Connection } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly _userRepository: UserRepository,
        @InjectRepository(RoleRepository)
        private readonly _roleRepository: RoleRepository,
        private readonly _filesService: FilesService,
        private connection: Connection,
    ) {

    }

    
    async get(id: number): Promise<ReadUserDto> {
        if (!id) {
            throw new IdMissingException();
        }

        const user: User = await this._userRepository.findOne(id, {where: {status: status.ACTIVE}});
        
        if (!user) {
            throw new NotFoundException();
        }

        return plainToClass(ReadUserDto, user);
    }
    
    async getAll(): Promise<ReadUserDto[]> {
        const users: User[] = await this._userRepository.find({where: {status: status.ACTIVE}});
        return users.map((user) => plainToClass(ReadUserDto, user));
    }

    async update(id: number, user: UpdateUserDto): Promise<ReadUserDto> {
        const foundUser = await this._userRepository.findOne(id, {where: {status: status.ACTIVE}});

        if (!foundUser) {
            throw new NotFoundException();
        }

        foundUser.username = user.username;
        const updatedUser = await this._userRepository.save(foundUser);

        return plainToClass(ReadUserDto, updatedUser);
    }

    async delete(id: number): Promise<boolean> {
        
        const userExists: User = await this._userRepository.findOne(id, {where: {status: status.ACTIVE}});
        
        if (!userExists) {
            throw new NotFoundException();
        }

        await this._userRepository.update(id, {status: status.INACTIVE});

        return true;
    }

    async setRoleToUser(userId: number, roleId: number): Promise<boolean> {
        
        const userExists: User = await this._userRepository.findOne(userId, {where: {status: status.ACTIVE}});
        
        if (!userExists) {
            throw new UserNotFoundException(userId);
        }
        
        const roleExists: Role = await this._roleRepository.findOne(roleId, {where: {status: status.ACTIVE}});
        
        if (!roleExists) {
            throw new RoleNotFoundException(roleId);
        }

        userExists.roles.push(roleExists);
        await this._userRepository.save(userExists);

        return true;
    }

    async getById(userId: number): Promise<User> {
        const user: User = await this._userRepository.findOne(userId, {where: {status: status.ACTIVE}});
        
        if (!user) {
            throw new UserNotFoundException(userId);
        }

        return user;
    }
     
    async addAvatar(userId: number, imageBuffer: Buffer, filename: string): Promise<ReadPublicFilerDto> {
        // TODO: comprobar el tamaño de imagen o comprimir
        const user = await this.getById(userId);
        if (user.avatar) {
            await this.deleteUserAvatar(user);
        }
        const filenameUnique: string = `${FilesDirectoriesStorage.AVATARS}/${uuid()}-${filename}`;
        const avatar = await this._filesService.uploadPublicFile(imageBuffer, filenameUnique);
        await this._userRepository.update(userId, {
            avatar
        });
        return plainToClass(ReadPublicFilerDto, avatar);
    }

    async deleteAvatar(userId: number): Promise<boolean> {
        const queryRunner = this.connection.createQueryRunner();
        const user = await this.getById(userId);
        const fileId = user.avatar?.id;
        var removed = false;
        if (fileId) {
          await queryRunner.connect();
          await queryRunner.startTransaction();
          try {
            await queryRunner.manager.update(User, userId, {
              avatar: null
            });
            await this._filesService.deletePublicFileWithQueryRunner(fileId, queryRunner);
            await queryRunner.commitTransaction();
            removed = true;
          } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new InternalServerErrorException();
          } finally {
            await queryRunner.release();
          }
        }
        return removed;
    }

    async deleteUserAvatar(user: User): Promise<boolean> {
        const fileId = user.avatar?.id;
        if (fileId) {
            await this._userRepository.update( user.id, {
                avatar: null
            });
            return await this._filesService.deletePublicFile(fileId);
        }
        return false;
    }
}
