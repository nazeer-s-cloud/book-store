import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
create(@Body() body: { productId: number }) {
  if (!body.productId) {
    throw new Error('productId is required');
  }

  return this.orderService.createOrder(body.productId);
}

  @Get(':id')
  getOrder(@Param('id') id: string) {
    return this.orderService.getOrder(Number(id));
  }
}