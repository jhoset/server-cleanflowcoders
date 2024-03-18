import { Injectable } from '@nestjs/common';
import { IMailerAdapter } from '../interfaces/mailer-adapter.interface';
import { SendMailOptions, Transporter } from 'nodemailer';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class MailerAdapter implements IMailerAdapter {

  private transporter: Transporter;
  constructor(private _configService: ConfigService) {
    this.transporter = nodemailer.createTransport( {
      service: _configService.get('MAILER_SERVICE'),
      auth: {
        user: _configService.get('MAILER_EMAIL'),
        pass: _configService.get('MAILER_SECRET_KEY'),
      }
    });
  }
  async sendMail(data: SendMailOptions) {
    const { to, subject, html, attachments } = data;
    try {
      const sentInformation = await this.transporter.sendMail({
        to, subject, html, attachments,
      });
      console.log(`>>> Email sent to ${to}`);
      return true;
    } catch (error) {
      return false;
    }
  }

}