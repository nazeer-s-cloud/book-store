import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';

@Processor('users-queue')
export class UsersProcessor {
  @Process('send-welcome')
  async handleWelcome(job: Job) {
    console.log('🔥 Processing job:', job.data);

    // simulate work
    await new Promise((res) => setTimeout(res, 2000));

    console.log(`✅ Welcome email sent to ${job.data.name}`);
  }
}