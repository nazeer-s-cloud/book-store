import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(
    @Inject('RABBITMQ_SERVICE')
    private client: ClientProxy,
  ) {}

  async processPayment(data: any) {
    console.log('💰 Processing payment:', data);

    // simulate success
    const isSuccess = true;

    if (isSuccess) {
      console.log('✅ Emitting payment.success');

      this.client.emit('payment.success', {
        orderId: data.orderId,
      });
    } else {
      this.client.emit('payment.failed', {
        orderId: data.orderId,
      });
    }
  }
}