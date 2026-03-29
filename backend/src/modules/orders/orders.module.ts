import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderProcessor } from './order.processor';
import { EmailService } from '../../common/email.service';

import { PaymentService } from '../payment/payment.service';
import { InventoryService } from '../inventory/inventory.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    BullModule.registerQueue({ name: 'orders' }),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderProcessor,
    PaymentService,
    InventoryService,
    EmailService,
  ],
})
export class OrdersModule {}