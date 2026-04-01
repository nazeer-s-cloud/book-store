import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

import { EventPattern } from '@nestjs/microservices';

@Controller('process-payment')
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly appService: AppService) {}

  @EventPattern('payment.process')
  async handlePayment(data: any) {
    console.log('💰 RabbitMQ Payment:', data);

    return { status: 'SUCCESS' };
  }

  @Post()
  processPayment(@Body() body: any) {
    return this.appService.processPayment(body);
  }
}