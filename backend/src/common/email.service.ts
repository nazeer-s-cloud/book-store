import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: 'mailhog',
    port: 1025,
    secure: false,
    auth: {
      user: 'nazeer',
      pass: 'niz',
    },
  });

  async sendEmail(to: string, subject: string, text: string) {
    const info = await this.transporter.sendMail({
      from: '"DevDocs" <no-reply@devdocs.com>',
      to,
      subject,
      text,
    });

    console.log('📧 Email sent:', info.messageId);
  }
}