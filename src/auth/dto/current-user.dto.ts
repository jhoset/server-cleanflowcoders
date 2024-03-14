interface Permission {
    id: number;
    code: string;
    name: string;
}


interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

export class CurrentUserDto {
    private constructor(
        public id: number,
        public firstName: string,
        public middleName: string,
        public lastName: string,
        public userName: string,
        public email: string,
        public roles: Role[]
    ) { }

    public static mapFromObjWithRolesAndPermissions(obj: { [key: string]: any }): CurrentUserDto {
        const { id, firstName, middleName, lastName, userName, email, roles } = obj;
        const rolesMapped = roles.map(({ role }) => role);
        rolesMapped.forEach((role) => {
            role.permissions = role.permissions.map(({ permission }) => permission)
        })
        return new CurrentUserDto(id, firstName, middleName, lastName, userName, email, rolesMapped)
    }
}