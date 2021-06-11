import * as functions from 'firebase-functions';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


export async function createNestServer() {
  const app = await NestFactory.create(AppModule);
  return await  app.init();
}

createNestServer();
