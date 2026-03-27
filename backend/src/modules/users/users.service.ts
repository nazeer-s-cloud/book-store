import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { JobEntity } from '../jobs/job.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(JobEntity) // ✅ FIXED
    private jobRepo: Repository<JobEntity>,

    @InjectQueue('users')
    private userQueue: Queue,
  ) {}

  async getUsers() {
    return this.userRepo.find();
  }

  async createUser(name: string) {
    // ✅ 1. Save user
    const user = this.userRepo.create({ name });
    const savedUser = await this.userRepo.save(user);

    // ✅ 2. Create job record FIRST
    const jobRecord = await this.jobRepo.save({
      status: 'pending',
    });

    // ✅ 3. Push to queue WITH jobId
    await this.userQueue.add(
      'send-email',
      {
        jobId: jobRecord.id,   // 🔥 IMPORTANT
        name: savedUser.name,
      },
      {
        attempts: 3,
        backoff: 5000,
        timeout: 10000,
      },
    );

    // ✅ 4. Optional load protection
    const counts = await this.userQueue.getJobCounts();

    if (counts.waiting > 500) {
      throw new Error('System overloaded');
    }

    return {
      user: savedUser,
      jobId: jobRecord.id, // 🔥 return to client
    };
  }

  // ✅ FIXED METHOD (NOT variable)
  async getJobStatus(id: number) {
    return this.jobRepo.findOne({
      where: { id },
    });
  }
}