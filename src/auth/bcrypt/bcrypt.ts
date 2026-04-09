import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class Bcrypt {

    //vamos criar uma função pra bagunçar a senha/criptografar
    async criptografarSenha(senha: string): Promise<string>{

        let saltos: number = 10; //variavel chamada saltos que inicia com número 10
        return await bcrypt.hash(senha, saltos); //esse método hash pega a senha e faz uma mesclagem, uma bagunçada, esse saltos de 10 vai fazer isso 10x, então ele vai bagunçar a senha 10x
    }

    async compararSenha(senhaDigitada: string, senhabanco: string): Promise<boolean> {//aqui é um método pra comparar a senha que usuário digitou com a senha que está guardada no banco de dados
      return await bcrypt.compare(senhaDigitada, senhabanco); // aqui vai comparar a senhas (a digitada e a do banco) e retornar se é verdadeira ou falso
     }
}