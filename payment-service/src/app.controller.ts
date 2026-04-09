import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { AppService } from './app.service';

@Controller()
export class AppController {
  getHello(): any {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly appService: AppService) {}

  // ✅ HANDLE PAYMENT EVENT (THIN CONTROLLER)
  @EventPattern('payment.process')
  handlePayment(data: any) {
    return this.appService.processPayment(data);
  }
}