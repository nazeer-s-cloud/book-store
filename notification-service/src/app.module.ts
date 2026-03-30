import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationProcessor } from './notification.processor';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'redis',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'notification-queue',
    }),
  ],
  providers: [NotificationProcessor],
})
export class AppModule {}