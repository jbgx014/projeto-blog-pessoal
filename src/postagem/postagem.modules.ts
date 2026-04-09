import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TemaModule } from "../tema/tema.modules";
import { Postagem } from "./entities/postagem.entity";
import { PostagemService } from "./services/postagem.service";
import { PostagemController } from "./controllers/postagem.controller";
import { TemaService } from "../tema/services/tema.service";
 
@Module({
    imports: [TypeOrmModule.forFeature([Postagem]), TemaModule], //Importa a Postagem como uma entidade TypeORM
    providers: [PostagemService, TemaService], //Define o PostagemService como um provedor (no provider colocamos classes que vão estar disponíveis dentro do nosso código inteioro, ficam administradas pelo Nest)
    controllers: [PostagemController],
    exports: [TypeOrmModule] //Exporta o TypeOrmModule
})
export class PostagemModule {}