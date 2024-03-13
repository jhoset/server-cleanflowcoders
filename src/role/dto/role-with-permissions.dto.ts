import { PermissionDto } from "src/permission/dto";

export class RoleWithPermissionsDto {


    private constructor(
        public id: number,
        public name: string,
        public createdAt: number[],
        public permissions: PermissionDto[]
    ) { }

    public static mapFrom(obj: { [key: string]: any }): RoleWithPermissionsDto {
        const { id, name, createdAt, permissions } = obj;
        const permissionsDto = permissions.map(({ permission }: any) => PermissionDto.mapFrom(permission))
        return new RoleWithPermissionsDto(id, name, createdAt, permissionsDto);
    }

}