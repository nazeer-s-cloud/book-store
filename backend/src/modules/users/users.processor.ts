import {
  Processor,
  Process,
  OnQueueFailed,
  OnQueueCompleted,
} from '@nestjs/bull';
import type { Job } from 'bull';
import { EmailService } from '../../common/email.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobEntity } from '../jobs/job.entity'; // adjust path

@Processor('users')
export class UsersProcessor {
  constructor(
    private emailService: EmailService,

    @InjectRepository(JobEntity)
    private jobRepo: Repository<JobEntity>,
  ) {}

  @Process('send-email')
  async handle(job: Job) {
    console.log('Processing job:', job.data);

    const jobId = job.data.jobId;

    if (!jobId) {
      console.log('⚠️ No jobId found, skipping update');
      return;
    }

    if (job.data.name === 'fail') {
      console.log('💥 Simulating failure...');
      throw new Error('Simulated failure');
    }
    
    await this.emailService.sendEmail(
      'test@example.com',
      'Welcome!',
      `Hello ${job.data.name}`,
    );

    await this.jobRepo.update(jobId, {
      status: 'completed',
      result: 'Email sent',
    });

    console.log('✅ Email sent');
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    console.log(`🎉 Job completed: ${job.id}`);
  }

  @OnQueueFailed()
async onFailed(job: Job, err: Error) {
  const jobId = job.data.jobId;

  if (jobId) {
    await this.jobRepo.update(jobId, {
      status: 'failed',
      error: err.message,
    });
  }

  console.log(`❌ Job failed: ${job.id}`);
}


 
}