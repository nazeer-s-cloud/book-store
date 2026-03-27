import { BullModule } from '@nestjs/bull';
import { Queue } from 'bull';

export class UsersQueueService {
  constructor(private queue: Queue) {}

  async addCreateUserJob(data: any) {
    await this.queue.add('create-user', data, {
      attempts: 3,
      backoff: 5000,
      timeout: 10000,
      removeOnComplete: true,
    });
  }
}

export const UsersQueue = BullModule.registerQueue({
  name: 'users',
});