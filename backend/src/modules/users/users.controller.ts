import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users') // 🔥 THIS DEFINES /users
export class UsersController {
  jobRepo: any;
  constructor(private readonly usersService: UsersService) {}

  @Post() // 🔥 THIS DEFINES POST /users
  createUser(@Body() body: any) {
    return this.usersService.createUser(body.name);
  }

  @Get('job/:id')
getStatus(@Param('id') id: number) {
  return this.usersService.getJobStatus(id);
}

    


}




