import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

import { Order } from './order.entity';

@Injectable()
export class OrderService {
  retryOrder(arg0: number) {
    throw new Error('Method not implemented.');
  }

  async retryOrder(orderId: number) {
  await this.orderRepo.update(orderId, { status: 'PENDING' });

  await this.orderQueue.add('process-order', {
    orderId,
  });
}

  constructor(
    @InjectRepository(Order) // ✅ REQUIRED
    private orderRepo: Repository<Order>,

    @InjectQueue('orders') // ✅ REQUIRED
    private orderQueue: Queue,
  ) {}

  async createOrder(productId: number) {
    const order = this.orderRepo.create({
      productId,
      status: 'PENDING',
    });

    const saved = await this.orderRepo.save(order);

    await this.orderQueue.add('process-order', {
      orderId: saved.id,
    });

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