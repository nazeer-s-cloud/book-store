import './polyfills';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getQueueToken } from '@nestjs/bull';
import { setupBullBoard } from './queue/queue.ui';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS
  app.enableCors({
    origin: '*',
  });

  // ✅ GET QUEUES (INSIDE FUNCTION)
  const userQueue = app.get(getQueueToken('users'));
  const orderQueue = app.get(getQueueToken('orders'));

  // ✅ PASS BOTH
  setupBullBoard(app, [userQueue, orderQueue]);

  await app.listen(3000);

  console.log('🚀 App running');
  console.log('📊 Queue UI: http://localhost:3000/admin/queues');
}

bootstrap();