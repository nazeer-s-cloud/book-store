import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CONNECT RABBITMQ MICROSERVICE
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://rabbitmq:5672'],
      queue: 'order.queue',
      queueOptions: {
        durable: true,
      },
    },
  });

  // ✅ START MICROSERVICE
  await app.startAllMicroservices();

  await app.listen(3000);

  console.log('🚀 Payment service running');
}

bootstrap();