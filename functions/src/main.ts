import * as functions from 'firebase-functions';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const dotenv = require('dotenv');
import * as admin from 'firebase-admin';
dotenv.config();

export async function createNestServer() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 5001);
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

createNestServer()
  .then((v) => console.log('Nest Ready'))
  .catch((err) => console.error('Nest broken', err));
