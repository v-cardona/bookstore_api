import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly _userRepository: UserRepository,
        @InjectRepository(RoleRepository)
        private readonly _roleRepository: RoleRepository,) {

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
            throw new NotFoundException();
        }
        
        const roleExists: Role = await this._roleRepository.findOne(roleId, {where: {status: status.ACTIVE}});
        
        if (!roleExists) {
            throw new RoleNotFoundException(roleId);
        }

        userExists.roles.push(roleExists);
        await this._userRepository.save(userExists);

        return true;
    }
}
