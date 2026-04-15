import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { UsuarioService } from './services/usuario.service';
import { UsuarioController } from './controller/usuario.controller';
import { AuthModule } from '../auth/auth.module';
 
@Module({
  imports: [TypeOrmModule.forFeature([Usuario]),
  forwardRef(() => AuthModule) //quando for executar executa todos os módulos e depois o authmodule, mas Geandro vai explicar mais dia 10/4
], 
  providers: [UsuarioService],
  controllers: [UsuarioController],
  exports: [UsuarioService],
})
export class UsuarioModule {}