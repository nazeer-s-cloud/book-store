import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Controller()
export class OrderEvents {

  constructor(
    @InjectRepository(Order)
    private orderRepo: Repository<Order>,
  ) {}

  @EventPattern('payment.success')
  async handleSuccess(data: any) {
    console.log('🎉 Payment success event:', data);

    await this.orderRepo.update(data.orderId, {
      status: 'COMPLETED',
    });
  }

  @EventPattern('payment.failed')
  async handleFailed(data: any) {
    console.log('💥 Payment failed event:', data);

    await this.orderRepo.update(data.orderId, {
      status: 'FAILED',
    });
  }
}