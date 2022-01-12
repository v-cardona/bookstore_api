import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(25)
    @ApiProperty({example: 'v-cardona'})
    readonly username: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'v-cardona@bookstore.com'})
    readonly email: string;
    
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: '1234'})
    readonly password: string;
}