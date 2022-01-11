import { Exclude, Expose } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

@Exclude()
export class ReadRoleDto {
    @Expose()
    @IsNumber()
    readonly id: number;
    
    @Expose()
    @IsNotEmpty()
    @IsString()
    @MaxLength(50, {message: 'this name is not valid'})
    readonly name: string;

    @Expose()
    @IsNotEmpty()
    @IsString()
    @MaxLength(100, {message: 'this description is not valid'})
    readonly description: string
}