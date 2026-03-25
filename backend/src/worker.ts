import './polyfills';
import * as crypto from 'crypto';

// 🔥 correct fix
(global as any).crypto = crypto.webcrypto;

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(AppModule);
  console.log('🔥 Worker started...');
}

bootstrap();