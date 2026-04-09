import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(
    @Inject('RABBITMQ_SERVICE')
    private client: ClientProxy,
  ) {}

  async processPayment(data: any) {
    const traceId = data.traceId || `trace-${Date.now()}`;

    // ✅ structured log
    console.log(
      JSON.stringify({
        service: 'payment',
        event: 'payment.process',
        orderId: data.orderId,
        traceId,
      }),
    );

    const isSuccess = true;

    if (isSuccess) {
      console.log(
        JSON.stringify({
          service: 'payment',
          event: 'payment.success',
          orderId: data.orderId,
          traceId,
        }),
      );

      // ✅ FIX: emit SUCCESS (NOT process)
      await firstValueFrom(
        this.client.emit('payment.success', {
          orderId: data.orderId,
          traceId,
        }),
      );
    } else {
      console.log(
        JSON.stringify({
          service: 'payment',
          event: 'payment.failed',
          orderId: data.orderId,
          traceId,
        }),
      );

      await firstValueFrom(
        this.client.emit('payment.failed', {
          orderId: data.orderId,
          traceId,
        }),
      );
    }
  }
}