import { jwtConstants } from './secret-constant';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { AccountUser } from 'src/entities/account-user.entity';
import { ModulePermissions } from 'src/entities/modules-permissions.entity';
import { Rol } from 'src/entities/rol.entity';
import { AccountClient } from 'src/entities/account-client.entity';
import { Client } from 'src/entities/client.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      AccountUser, 
      ModulePermissions, 
      Rol, 
      AccountClient, 
      Client,
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '24h'},
    })
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
