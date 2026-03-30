import { Processor, Process } from '@nestjs/bull';
import * as nodemailer from 'nodemailer';

@Processor('notification-queue')
export class NotificationProcessor {

  private transporter = nodemailer.createTransport({
    host: 'mailhog',   // 🔥 docker service name
    port: 1025,
  });

  @Process('send-email')
  async handle(job: any) {
    const { email, message } = job.data;

    console.log('📧 Sending email to:', email);

    await this.transporter.sendMail({
      from: 'noreply@devdocs.com',
      to: email,
      subject: 'Order Update',
      text: message,
    });

    console.log('✅ Email sent to Mailhog');
  }
}