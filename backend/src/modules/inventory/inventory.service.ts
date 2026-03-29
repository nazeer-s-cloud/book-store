import { Injectable } from '@nestjs/common';

@Injectable()
export class InventoryService {
  async reserveStock(orderId: number) {
    console.log(`📦 Reserving stock for order ${orderId}`);

    const available = Math.random() > 0.2;

    if (!available) {
      throw new Error('Out of stock');
    }

    console.log('📦 Stock reserved');
    return true;
  }
}