import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Activación de validaciones automáticas con los DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina datos extras que no estén definidos en el DTO
      forbidNonWhitelisted: true, // Devuelve error 400 si el cliente envía campos no permitidos
      transform: true, // Transforma tipos automáticamente según el DTO
    }),
  );

  await app.listen(envs.PORT);
  console.log(`💧 AguaFixApi corriendo en el puerto: ${envs.PORT}`);
}
void bootstrap();
