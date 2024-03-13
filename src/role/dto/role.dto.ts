import { Optional } from "@nestjs/common";
import { IsDate, IsNumber, IsOptional, IsString, Min, MinLength } from "class-validator";

export class RoleDto {

    @IsNumber()
    @Min(1)
    public id: number;

    @Optional()
    @IsString()
    @MinLength(1)
    public name?: string;

    @IsOptional()
    @IsDate()
    public createdAt?: Date;

    private constructor(id: number, name: string, createdAt: Date) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
    }

    public static mapFrom(obj: { [key: string]: any }): RoleDto {
        const { id, name, createdAt } = obj;
        return new RoleDto(id, name, createdAt);
    }
}