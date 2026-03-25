import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';

@Processor('users-queue')
export class UsersProcessor {
  @Process('send-welcome')
  async handleWelcome(job: Job) {
    console.log('🔥 Job received:', job.data);

    // 🔥 simulate random failure
    if (Math.random() < 0.5) {
      console.log('❌ Simulating failure...');
      throw new Error('Random failure');
    }

    // simulate work
    await new Promise((res) => setTimeout(res, 2000));

    console.log(`✅ Welcome email sent to ${job.data.name}`);
  }
}