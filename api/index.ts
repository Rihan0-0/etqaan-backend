import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { VercelRequest, VercelResponse } from '@vercel/node';

const expressApp = express();
let app: any;

async function bootstrap() {
  if (!app) {
    app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    app.enableCors({
      origin:
        process.env.CORS_ORIGIN === '*'
          ? true
          : process.env.CORS_ORIGIN?.split(','),
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    });

    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.setGlobalPrefix('api-v1');

    await app.init();
  }
  return expressApp;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const expressInstance = await bootstrap();
  expressInstance(req, res);
}
