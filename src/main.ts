import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //Configuração da aplicação nest, cria a aplicação

  process.env.TZ = '-03:00'; //configuração de timezone

  app.useGlobalPipes(new ValidationPipe()); //configuração da validação dos dados de entrada

  app.enableCors(); // condiguração de cors para permitir requisições de ourtas origens

  await app.listen(process.env.PORT ?? 4000); //execução da aplicação nest, configuração da porta
}
bootstrap();
