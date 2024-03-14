export const defaultChangedBy = 'system';


export interface IPermission {
    name: string;
    code: string;
}

export class Permissions {

    public static manageUser: IPermission = { code: 'AP01', name: 'Manage User' }

}