import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';

dotenv.config();

const corsConfig = {
  origin: ['http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Stripe raw body ONLY for webhook
  app.use('/payments/webhook', express.raw({ type: 'application/json' }));

  app.setGlobalPrefix('api');

  app.enableCors(corsConfig);

  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  app.getHttpAdapter().getInstance().disable('x-powered-by');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Listening on http://localhost:${port}`);
}

bootstrap();
