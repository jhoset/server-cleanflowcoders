import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto {

    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    public limit?: number;

    @IsOptional()
    @Min(0)
    @IsNumber()
    public offset?: number;

}