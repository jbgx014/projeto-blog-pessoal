import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ILike, Repository } from "typeorm";
import { Postagem } from "../entities/postagem.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult } from "typeorm/browser";
import { TemaService } from "../../tema/services/tema.service";


@Injectable() //O injectable que fala pro Nest que ele pode precisar administrar essa classe, se for o caso, aí colocamos isso lá no provider da postagem.module pra de fato fazer ele controlar
export class PostagemService {

    //Aqui estamos injetando a classe Repository dentro da classe Service
    //A Repository vem lá da typeorm 
    //não vamos precisar fazer instância new classe e this.nomevariavel, o nest.js lida com isso
        constructor(
            @InjectRepository(Postagem)
            private postagemRepository: Repository<Postagem>, //Injeção de dependência
            private temaService: TemaService
        ){}

        //no bloco 1 criamos métodos na controller, mas aqui faremos o certo que é criar na service
        //Esse método async findAll vai retornar uma lista (Postagem[]) e isso é uma promessa, por isso o Promise
        async findAll(): Promise<Postagem[]>{
            return await this.postagemRepository.find({ // esse método find vai fazer o seguinte no banco de dados: select * from tb_postagem. Ele vai retorar uma lista e salvar dentro de Postagem[]

                relations: {
                    tema: true
                }
            }); 
        }

        
        async findById(id: number): Promise<Postagem>{ //vai receber como parametro id number e retornar um Promise<Postagem>
        
        const postagem = await this.postagemRepository.findOne({
            where: {
                id 
        }, //aqui ele vai salvar no postagem o id passado que ele já verificou se existe no nosso banco também!
        relations: {
                    tema: true
                }
            });

        if (!postagem) //ele vai entrar aqui se for nula ou falso (ex: usuário não digitou nada ou digitou algo não válido
            throw new HttpException('Postagem não encontrada', HttpStatus.NOT_FOUND); //aqui ele avisa que a postagem não foi encontrada
    
        return postagem; 

    }
        // MUDAMOS O CREATE AQUI DO QUE ESTAVA NO COOKBOOK, GEANDRO DEIXOU MELH0R
        async create(postagem: Postagem): Promise<Postagem>{ //Esse é o método de cadastrar uma nova postagem
            
            if (postagem.tema != null) {
           
            // eslint-disable-next-line prefer-const
            let tema = await this.temaService.findById(postagem.tema.id)
 
            if (!tema)
                throw new HttpException('Tema não encontrado!', HttpStatus.NOT_FOUND);
 
              return await this.postagemRepository.save(postagem);
        }else{
            throw new HttpException('Tema nao pode ser nulo!', HttpStatus.NOT_FOUND);
        }
   
    }

        // async update(postagem: Postagem): Promise<Postagem>{

        //     await this.findById(postagem.id)

        //     await this.temaService.findById(postagem.tema.id)

        //     return await this.postagemRepository.save(postagem);
        // }

        // MUDAMOS O UPDATE AQUI DO QUE ESTAVA NO COOKBOOK, GEANDRO DEIXOU MELH0R

        async update(postagem: Postagem): Promise<Postagem> {
       
        // eslint-disable-next-line prefer-const
        let buscaPostagem: Postagem = await this.findById(postagem.id);
 
        if (!buscaPostagem || !postagem.id)
            throw new HttpException('Postagem não encontrada!', HttpStatus.NOT_FOUND);
 
        if (postagem.tema){
           
            // eslint-disable-next-line prefer-const
            let tema = await this.temaService.findById(postagem.tema.id)
               
            if (!tema)
                throw new HttpException('Tema não encontrado!', HttpStatus.NOT_FOUND);
               
            return await this.postagemRepository.save(postagem);
   
        }else{
            throw new HttpException('Tema nao pode ser nulo!', HttpStatus.NOT_FOUND);
        }
       
    }



        async delete(id: number) : Promise<DeleteResult>{

            await this.findById(id);
            return await this.postagemRepository.delete(id);
        }
        
        async findAllByTitulo(titulo: string): Promise<Postagem[]>{
            return await this.postagemRepository.find({
                where:{
                    titulo: ILike(`%${titulo}%`)
                },
                relations: {
                    tema: true
                }
            })
        }
        
}
