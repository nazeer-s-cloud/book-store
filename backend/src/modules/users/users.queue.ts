import { BullModule } from '@nestjs/bull';

export const UsersQueue = BullModule.registerQueue({
  name: 'users-queue',
});