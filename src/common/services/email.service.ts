import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private readonly from: string;

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    this.from = this.configService.get('MAIL_FROM');
  }
  async sendForgotPassword(to: string, name: string, link: string) {
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Restablecer Contraseña</title>
      </head>
      <body>
        <p>Hola ${name},</p>
        <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
        <a href="${link}">${link}</a>
      </body>
      </html>
    `;
    await this.sendEmail(to, 'Restablecer Contraseña', htmlContent);
  }
  async sendEmail(to: string, subject: string, html: string) {
    await this.mailerService.sendMail({
      from: this.from,
      to,
      subject,
      html,
    });
  }
}
