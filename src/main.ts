import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppExceptionFilter } from './filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const appPort = process.env.PORT || 8030;

  // validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // swagger
  const config = new DocumentBuilder()
    .setTitle('Employee Management API')
    .setDescription('API documentation for the Employee Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  config.servers = [
    {
      url: process.env.APP_URL || `http://localhost:${appPort}`,
      description: 'Local Server',
    },
  ];
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
    },
  });

  // enable cors with specific configuration for file serving
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.useGlobalFilters(new AppExceptionFilter());
  await app.listen(appPort, () => {
    console.log(`Server is running on port http://localhost:${appPort}`);
    console.log(`Swagger Docs available at http://localhost:${appPort}/api-docs`);
  });
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
