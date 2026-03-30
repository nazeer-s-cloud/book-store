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

@Processor('orders')
export class OrderProcessor {
  constructor(
  @InjectRepository(Order)
  private orderRepo: Repository<Order>,

  private inventoryService: InventoryService,

  @InjectQueue('notification-queue')   // 🔥 ADD BACK
  private notificationQueue: Queue,
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
      const paymentResponse = await axios.post(
        'http://payment-service:3002/process-payment',
        {
          orderId: order.id,
          amount: order.totalAmount || 100,
        },
      );

      if (paymentResponse.data.status !== 'SUCCESS') {
        throw new Error('Payment failed');
      }

      console.log('💰 Payment success');

      // 🔥 INVENTORY
      await this.inventoryService.reserveStock(orderId);

      // 🔥 COMPLETE
      await this.orderRepo.update(orderId, {
        status: 'COMPLETED',
      });

      // 🔥 AFTER PAYMENT + INVENTORY

await this.notificationQueue.add(
  'send-email',
  {
    email: 'test@example.com',
    message: `Order #${orderId} completed`,
  },
);

      console.log('✅ Order completed');
    } catch (err) {
      await this.orderRepo.update(orderId, {
        status: 'FAILED',
      });

      console.log('❌ Order failed');
      throw err;
    }
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`🎉 Order job completed: ${job.id}`);
  }

  @OnQueueFailed()
  onFailed(job: Job, err: Error) {
    console.log(`❌ Order job failed: ${job.id}`);
    console.log(`Reason: ${err.message}`);
  }
}