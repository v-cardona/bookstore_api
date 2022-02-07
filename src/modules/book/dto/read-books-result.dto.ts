import { Expose } from "class-transformer";
import { IsArray, IsNumber, IsPositive } from "class-validator";
import { ReadBookDto } from ".";

export class ReadBooksSearchResultDto {
    @Expose()
    @IsNumber()
    @IsPositive()
    readonly total_results: number;
  
    @Expose()
    @IsArray()
    readonly results: ReadBookDto[];
}
