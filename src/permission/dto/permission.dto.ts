import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class PermissionDto {
    @IsNumber()
    public id: number;

    @IsOptional()
    @IsString()
    public name?: string;

    @IsOptional()
    @IsString()
    public code?: string;

    @IsOptional()
    @IsDate()
    public createdAt?: Date;

    public constructor(id: number, name: string, code: string, createdAt: Date) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.createdAt = createdAt;
    }

    public static mapFrom(obj: { [key: string]: any }): PermissionDto {
        const { id, name, code, createdAt } = obj;
        return new PermissionDto(id, name, code, createdAt);
    }

}