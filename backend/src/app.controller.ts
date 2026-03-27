import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  getHello: any;
  @Get()
  getRoot() {
    return 'API Running 🚀';
  }
}