import { Controller } from '@nestjs/common';
import { EventPattern, ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Controller()
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }

  private client: ClientProxy;

  constructor() {
  this.client = ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: 'order.queue',   // ✅ USE SAME QUEUE
      queueOptions: {
        durable: true,
      },
    },
  });
}

  @EventPattern('payment.process')
  async handlePayment(data: any) {
    console.log('💰 Processing payment:', data);

    // simulate success/failure
    const isSuccess = Math.random() > 0.3;

    if (isSuccess) {
      console.log('✅ Payment success');

      this.client.emit('payment.success', {
        orderId: data.orderId,
      });

    } else {
      console.log('❌ Payment failed');

      this.client.emit('payment.failed', {
        orderId: data.orderId,
      });
    }
  }
}