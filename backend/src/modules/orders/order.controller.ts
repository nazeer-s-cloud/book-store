import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders') // ✅ IMPORTANT
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() body: { productId: number }) {
    return this.orderService.createOrder(body.productId);
  }

  @Get()
  getAll() {
    return this.orderService.getAllOrders();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.orderService.getOrder(Number(id));
  }
}