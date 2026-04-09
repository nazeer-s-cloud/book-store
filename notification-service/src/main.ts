import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { logger } from './logger/logger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger });

  await app.listen(3000);
}
bootstrap();