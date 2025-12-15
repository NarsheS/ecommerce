import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import cookieParser from 'cookie-parser';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // nginx setup
  const server = app.getHttpAdapter().getInstance();
  server.set('trust proxy', 1);

  // Cookies
  app.use(cookieParser());

  // Stripe raw body ONLY for webhook
  app.use('/payments/webhook', express.raw({ type: 'application/json' }));

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  // API prefix
  app.setGlobalPrefix('api');

  // CORS config (IMPORTANTE)
  app.enableCors({
    origin: 'http://localhost:3000', // frontend
    credentials: true,              // permitir cookies
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'], // necessário por causa dos cookies
  });

  // Remove X-Powered-By
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  // DTO validation
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
