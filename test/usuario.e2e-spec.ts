import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import request from 'supertest';
 
describe('Testes dos Módulos Usuário e Auth (e2e)', () => {  // descrição do teste e2e
  let token: string;
  let usuarioId: any;
  let app: INestApplication; // declara a variável app do tipo INestApplication
 
  beforeAll(async () => {  // configurações iniciais do teste que serão executadas antes de todos os testes uma vez so no inicio.
    const moduleFixture: TestingModule = await Test.createTestingModule({ // cria o modulo de teste nest e configura as dependências do modulo
      imports: [
        TypeOrmModule.forRoot({ // configuração do typeorm com o banco em memoria
          type: "sqlite",  // tipo de banco
          database: ":memory:", // banco em memoria, sera apagado ao final do teste
          entities: [__dirname + "./../src/**/entities/*.entity.ts"], // caminho dos arquivos de entidades
          synchronize: true, // sincroniza as entidades com o banco
          dropSchema: true // apaga o banco ao final do teste
        }),
        AppModule], // importa o modulo principal para que as dependências sejam resolvidas
    }).compile(); // compila o modulo
 
    app = moduleFixture.createNestApplication();  // cria a aplicação nest
    app.useGlobalPipes(new ValidationPipe()); // configuração de validação de dados de entrada
    await app.init(); // inicializa a aplicação nest e configuração da porta do servidor que é a porta 4000
  });
 
  //toda vez que eu quero testar sempre começo com "it", depois coloco a descrição entre aspas duplas e depois vem o teste em si
  // testes
  it("01 - Deve criar um novo usuário", async () => { //testa se o usuário pode ser criado
    const resposta =  await request(app.getHttpServer()) //aqui estamos enviando uma requisição via post. /request trabalha com requisições, faz mais ou menos o papel da controller, aí colocamos o http server que seria ali o método http, no caso é o post, e vamos passar depois o caminho que nesse caso é usuarios/cadastrar, por fim damos o send que é o botão pra enviar a requisição e dentro dele passamos o JSON
    .post('/usuarios/cadastrar').send({
      nome: "capivara",
      usuario: "capivara@gmail.com",
      senha: "12345678",
      foto: "-"
    }).expect(201); //espera resposta com o status code 201 ou 400

    usuarioId = resposta.body.id; //aqui estamos guardando o id que está sendo criado dentro dessa variavel aqui, então estou guardando o id de retorno na hora que crio o usuário e ele da certo, aí vamos guardar esse id porque podemos precisar em próximos testes

  }); 

  it("02 - Não Deve Cadastrar um Usuário Duplicado", async () => {
    await request(app.getHttpServer()) //esse não tem o const resposta, diferente do primeiro it que fizemos porque não vamos salvar um id
    .post('/usuarios/cadastrar')
    .send({
      nome: 'Root',
      usuario: 'capivara@gmail.com', //aqui ele não vai deixar cadastrar porque já temos esse email cadastrado e na nossa service criamos um método pra não deixar cadastrar o mesmo email mais de uma vez
      senha: 'rootroot',
      foto: '-',
    })
    .expect(400);

  });

    it("03 - Deve Autenticar o Usuário (login)", async () => {
      const resposta = await request(app.getHttpServer())
      .post("/usuarios/logar")
      .send({
        usuario: 'capivara@gmail.com',
        senha: '12345678',
      })
      .expect(200)
      token = resposta.body.token;
  
  });

  it("04 - Deve Listar todos os Usuários", async () => {
    return await request(app.getHttpServer())
    .get('/usuarios/all')
    .set('Authorization', `${token}`)
    .expect(200)
  });

  it("05 - Deve Atualizar um usuário", async () => {
    return request(app.getHttpServer())
    .put('/usuarios/atualizar')
    .set('Authorization', `${token}`)
    .send({
      id: usuarioId,
      nome: 'Capivara Atualizada',
      //usuario: 'capivaranovo@gmail.com',
      usuario: 'capivara@gmail.com',
      senha: '12345678',
      foto: '-',
    })
    .expect(200)
    .then( resposta => {//esse then vai acessar e verificar se a alteração foi realmente efetuada
       expect("Capivara Atualizada").toEqual(resposta.body.nome);
    })
  })
 
 
  afterAll(async () => { // configurações finais do teste que são executadas depois de todos os testes uma vez so no final
    await app.close(); // fecha a aplicação nest
  });
  //o que ele vai fazer nas 3 linhas de cima é: expect( **Conteúdo Enviado** ).toEqual( **Conteúdo Recebido** )
 
});