import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use('/uploads', express.static('uploads')); // 정적 파일 경로 설정

  await app.listen(3000);
}
bootstrap();
