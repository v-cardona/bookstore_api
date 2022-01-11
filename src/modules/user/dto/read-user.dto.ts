import { Exclude, Expose, Type } from "class-transformer";
import { IsEmail, IsNumber } from "class-validator";
import { ReadUserDetailsDto } from "./index";
import { ReadRoleDto } from "../../role/dto/index.dto";

@Exclude()
export class ReadUserDto {
    @Expose()
    @IsNumber()
    readonly id: number;

    @Expose()
    @IsEmail()
    readonly email: string;
    
    @Expose()
    @IsEmail()
    readonly username: string;

    @Expose()
    @Type(type => ReadUserDetailsDto)
    readonly details: ReadUserDetailsDto
    
    @Expose()
    @Type(type => ReadRoleDto)
    readonly roles: ReadRoleDto
}