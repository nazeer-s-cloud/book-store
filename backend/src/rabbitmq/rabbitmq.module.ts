import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://rabbitmq:5672'],
          exchange: 'order.exchange',     // 🔥 THIS IS NEW
          exchangeType: 'topic',          // 🔥 THIS IS NEW
        },
      },
    ]),
  ],

  
  exports: [ClientsModule], // 🔥 REQUIRED
})
export class RabbitMQModule {}