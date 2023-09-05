import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { AccountUser } from 'src/entities/account-user.entity';
import * as bcrypt from 'bcrypt';
import { LoginWithGoogleDto } from './dtos/login-google.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(AccountUser) private accountUserRepository: Repository<AccountUser>,
    private jwtService: JwtService
  ) {}

  async signIn(credentials: LoginDto) {
    const { email, password } = credentials;
    const findUser = await this.accountUserRepository.findOne({ where: {email: email} });
    if (!findUser) {
        return new HttpException('No se encontro el email', HttpStatus.NOT_FOUND);
    };
    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return new HttpException('Contraseña incorrecta', HttpStatus.CONFLICT);
    };
    const active = await this.accountUserRepository.update(findUser.id, {isActive: true});
    if (!active) {
      return new HttpException('Error al activar usuario', HttpStatus.CONFLICT);
    };
    const user = await this.userRepository.findOne({where: {id: findUser.userId}});
    const payload = { id: user.id, username: user.full_name };
    return {
      user: {
        id: findUser.userId,
        email: findUser.email,
        created_at: findUser.created_at,
        name: user.name,
        first_last_name: user.first_last_name,
        second_last_name: user.second_last_name,
        full_name: user.full_name,
      },
      isActive: true,
      access_token: await this.jwtService.signAsync(payload),
    };
  };

  async signInWithGoogle(credentials: LoginWithGoogleDto) {
    const { email } = credentials;
    const updateSession = await this.accountUserRepository.update({email: email}, {isActive: true, googleAuth: true})
    if(!updateSession) {
      return new HttpException('Error al iniciar sesion con google', HttpStatus.CONFLICT);
    }
    return updateSession;
  }

  async logOut(email: string) {
    const logOutSession = await this.accountUserRepository.update({email: email}, {isActive: false, googleAuth: false});
    if(!logOutSession) {
      return new HttpException('Ah ocurrido un error', HttpStatus.CONFLICT);
    }
    return logOutSession;
  }


}