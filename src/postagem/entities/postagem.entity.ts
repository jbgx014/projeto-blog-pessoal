import { IsNotEmpty } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Tema } from '../../tema/entities/tema.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity({ name: 'tb_postagem' }) // Cria uma tabela chamada tb_postagem
export class Postagem {
  @PrimaryGeneratedColumn() //Cria uma chave primaria e auto increment
  id!: number;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty() //Verifica se o campo está vazio
  @Column({ length: 100, nullable: false }) //Cria uma coluna chamada titulo, com 100 caracteres e não pode ser nulo
  titulo!: string;   

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty()
  @Column({ length: 1000, nullable: false }) //Cria uma coluna chamada texto
  texto!: string; 

  @UpdateDateColumn() // Cria uma coluna chamada data atualização da postagem 
  data!: Date; 

  @ManyToOne(() => Tema, (tema) => tema.postagem, {
    onDelete: "CASCADE"
  })
  tema!: Tema;

  @ManyToOne(() => Usuario, (usuario) => usuario.postagem, {
    onDelete: "CASCADE"
  })
  usuario!: Usuario;
} 
