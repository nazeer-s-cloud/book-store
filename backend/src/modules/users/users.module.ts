import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersQueue } from './users.queue';
import { UsersProcessor } from './users.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersQueue,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersProcessor],
})

export class UsersModule {}

