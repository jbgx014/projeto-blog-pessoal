import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Postagem } from "./entities/postagem.entity";
import { PostagemService } from "./services/postagem.service";
import { PostagemController } from "./controllers/postagem.controller";
 
@Module({
    imports: [TypeOrmModule.forFeature([Postagem])], //Importa a Postagem como uma entidade TypeORM
    providers: [PostagemService], //Define o PostagemService como um provedor
    controllers: [PostagemController],
    exports: [TypeOrmModule] //Exporta o TypeOrmModule
})
export class PostagemModule {}