import { IsString, MinLength } from "class-validator";

export class CreatePermissionDto {
    @MinLength(1)
    @IsString()
    public name: string;

    @MinLength(4)
    @IsString()
    public code: string;

}
