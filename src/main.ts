import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { StaticModule } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Serve static files from the 'uploads' directory
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads', // URL path to access uploaded files
  });

  await app.listen(3000);
}
bootstrap();
