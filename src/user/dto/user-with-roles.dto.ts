import { RoleDto } from "src/role/dto";

export class UserWithRolesDto {


    private constructor(
        public id: number,
        public firstName: string,
        public middleName: string,
        public lastName: string,
        public userName: string,
        public email: string,
        public verifiedEmail: boolean,
        public roles: RoleDto[]
    ) { }

    public static mapFrom(obj: { [key: string]: any }): UserWithRolesDto {
        const { id, firstName, middleName, lastName, userName, email, verifiedEmail, roles } = obj;
        const rolesDto = roles.map(({ role }) => RoleDto.mapFrom(role));
        return new UserWithRolesDto(id, firstName, middleName, lastName, userName, email, verifiedEmail, rolesDto)
    }

}