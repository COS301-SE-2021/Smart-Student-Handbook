import * as functions from 'firebase-functions';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

functions.logger.info('Hello logs!', { structuredData: true });
export async function bootstrap() {
  console.log('Hello');
  const app = await NestFactory.create(AppModule);
  await app.listen(5001);
}
// bootstrap()