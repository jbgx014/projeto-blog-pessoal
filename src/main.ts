import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule); //Configuração da aplicação nest, cria a aplicação

  const config = new DocumentBuilder()
  .setTitle('Blog Pessoal')
  .setDescription('Projeto Blog Pessoal')
  .setContact("Juliana Borges","https://github.com/jbgx014","juborges014@gmail.com")
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/swagger', app, document);

  process.env.TZ = '-03:00'; //configuração de timezone

  app.useGlobalPipes(new ValidationPipe()); //configuração da validação dos dados de entrada

  app.enableCors(); // condiguração de cors para permitir requisições de ourtas origens

  await app.listen(process.env.PORT ?? 4000); //execução da aplicação nest, configuração da porta
}
bootstrap();
