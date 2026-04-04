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
      // 🔥 PAYMENT (HTTP CALL)
      // 🔥 PAYMENT (HYBRID: HTTP + RMQ)

console.log('📡 Sending to RabbitMQ...');

this.client.emit('payment.process', {
  orderId: order.id,
  amount: order.totalAmount || 100,
});


console.log('💰 Payment success');

      // 🔥 INVENTORY
      await this.inventoryService.reserveStock(orderId);

      // 🔥 COMPLETE
      await this.orderRepo.update(orderId, {
        status: 'COMPLETED',
      });

      // 🔥 AFTER PAYMENT + INVENTORY

      console.log('📡 Payment event sent, waiting for result...');
    } 
    
      catch (err) {

  const message = err.message || '';

  // 🔥 NON-RETRYABLE
  if (message.includes('Out of stock')) {
    console.log('❌ Non-retryable error');

    await this.failedQueue.add('failed-order', {
      orderId,
      reason: message,
      type: 'BUSINESS_ERROR',
    });

    return; // ❌ NO RETRY
  }

  // 🔥 RETRYABLE
  throw err; // Bull will retry
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