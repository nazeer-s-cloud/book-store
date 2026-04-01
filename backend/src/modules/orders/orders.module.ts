import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { RabbitMQModule } from '../../rabbitmq/rabbitmq.module';

import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderProcessor } from './order.processor';
import { InventoryService } from '../inventory/inventory.service';
import { OrderController } from './order.controller';
import { FailedProcessor } from './failed.processor';

@Module({
  imports: [
  TypeOrmModule.forFeature([Order]),

  RabbitMQModule,   // 🔥 THIS LINE FIXES YOUR ERROR

  BullModule.registerQueue(
    { name: 'orders' },
    { name: 'failed-orders' },
    { name: 'notification-queue' },
  ),
],

  controllers: [OrderController],

  providers: [
    OrderService,
    OrderProcessor,
    InventoryService,
    FailedProcessor,
  ],
})
export class OrdersModule {}