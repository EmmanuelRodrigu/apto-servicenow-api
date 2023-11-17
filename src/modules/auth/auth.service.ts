import { Injectable, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { AccountUser } from 'src/entities/account-user.entity';
import { Rol } from 'src/entities/rol.entity';
import * as bcrypt from 'bcrypt';
import { LoginWithGoogleDto } from './dtos/login-google.dto';
import { ModulePermissions } from 'src/entities/modules-permissions.entity';
import { AccountClient } from 'src/entities/account-client.entity';
import { Client } from 'src/entities/client.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(AccountUser) private accountUserRepository: Repository<AccountUser>,
    @InjectRepository(ModulePermissions) private modulePermissionsRepository: Repository<ModulePermissions>,
    @InjectRepository(Rol) private rolRepository: Repository<Rol>,
    @InjectRepository(AccountClient) private accountClientRepository: Repository<AccountClient>,
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) { }

  async signInPortal(email: string, password: string) {
    const findClient = await this.accountClientRepository.findOne({ where: { email: email } });
    if (!findClient) {
      return new HttpException('No se encontro el email', HttpStatus.NOT_FOUND);
    };
    
    const isMatch = await bcrypt.compare(password, findClient.password);
    if (!isMatch) {
      return new HttpException('Contraseña incorrecta', HttpStatus.CONFLICT);
    };
    
    const active = await this.accountClientRepository.update(findClient.id, { isActive: true });
    if (!active) {
      return new HttpException('Error al activar usuario', HttpStatus.CONFLICT);
    };

    const client = await this.clientRepository.findOne({ where: { accountClientId: findClient.id } });
    const payload = { id: client.id, username: client.name, email: email };
    console.log(client.id)
    return {
      user: {
        id: client.id,
        email: findClient.email,
        name: client.name,
        rol: 'Client',
      },
      isActive: true,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signIn(credentials: LoginDto) {
    const { email, password } = credentials;
    if(!email.includes('@apto')) {
      return this.signInPortal(email, password);
    }
    const findUser = await this.accountUserRepository.findOne({ where: { email: email } });
    if (!findUser) {
      return new HttpException('No se encontro el email', HttpStatus.NOT_FOUND);
    };

    
    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return new HttpException('Contraseña incorrecta', HttpStatus.CONFLICT);
    };
    
    const active = await this.accountUserRepository.update(findUser.id, { isActive: true });
    if (!active) {
      return new HttpException('Error al activar usuario', HttpStatus.CONFLICT);
    };

    const user = await this.userRepository.findOne({ where: { accountUserId: findUser.id } });
    const payload = { id: user.id, username: user.full_name, email: email };
    
    const modules = await this.modulePermissionsRepository.findOne({
      where: { id: user.rolId }
    })

    let modulesPermissions = [
      modules.dashboard ? 'Dashboard' : null,
      modules.news ? 'News': null,
      modules.clients ? 'Clients' : null,
      modules.projects ? 'Projects' : null,
      modules.requests ? 'Requests' : null,
      modules.users ? 'Users' : null,
      modules.payments ? 'Payments' : null,
    ]
    modulesPermissions = modulesPermissions.filter(module => module != null)

    const rol = await this.rolRepository.findOne({
      where: { id: user.rolId }
    });

    return {
      user: {
        id: user.id,
        email: findUser.email,
        firstName: user.name,
        lastName: user.first_last_name + user.second_last_name,
        fullName: user.full_name,
        rol: rol.rol_name,
      },
      modulesPermissions,
      isActive: true,
      access_token: await this.jwtService.signAsync(payload),
    };
  };

  async signInWithGoogle(credentials: LoginWithGoogleDto) {
    const { email } = credentials;
    const payload = { username: credentials.fullName, email: email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      status: true
    }
  }

  async logOut(email: string) {
    const logOutSession = await this.accountUserRepository.update({ email: email }, { isActive: false, googleAuth: false });
    if (!logOutSession) {
      return new HttpException('Ah ocurrido un error', HttpStatus.CONFLICT);
    }
    return logOutSession;
  }

  async authMePortal(userId: number) {
    const client = await this.clientRepository.findOne({ where: { id: userId } })
    const accountClient = await this.accountUserRepository.findOne({ where: { id: client.accountClientId } })
    if (!accountClient) {
      return new HttpException('El usuario no existe', HttpStatus.CONFLICT);
    };

    return {
      user: {
        id: client.id,
        email: accountClient.email,
        name: client.name,
        rol: 'Client',
      },
    }
  };

  async authMeGoogle(data: { username: string, email: string }) {
    return{
      user: {
        username: data.username,
        email: data.email,
        rol: 'google'
      },
      modulesPermissions: [
        'Dashboard',
        'News',
        'Projects',
        'Requests',
      ]
    }
  }

  async authMe(userData: { userId?: number, username: string, email: string }) {
    console.log(userData)
    if(!userData.userId) {
      return this.authMeGoogle(userData);
    }
    if(!userData.email.includes('@apto')) {
      return this.authMePortal(userData.userId);
    }
    const user = await this.userRepository.findOne({ where: { id: userData.userId } })
    const accountUser = await this.accountUserRepository.findOne({ where: { id: user.accountUserId } })
    if (!accountUser) {
      return new HttpException('El usuario no existe', HttpStatus.CONFLICT);
    };

    const modules = await this.modulePermissionsRepository.findOne({
      where: { id: user.rolId }
    })

    let modulesPermissions = [
      modules.dashboard ? 'Dashboard' : null,
      modules.news ? 'News': null,
      modules.clients ? 'Clients' : null,
      modules.projects ? 'Projects' : null,
      modules.requests ? 'Requests' : null,
      modules.users ? 'Users' : null,
      modules.payments ? 'Payments' : null,
    ]
    modulesPermissions = modulesPermissions.filter(module => module != null);

    const rol = await this.rolRepository.findOne({
      where: { id: user.rolId }
    });

    return {
      user: {
        id: user.id,
        email: accountUser.email,
        firstName: user.name,
        lastName: user.first_last_name + user.second_last_name,
        fullName: user.full_name,
        rol: rol.rol_name,
      },
      modulesPermissions
    }
  };

  async forgotPassword(email: string) {
    const findUser = await this.accountUserRepository.findOne({
      where: { email }
    });

    if(!findUser) {
      return {
        message: 'El correo electronico no existe',
        status: false,
      };
    };
    await this.mailService.sendForgotPassword(email);
    return {
      message: `Se ha enviado un correo a ${email} con las indicaciones para restablecer tu contraseña`,
      status: true,
    }

  };

}