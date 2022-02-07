import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, Max, Min } from "class-validator";
import { SearchConstants } from "./search.constants";

export class PaginationParams {
  
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @IsPositive()
    readonly offset?: number;
  
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsPositive()
    @Max(40)
    readonly limit: number = SearchConstants.LIMIT_DEFAULT;
  }