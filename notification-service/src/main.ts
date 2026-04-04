import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
  urls: ['amqp://rabbitmq:5672'],
  queue: 'order.queue',
  queueOptions: { durable: true },
  exchange: 'order.exchange',
  exchangeType: 'topic',

      },
    },
  );

  await app.listen();
}
bootstrap();