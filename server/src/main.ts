import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

dotenv.config(); // load env FIRST

const corsConfig = {
    origin: ['http://localhost:3000'], // later replace with production domain
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Global route prefix
    app.setGlobalPrefix('api');

    // CORS
    app.enableCors(corsConfig);

    // Security headers
    app.use(
      helmet({
        contentSecurityPolicy: false,
      }),
    );

    // Hide Express signature
    app.getHttpAdapter().getInstance().disable('x-powered-by');

    // IMPORTANT: Enable validation globally
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,            // strip unknown fields
        forbidNonWhitelisted: true, // block unknown fields
        transform: true,            // transform types
      })
    );

    // If you plan to use cookies for refresh tokens:
    // import * as cookieParser from 'cookie-parser';
    // app.use(cookieParser());

    const port = process.env.PORT || 3000;
    await app.listen(port);

    console.log(`Listening on http://localhost:${port}`);
}

bootstrap();
