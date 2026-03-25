import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    // 🔥 ENV CONFIG
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: __dirname + '/../.env',
    }),

    // 🔥 DATABASE CONFIG
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        console.log('DB_HOST:', config.get('DB_HOST'));
        console.log('DB_USER:', config.get('DB_USER'));
        console.log('DB_PASS:', config.get('DB_PASS'));
        console.log('DB_NAME:', config.get('DB_NAME'));

        return {
          type: 'postgres',
          host: config.get<string>('DB_HOST'),
          port: parseInt(config.get<string>('DB_PORT') || '5432'),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASS'),
          database: config.get<string>('DB_NAME'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),

    // 🔥 REDIS + QUEUE CONFIG
    BullModule.forRoot({
    redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: 6379,
    },
    }),

    // 🔥 FEATURE MODULE
    UsersModule,
  ],
})
export class AppModule {}