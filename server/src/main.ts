import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import helmet from 'helmet';

dotenv.config(); // load env FIRST

const corsConfig = {
  origin: ['http://localhost:3000'], // frontend later
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors(corsConfig);

  // Security headers
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );

  // Hide Express "x-powered-by"
  app.getHttpAdapter().getInstance().disable('x-powered-by');

  const port = process.env.PORT || 3000;

  await app.listen(port);
  console.log(`Listening on http://localhost:${port}`);
}

bootstrap();
