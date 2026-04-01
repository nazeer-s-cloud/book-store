import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

import { Order } from './order.entity';
import { InventoryService } from '../inventory/inventory.service';

@Injectable()
export class OrderService {
  
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    private inventoryService: InventoryService,

    // 🔥 THIS IS THE FIX
    @InjectQueue('orders')
    private orderQueue: Queue,
  ) {}

  async retryOrder(orderId: number) {
    await this.orderRepo.update(orderId, { status: 'PENDING' });

    await this.orderQueue.add('process-order', {
      orderId,
    });
  }

  async retryFailedOrder(orderId: number) {
  console.log('🔁 Retrying failed order:', orderId);

  // reset status
  await this.orderRepo.update(orderId, {
    status: 'PENDING',
  });

  // push back to main queue
  await this.orderQueue.add(
    'process-order',
    { orderId },
    {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 3000,
      },
    },
  );

  return { message: 'Retry triggered' };
}
  

  async createOrder(productId: number) {
    const order = this.orderRepo.create({
      productId,
      status: 'PENDING',
    });

    const saved = await this.orderRepo.save(order);

    console.log('📥 Adding job to queue:', saved.id);

    await this.orderQueue.add(
  'process-order',
  { orderId: saved.id },
  {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 3000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
);

    return saved;
  }

  async getAllOrders() {
    return this.orderRepo.find({
      order: { id: 'DESC' },
    });
  }

  async getOrder(id: number) {
    return this.orderRepo.findOne({
      where: { id },
    });
  }
}