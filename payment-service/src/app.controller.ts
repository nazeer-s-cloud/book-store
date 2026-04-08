import { Controller, OnModuleInit } from '@nestjs/common';
import {
  EventPattern,
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController implements OnModuleInit {
  private paymentClient: ClientProxy;
  private notificationClient: ClientProxy;

  constructor() {
    // ✅ Payment queue (self trigger)
    this.paymentClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:5672'],
        queue: 'payment.queue',
        queueOptions: {
          durable: true,
        },
      },
    });

    // ✅ Notification queue (IMPORTANT FIX)
    this.notificationClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://rabbitmq:5672'],
        queue: 'notification.queue',
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  // 🔥 TEMP TEST (REMOVE LATER)
  async onModuleInit() {
    console.log('🔥 TEST: emitting payment.process');

    await firstValueFrom(
      this.paymentClient.emit('payment.process', {
        orderId: 123,
      }),
    );
  }

  // ✅ HANDLE PAYMENT
  @EventPattern('payment.process')
  async handlePayment(data: any) {
    console.log('💰 Processing payment:', data);

    const isSuccess = true;

    if (isSuccess) {
      console.log('✅ Payment success');

      await firstValueFrom(
        this.notificationClient.emit('payment.success', {
          orderId: data.orderId,
        }),
      );
    } else {
      console.log('❌ Payment failed');

      await firstValueFrom(
        this.notificationClient.emit('payment.failed', {
          orderId: data.orderId,
        }),
      );
    }
  }
}