import { Injectable } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';

@Injectable()
export class AppService {
  @EventPattern('payment.process')
  async handlePayment(data: any) {
    console.log('💰 RabbitMQ Payment:', data);

    return { status: 'SUCCESS' };
  }

  getHello(): string {
    throw new Error('Method not implemented.');
  }

  async processPayment(data: any) {
    const random = Math.random();

    // simulate delay
    await new Promise(res => setTimeout(res, 1000));

    if (random < 0.7) {
      console.log('💰 Payment SUCCESS');
      return {
        status: 'SUCCESS',
        transactionId: `txn_${Date.now()}`
      };
    }

    if (random < 0.9) {
      console.log('💳 Payment FAILED');
      return {
        status: 'FAILED',
        reason: 'INSUFFICIENT_FUNDS'
      };
    }

    console.log('⏱️ Payment TIMEOUT');
    throw new Error('PAYMENT_TIMEOUT');
  }
}
