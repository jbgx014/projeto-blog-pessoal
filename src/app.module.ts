import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Postagem } from './postagem/entities/postagem.entity';
import { PostagemModule } from './postagem/postagem.modules'; 
import { Tema } from './tema/entities/tema.entity';
import { TemaModule } from './tema/tema.modules';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { Usuario } from './usuario/entities/usuario.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({ //forRoot significa que estamos criando o ponto central do typeORM
      type: 'mysql', //tipo de database
      host: 'localhost', //host do database
      port: 3306, //porta do database
      username: 'root', //username do database
      password: 'root', //senha do database - tem que ser a que cadastramos no MySQL
      database: 'db_blogpessoal', //aqui é o nome do database, como colocamos no MySQL
      entities: [Postagem, Tema, Usuario],
      synchronize: true,
    }),
    PostagemModule,
    TemaModule,
    AuthModule,
    UsuarioModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
