import axios from 'axios';
import {
  Processor,
  Process,
  OnQueueCompleted,
  OnQueueFailed,
  InjectQueue,
} from '@nestjs/bull';
import type { Job, Queue } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './order.entity';
import { InventoryService } from '../inventory/inventory.service';
import { ClientProxy } from '@nestjs/microservices/client/client-proxy';
import { Inject } from '@nestjs/common';

@Processor('orders')
export class OrderProcessor {
  constructor(
  @InjectRepository(Order)
  private orderRepo: Repository<Order>,

  private inventoryService: InventoryService,

  @Inject('RABBITMQ_SERVICE')
  private client: ClientProxy,
  

  @InjectQueue('notification-queue')   // 🔥 ADD BACK
  private notificationQueue: Queue,

  @InjectQueue('failed-orders')
  private failedQueue: Queue,
) {}

  

  @Process('process-order')
async handle(job: Job) {
  const { orderId } = job.data;

  console.log(`🚀 Processing order ${orderId}`);

  const order = await this.orderRepo.findOne({
    where: { id: orderId },
  });

  if (!order) throw new Error('Order not found');

  await this.orderRepo.update(orderId, {
    status: 'PROCESSING',
  });

  try {
    console.log('📡 Sending payment.process to RabbitMQ...');

    await this.client.emit('payment.process', {
      orderId: order.id,
      amount: order.totalAmount || 100,
      traceId: `trace-${Date.now()}`, // 🔥 IMPORTANT
    });

    console.log('📡 Payment event sent');

    // ❗ DO NOT mark completed here
    // ❗ DO NOT assume success

  } catch (err) {
    const message = err.message || '';

    if (message.includes('Out of stock')) {
      console.log('❌ Non-retryable error');

      await this.failedQueue.add('failed-order', {
        orderId,
        reason: message,
        type: 'BUSINESS_ERROR',
      });

      return;
    }

    throw err;
  }
}



  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`🎉 Order job completed: ${job.id}`);
  }

  @OnQueueFailed()
async onFailed(job: Job, err: Error) {
  console.log(`❌ Order job failed: ${job.id}`);
  console.log(`Reason: ${err.message}`);

  // 🔥 Push to DLQ
  await this.failedQueue.add('failed-order', {
    orderId: job.data.orderId,
    reason: err.message,
    failedAt: new Date(),
  });
}

}