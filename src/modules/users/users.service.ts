import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { AccountUser } from 'src/entities/account-user.entity';
import { UserRol } from 'src/entities/user-rol.entity';
import { Rol } from 'src/entities/rol.entity';
import * as bcrypt from 'bcrypt';
import { CreateUser } from './interfaces';
import { FilterUsers } from './dtos/filterUser.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(AccountUser) private accountUserRepository: Repository<AccountUser>,
        @InjectRepository(UserRol) private userRolRepository: Repository<UserRol>,
        @InjectRepository(Rol) private rolRepository: Repository<Rol>,
        ) {}

    async findOne(email: string) {
        const accountUser = await this.accountUserRepository.findOne({
            where: { email: email},
        });
        if (!accountUser) {
            return new HttpException('No se encontro el email', HttpStatus.NOT_FOUND);
        };
        const user = await this.userRepository.findOne({
            where: {id: accountUser.userId}
        });
        if (!user) {
            return new HttpException('Error al encontrar el usuario', HttpStatus.CONFLICT);
        }
        return {accountUser, user};
    }

    async createUser(body: CreateUser) {
        const emailFound = await this.accountUserRepository.findOne({
            where: {
                email: body.user_data.email
            }
        });
        if(emailFound) {
            return new HttpException('El correo ya se encuentra registrado', HttpStatus.CONFLICT);
        };
        const roles = await this.rolRepository.findOne({
            where: {
                rol_name: body.rol
            }
        });
        if (!roles) {
            return new HttpException('El rol no existe', HttpStatus.CONFLICT);
        }
        const user = {
            name: body.name,
            first_last_name: body.first_last_name,
            second_last_name: body.second_last_name,
            full_name: body.name + ' ' + body.first_last_name + ' ' + body.second_last_name
        };
        const newUser = await this.userRepository.save(user);
        const createUserRol = await this.userRolRepository.save({
            rol: roles.id,
            userId: newUser.id,
        });
        if (!createUserRol) {
            return new HttpException('Error al crear usuario', HttpStatus.BAD_REQUEST);
        };
        const passwordHashed = await bcrypt.hash(body.user_data.password, 10);
        const dateNow = new Date();
        const saveDataUser = await this.accountUserRepository.save({
            email: body.user_data.email,
            password: passwordHashed,
            created_at: dateNow,
            isActive: false,
            emailVerified: false,
            userId: newUser.id,
        });
        return { newUser, saveDataUser};
    }

    async searchUserByEmail(email: string) {
        const user = await this.accountUserRepository.findOne({
            where: {
                email: email,
            }
        });
        if(!user) {
            return new HttpException(`el usuario con el email ${email} no existe`, 404)
        }
        return user;
    }

    async allUsers(params: FilterUsers) {
        const allUsers = await this.accountUserRepository.find();
        const dataUsers = await this.userRepository.find();
        const rolUsers = await this.userRolRepository.find();
        const data = [];
        allUsers.forEach((element, index) => {
            data.push({ data: element, user: dataUsers[index], rol: rolUsers[index]})
        });
        
        return data;
    }

    async getUserById(id: number) {
        const dataUser = await this.userRepository.findOne({where: {id}})
        if(!dataUser) {
            return new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
        };
        const profileUser = await this.accountUserRepository.findOne({where: {userId: id}});
        if(!profileUser) {
            return new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
        };
        const rolUser = await this.userRolRepository.findOne({where: {userId: id}});
        if(!rolUser) {
            return new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
        };
        return {
            dataUser: dataUser,
            profileUser: profileUser,
            rol: rolUser.rol
        }
    }

}


