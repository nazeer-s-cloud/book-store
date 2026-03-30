import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('process-payment')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  processPayment(@Body() body: any) {
    return this.appService.processPayment(body);
  }
}