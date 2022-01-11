import { Exclude, Expose } from "class-transformer";
import { IsString } from "class-validator";

@Exclude()
export class ReadUserDetailsDto {
    @Expose()
    @IsString()
    readonly name: string;

    @Expose()
    @IsString()
    readonly lastname: string;
}