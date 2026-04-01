import { Processor, Process } from '@nestjs/bull';

@Processor('failed-orders')
export class FailedProcessor {
  @Process('failed-order')
  async handle(job: any) {
    console.log('☠️ DLQ Job received:');

    console.log('OrderId:', job.data.orderId);
    console.log('Reason:', job.data.reason);
    console.log('Time:', job.data.failedAt);

    // 🔥 later: save to DB / alert system
  }
}