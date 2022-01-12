import { Exclude, Expose } from "class-transformer";
import { IsString, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class ReadUserDetailsDto {
    @Expose()
    @IsString()
    @MaxLength(50)
    @ApiProperty({example: 'v'})
    readonly name: string;

    @Expose()
    @IsString()
    @ApiProperty({example: 'cardona'})
    readonly lastname: string;
}