import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT || 3000);
  console.log('ENV TEST:', process.env.DB_PASS);
  console.log('DB_PASS:', process.env.DB_PASS);
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_NAME:', process.env.DB_NAME);

  console.log(`App running on: ${await app.getUrl()}`);
}
bootstrap();