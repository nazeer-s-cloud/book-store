import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { OrdersModule } from './modules/orders/orders.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // DB
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),

    // Redis / Bull
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: 6379,
      },
    }),

    // 🔥 THIS IS THE FIX
    OrdersModule,
    UsersModule,
  ],
})
export class AppModule {}