import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';


async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    const port = process.env.PORT;
    await app.listen(port || 3000);
    console.log(`Listening on https://localhost:${port}`);
}

bootstrap();
