export const defaultChangedBy = 'system';


export interface IPermission {
    name: string;
    code: string;
}

export class Permissions {

    public static MANAGE_USER: IPermission = { code: 'P001', name: 'Manage User' }
    public static MANAGE_RAFFLE: IPermission = { code: 'P002', name: 'Manage Raffle' }
}