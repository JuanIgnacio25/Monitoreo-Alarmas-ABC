import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [process.env.NEXT_CLIENT_URL || 'http://localhost:3001'];

  app.enableCors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Habilita el intercambio de cookies, encabezados de autenticación, etc.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization', // Lista los encabezados permitidos
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true,
  }))

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
