interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachments?: any[];
}

export interface IMailerAdapter {

  sendMail(data: SendMailOptions ): Promise<boolean>

}