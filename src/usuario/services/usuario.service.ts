import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';
 
@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private bcrypt: Bcrypt //estamos injetando nossa classe bcrypt aqui no construtor
    ) { }
 
    async findByUsuario(usuario: string): Promise<Usuario | null> {
        return await this.usuarioRepository.findOne({
            where: {
                usuario: usuario
            }
        })
    }
 
    async findAll(): Promise<Usuario[]> {
        return await this.usuarioRepository.find({
          relations:{
            postagem: true
          }
        });
 
    }
 
    async findById(id: number): Promise<Usuario> {
 
        const usuario = await this.usuarioRepository.findOne({
            where: {
                id
            },
			relations:{
            	postagem: true
          	}
        });
 
        if (!usuario)
            throw new HttpException('Usuario não encontrado!', HttpStatus.NOT_FOUND);
 
        return usuario;
 
    }
 
    async create(usuario: Usuario): Promise<Usuario> {
        const buscaUsuario = await this.findByUsuario(usuario.usuario); //aqui buscamos se já existe um usuário como aquele, pra não cadastrar 2x o mesmo email (aqui nesse sistema o usuário tá vinculado ao email)
 
        if (buscaUsuario) //se já tem um usuário com esse email, ele vai dar que o usuário já existe
            throw new HttpException("O Usuario já existe!", HttpStatus.BAD_REQUEST);
 
        //aqui embaixo ele entra só se o usuário não existir:    
        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha) //vai criptografar a senha que o usuário passou || a senha chega no service normal (do jeito que o usuário digitou), mas vai pro banco de dados já criptografada 
        return await this.usuarioRepository.save(usuario);
    }
 
    async update(usuario: Usuario): Promise<Usuario> {
 
        await this.findById(usuario.id); //busca se o id existe
 
        const buscaUsuario = await this.findByUsuario(usuario.usuario); //busca se o usuario existe
 
        if (buscaUsuario && buscaUsuario.id !== usuario.id) //se o usuario/email já existir eeee o id for diferente do id que está passando, ele da erro || ou seja, ele vai fazer a linha debaixo apenas se a pessoa tá tentando atualizar com o email de outra pessoa
            throw new HttpException('Usuário (e-mail) já Cadastrado!', HttpStatus.BAD_REQUEST);

        //se passou pela verificação ele entra aqui embaixo e atualiza o usuario:    
        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha)
        return await this.usuarioRepository.save(usuario);
 
    }
 
}