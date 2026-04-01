import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ILike, Repository } from "typeorm";
import { Postagem } from "../entities/postagem.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult } from "typeorm/browser";


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

        
        async findById(id: number): Promise<Postagem>{ //vai receber como parametro id number e retornar um Promise<Postagem>
        
        const postagem = await this.postagemRepository.findOne({
            where: {
                id 
        } //aqui ele vai salvar no postagem o id passado que ele já verificou se existe no nosso banco também!
            });

        if (!postagem) //ele vai entrar aqui se for nula ou falso (ex: usuário não digitou nada ou digitou algo não válido
            throw new HttpException('Postagem não encontrada', HttpStatus.NOT_FOUND); //aqui ele avisa que a postagem não foi encontrada
    
        return postagem; 

    }
        
        async create(postagem: Postagem): Promise<Postagem>{ //Esse é o método de cadastrar uma nova postagem
            return await this.postagemRepository.save(postagem);
        }

        async update(postagem: Postagem): Promise<Postagem>{

            await this.findById(postagem.id)

            return await this.postagemRepository.save(postagem);
        }

        async delete(id: number) : Promise<DeleteResult>{

            await this.findById(id);
            return await this.postagemRepository.delete(id);
        }
        
        async findAllByTitulo(titulo: string): Promise<Postagem[]>{
            return await this.postagemRepository.find({
                where:{
                    titulo: ILike(`%${titulo}%`)
                }
            })
        }
        
}
