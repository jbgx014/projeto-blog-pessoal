import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Postagem } from './postagem/entities/postagem.entity';
import { PostagemModule } from './postagem/postagem.modules'; 
import { Tema } from './tema/entities/tema.entity';
import { TemaModule } from './tema/tema.modules';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', //tipo de database
      host: 'localhost', //host do database
      port: 3306, //porta do database
      username: 'root', //username do database
      password: 'root', //senha do database - tem que ser a que cadastramos no MySQL
      database: 'db_blogpessoal', //aqui é o nome do database, como colocamos no MySQL
      entities: [Postagem, Tema],
      synchronize: true,
    }),
    PostagemModule,
    TemaModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
