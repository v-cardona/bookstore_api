import { Exclude, Expose, Type } from "class-transformer";
import { IsEmail, IsNumber, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { ReadUserDetailsDto } from "./index";
import { ReadRoleDto } from "../../role/dto/index.dto";

@Exclude()
export class ReadUserDto {
    @Expose()
    @IsNumber()
    readonly id: number;

    @Expose()
    @IsEmail()
    @ApiProperty({example: 'v-cardona@bookstore.com'})
    readonly email: string;
    
    @Expose()
    @IsEmail()
    @MaxLength(25)
    @ApiProperty({example: 'v-cardona'})
    readonly username: string;

    @Expose()
    @Type(type => ReadUserDetailsDto)
    @ApiProperty({type: ReadUserDetailsDto})
    readonly details: ReadUserDetailsDto
    
    @Expose()
    @Type(type => ReadRoleDto)
    readonly roles: ReadRoleDto
}