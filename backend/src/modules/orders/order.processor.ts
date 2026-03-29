import {
  Processor,
  Process,
  OnQueueCompleted,
  OnQueueFailed,
} from '@nestjs/bull';
import type { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './order.entity';
import { EmailService } from '../../common/email.service';
import { PaymentService } from '../payment/payment.service';
import { InventoryService } from '../inventory/inventory.service';

@Processor('orders')
export class OrderProcessor {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    private paymentService: PaymentService,
    private inventoryService: InventoryService,
    private emailService: EmailService,
  ) {}

  @Process('process-order')
  async handle(job: Job) {
    const { orderId } = job.data;

    console.log(`🚀 Processing order ${orderId}`);

    // 🔥 1. Fetch
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
    });

    if (!order) throw new Error('Order not found');

    // 🔥 2. Idempotency
    if (order.status !== 'PENDING') {
      console.log('⚠️ Already processed / invalid state');
      return;
    }

    // 🔥 3. Processing
    await this.orderRepo.update(orderId, {
      status: 'PROCESSING',
    });

    try {
      // 🔥 Payment
      await this.paymentService.processPayment(orderId);

      // 🔥 Inventory
      await this.inventoryService.reserveStock(orderId);

      // 🔥 Email
      await this.emailService.sendEmail(
        'test@example.com',
        'Order Confirmed',
        `Order #${orderId} completed`,
      );

      // 🔥 Complete
      await this.orderRepo.update(orderId, {
        status: 'COMPLETED',
      });

      console.log('✅ Order completed');
    } catch (err) {
      await this.orderRepo.update(orderId, {
        status: 'FAILED',
      });

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