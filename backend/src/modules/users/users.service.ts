import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class UsersService {
  constructor(
  @InjectRepository(User)
  private userRepo: Repository<User>,

  @InjectQueue('users-queue')
  private userQueue: Queue,
) {}

  async getUsers() {
    return this.userRepo.find();
  }

  async createUser(name: string) {
  const user = this.userRepo.create({ name });
  const savedUser = await this.userRepo.save(user);

  // 🔥 Add job to queue
  await this.userQueue.add(
  'send-welcome',
  {
    userId: savedUser.id,
    name: savedUser.name,
  },
  {
    attempts: 3, // retry 3 times
    backoff: 2000, // wait 2 sec before retry
  },
);

  return savedUser;
}
}
