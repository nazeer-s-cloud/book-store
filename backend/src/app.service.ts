import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class UsersService {
  jobRepo: any;
  constructor(
    @InjectQueue('users') private readonly queue: Queue,
  ) {}

  async createUser(data: any) {
    await this.queue.add('create-user', data);
  }

  async getJobStatus(id: number) {
  return this.jobRepo.findOne({
    where: { id },
  });
}
}