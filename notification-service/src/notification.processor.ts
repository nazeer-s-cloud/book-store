import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import * as nodemailer from 'nodemailer';

@Controller()
export class NotificationProcessor {

  private transporter = nodemailer.createTransport({
  host: 'mailhog',
  port: 1025,
  secure: false,
  ignoreTLS: true,
});

  @EventPattern('payment.success')
async handleSuccess(data: any) {
  const traceId = data.traceId || 'no-trace';

  console.log(
    `[traceId=${traceId}] 📧 Sending email for order: ${data.orderId}`,
  );

  const info = await this.transporter.sendMail({
    from: 'no-reply@devdocs.com',
    to: 'test@example.com',
    subject: 'Order Completed',
    text: `Order #${data.orderId} completed successfully`,
  });

  console.log(
    `[traceId=${traceId}] 📨 Mail sent`,
    info,
  );
}

@EventPattern('payment.failed')
async handleFailed(data: any) {
  const traceId = data.traceId || 'no-trace';

  console.log(
    `[traceId=${traceId}] ❌ Sending failure email: ${data.orderId}`,
  );

  await this.transporter.sendMail({
    from: 'no-reply@devdocs.com',
    to: 'test@example.com',
    subject: 'Order Failed',
    text: `Order #${data.orderId} failed`,
  });
}
}