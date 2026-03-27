import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersProcessor } from './users.processor';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { EmailService } from '../../common/email.service';
import { JobEntity } from '../jobs/job.entity';



@Module({
  imports: [
  TypeOrmModule.forFeature([User, JobEntity]),
  BullModule.registerQueue({ name: 'users' }),


    BullModule.registerQueue({
      name: 'users',
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersProcessor, EmailService], // ✅ FIXED
  exports: [UsersService],
})

  
export class UsersModule {}