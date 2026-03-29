import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,

    @InjectQueue('orders')
    private orderQueue: Queue,
  ) {}

  async createOrder(productId: number) {
    // ✅ 1. Save order
    const order = this.orderRepo.create({
      productId,
      status: 'PENDING',
    });

    const savedOrder = await this.orderRepo.save(order);

    // ✅ 2. Push to queue
    await this.orderQueue.add(
      'process-order',
      {
        orderId: savedOrder.id,
        productId: savedOrder.productId,
      },
      {
        attempts: 3,
        backoff: 5000,
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    return savedOrder;
  }

    

  async getOrder(id: number) {
    return this.orderRepo.findOne({
      where: { id },
    });
  }
}