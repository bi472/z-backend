import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription('REST API documentation')
    .setVersion('1.0.0')
    .addTag('nestjs')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/docs', app, document);

  const origin = process.env.FRONTEND_URL;

  app.enableCors({
    origin,
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      transform: true, 
      forbidNonWhitelisted: true, 
      transformOptions: {
        enableImplicitConversion: true, 
      },
    }),
  );

  await app.listen(5000);
}
bootstrap();
