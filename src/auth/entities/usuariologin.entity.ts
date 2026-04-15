import { ApiProperty } from "@nestjs/swagger";

export class UsuarioLogin {
    //aqui não precisa de id, só usuario e senha pra gente pegar no banco de dados
    //aqui não precisa de typeorm, é um usuário só de uso do back end

    @ApiProperty() 
    public usuario!: string;
    @ApiProperty() 
    public senha!: string;
}