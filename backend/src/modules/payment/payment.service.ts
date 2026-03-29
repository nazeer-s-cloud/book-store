import { Injectable } from '@nestjs/common';

@Injectable()
export class PaymentService {
  async processPayment(orderId: number) {
    console.log(`💳 Processing payment for order ${orderId}`);

    const success = Math.random() > 0.2;

    if (!success) {
      throw new Error('Payment failed');
    }

    console.log('💳 Payment success');
    return true;
  }
}