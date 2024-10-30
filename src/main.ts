import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config/envs';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {

  const logger = new Logger('Main');
  

  const app = await NestFactory.createMicroservice(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.NATS_SERVER,
      },
    }
  );

  app.useGlobalPipes(
    
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }
  ));


  await app.listen();
  logger.log(`Product microservice is running on port ${envs.PORT}`);
}
bootstrap();
