export const defaultChangedBy = 'system';


export interface IPermission {
    name: string;
    code: string;
}

export class Permissions {

    public static MANAGE_USER: IPermission = { code: 'P001', name: 'Manage User' }
    public static MANAGE_RAFFLE: IPermission = { code: 'P002', name: 'Manage Raffle' }
}

export function generateResetPasswordMailBody(clientUrl: string, resetPasswordPath: string, token: string): string {
    return `

<body style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
    <!-- Contenedor principal -->
    <table role="presentation" cellspacing="0" cellpadding="0" width="600px" style="margin: auto; font-size: 40px; color: white">
        <!-- HEADER -->
        <tr>
            <td style="padding: 20px; text-align: center; background-color: #0f0f0f;">
               Clean Flow Coders - Draw App

            </td>
        </tr>

        <!-- MAIN CONTENT -->
        <tr style="color: #0f0f0f; background-color: #ffffff;font-size: 15px; height: 250px; ">
            <td style="padding: 20px 60px; text-align: center; background-color: white; border: #EDEDED 2px solid ;">
                <h1 style="font-size: 20px;">RESET PASSWORD </h1>
                <p style="text-align: center">
                    A request was received to reset your account password.
                    <br>
                    The following button will redirect you to an interface in which you can specify your new password.
                </p>
                <div style="text-align: center;">
                    <a target="_blank" href="${clientUrl}/${resetPasswordPath}?token=${token}"
                        style="background-color: #1f073f; color: #ffffff; 
                        padding: 10px 20px; text-decoration: none; border-radius: 5px; 
                        display: inline-block; margin-top: 20px;">
                        Reset Password
                    </a>
                </div>

            </td>
        </tr>

        <!-- FOOTER -->
        <tr>
            <td style="padding: 16px; text-align: center; background-color: #3e3c34; color: #F4F4F4; font-size: 12px;">
                © 2024 CFC Team. All Rights Reserved
            </td>
        </tr>
    </table>
</body>
`
}