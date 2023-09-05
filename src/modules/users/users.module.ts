import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserRol } from 'src/entities/user-rol.entity';
import { Rol } from 'src/entities/rol.entity';
import { AccountUser } from 'src/entities/account-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRol, Rol, AccountUser,])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
