import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../role/role.entity';
import { RoleRepository } from './role.repository';
import { status } from '../../shared/entity-status.enum';
import { ReadRoleDto } from './dto/read-role.dto';
import { plainToClass } from 'class-transformer';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleRepository)
        private readonly _roleRepository: RoleRepository) {

    }

    
    async get(id: number): Promise<ReadRoleDto> {
        if (!id) {
            throw new BadRequestException('id must be sent');
        }

        const role: Role = await this._roleRepository.findOne(id, {where: {status: status.ACTIVE}});
        
        if (!role) {
            throw new NotFoundException();
        }

        return plainToClass(ReadRoleDto, role);
    }
    
    async getAll(): Promise<ReadRoleDto[]> {
        const roles: Role[] = await this._roleRepository.find({where: {status: status.ACTIVE}});
        return roles.map((role) => plainToClass(ReadRoleDto, role));
    }

    async create(role: Partial<CreateRoleDto>): Promise<ReadRoleDto> {
        const savedRole = await this._roleRepository.save(role);
        return plainToClass(ReadRoleDto, savedRole);
    }

    async update(id: number, role: Partial<UpdateRoleDto>): Promise<ReadRoleDto> {
        const foundRole: Role = await this._roleRepository.findOne(id, {where: {status: status.ACTIVE}});

        if (!foundRole) {
            throw new NotFoundException('This role does not exist');
        }

        foundRole.name = role.name;
        foundRole.description = role.description;

        const updatedRole = await this._roleRepository.save(role);

        return plainToClass(ReadRoleDto, updatedRole);
    }

    async delete(id: number): Promise<boolean> {
        
        const roleExists: Role = await this._roleRepository.findOne(id, {where: {status: status.ACTIVE}});
        
        if (!roleExists) {
            throw new NotFoundException();
        }

        await this._roleRepository.update(id, {status: status.INACTIVE});

        return true;
    }
}
