import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { Order } from './order.entity';
import { OrderService } from './order.service';
import { OrderProcessor } from './order.processor';
import { InventoryService } from '../inventory/inventory.service';
import { OrderController } from './order.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),

    BullModule.registerQueue({ name: 'orders' }),

    // ⚠️ Only if you are still using notification queue
    BullModule.registerQueue({ name: 'notification-queue' }),
  ],
  controllers: [OrderController],

  providers: [
    OrderService,
    OrderProcessor,

    // 🔥 THIS IS THE FIX
    InventoryService,
  ],
})
export class OrdersModule {}