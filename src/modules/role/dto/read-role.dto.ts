import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';


@Exclude()
export class ReadRoleDto {
    @Expose()
    @IsNumber()
    readonly id: number;
    
    @Expose()
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    @ApiProperty({example: 'GENERAL'})
    readonly name: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @ApiProperty({example: 'GENERAL description'})
    readonly description: string
}