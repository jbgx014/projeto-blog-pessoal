import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Postagem } from "../entities/postagem.entity";
import { InjectRepository } from "@nestjs/typeorm";


@Injectable()
export class PostagemService {

    //Aqui estamos injetando a classe Repository dentro da classe Service
    //A Repository vem lá da typeorm 
    //não vamos precisar fazer instância new classe e this.nomevariavel, o nest.js lida com isso
        constructor(
            @InjectRepository(Postagem)
            private postagemRepository: Repository<Postagem> //Injeção de dependência
        ){}

        //no bloco 1 criamos métodos na controller, mas aqui faremos o certo que é criar na service
        //Esse método async findAll vai retornar uma lista (Postagem[]) e isso é uma promessa, por isso o Promise
        async findAll(): Promise<Postagem[]>{
            return await this.postagemRepository.find(); // esse método find vai fazer o seguinte no banco de dados: select * from tb_postagem. Ele vai retorar uma lista e salvar dentro de Postagem[]
        }
        
}
