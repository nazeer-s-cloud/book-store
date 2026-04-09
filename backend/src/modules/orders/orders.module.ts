import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderProcessor } from './order.processor';
import { InventoryService } from '../inventory/inventory.service';
import { OrderController } from './order.controller'; // ✅ MAKE SURE PATH IS CORRECT

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),

    BullModule.registerQueue(
      { name: 'orders' },
      { name: 'notification-queue' },
      { name: 'failed-orders' },
    ),

    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          queue: 'payment.queue',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],

  controllers: [OrderController], // 🔥 REQUIRED

  providers: [
    OrderService,
    OrderProcessor,
    InventoryService,
  ],
})
export class OrdersModule {}