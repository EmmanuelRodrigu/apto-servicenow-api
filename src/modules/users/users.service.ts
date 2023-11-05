import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { AccountUser } from 'src/entities/account-user.entity';
import { Rol } from 'src/entities/rol.entity';
import * as bcrypt from 'bcrypt';
import { CreateUser } from './interfaces';
import { Pagination, IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UsersJira } from './usersJira/usersJira';
import { AccountUsersJira } from 'src/entities/account-user-jira.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(AccountUser) private accountUserRepository: Repository<AccountUser>,
        @InjectRepository(Rol) private rolRepository: Repository<Rol>,
        @InjectRepository(AccountUsersJira) private accountUsersJiraRepository: Repository<AccountUsersJira>,
        private usersJira: UsersJira,
        ) {}

    async findOne(email: string) {
         const accountUser = await this.accountUserRepository.findOne({
             where: { email: email},
         });
         if (!accountUser) {
             return new HttpException('No se encontro el email', HttpStatus.NOT_FOUND);
         };
         const user = await this.userRepository.findOne({
             where: {accountUserId: accountUser.id}
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
        const passwordHashed = await bcrypt.hash(body.user_data.password, 10);
        const dateNow = new Date();
        const saveDataUser = await this.accountUserRepository.save({
            email: body.user_data.email,
            password: passwordHashed,
            created_at: dateNow,
            isActive: false,
            emailVerified: false,
        });

        const user = {
            name: body.name,
            first_last_name: body.first_last_name,
            second_last_name: body.second_last_name,
            full_name: body.name + ' ' + body.first_last_name + ' ' + body.second_last_name,
            accountUserId: saveDataUser.id,
            rolId: roles.id
        };
        const newUser = await this.userRepository.save(user);
        // const createUserRol = await this.userRolRepository.save({
        //     rol: roles.id,
        //     userId: newUser.id,
        // });
        // if (!createUserRol) {
        //     return new HttpException('Error al crear usuario', HttpStatus.BAD_REQUEST);
        // };
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

    async allUsers(options: IPaginationOptions, query: string, order: 'ASC' | 'DESC', rol: number, option: string): Promise<Pagination<User>> {
        const querySearchUser = this.userRepository.createQueryBuilder('user')
        const roles = {
            'MASTER': 1,
            'ADMIN': 2,
        }
        rol ? rol = roles[rol] : '';
        if(query) {
            querySearchUser
                .leftJoinAndSelect(
                    'user.accountUser',
                    'accountUser'
                )
                .having('user.name LIKE :name', { name: `%${query}%`})
                .orHaving('user.id = :id', { id: query })
                .limit(10)
        } else {
            querySearchUser
                .leftJoinAndSelect(
                    'user.accountUser',
                    'accountUser'
                )
                .having(
                    rol ? 'user.rolId = :rolId' : 'user.name LIKE :name', rol ? { rolId: rol } : { name: '%%' } 
                )
                .orderBy(
                    option && option != 'email' ? `user.${option}` : 'user.id', order ? order : 'ASC'
                )
                .addOrderBy(
                    option && option == 'email' ? 'accountUser.email' : 'user.id', order ? order : 'ASC'
                )
                .limit(10)
        }
        
        return paginate<User>(querySearchUser, options);
    }

    async updateUser(body: UpdateUserDto, id: number) {
        const user = await this.userRepository.findOne({where: {id}})
        const passwordHashed = await bcrypt.hash(body.password, 10);
        const dataUser = {
            name: body.name,
            first_last_name: body.first_last_name,
            second_last_name: body.second_last_name,
            rolId: body.rol,
        };
        const account = {
            email: body.email,
            password: passwordHashed,
        }
        const updateUser = await this.userRepository.update({ id: id }, dataUser);
        if(updateUser.affected < 1) {
            return new HttpException('Error al actualizar usuario', HttpStatus.CONFLICT);
        };
        const updateAccount = await this.accountUserRepository.update({ id: user.accountUserId }, account);
        if(updateAccount.affected < 1) {
            return new HttpException('Error al actualizar usuario', HttpStatus.CONFLICT);
        };
        return true;
    }

    async getUserById(id: number) {
        const dataUser = await this.userRepository.findOne({where: {id}})
        if(!dataUser) {
            return new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
        };
        const profileUser = await this.accountUserRepository.findOne({where: {id: dataUser.accountUserId}});
        if(!profileUser) {
            return new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
        };
        const rolUser = await this.rolRepository.findOne({where: {id: dataUser.rolId}});
        if(!rolUser) {
            return new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
        };

        return {
            dataUser: dataUser,
            profileUser: profileUser,
            rol: { value: rolUser.id, label: rolUser.rol_name }
        }
    }

    async getUsersJira() {
        const usersJira = await this.usersJira.getUserOnJira();
        let data = [];
        usersJira.data.map((user) => {
            if(user.locale && user.displayName) {
                data.push(
                    {value: user.accountId, label: user.displayName, avatarUrl: user.avatarUrls['48x48']},
                )
            }
        })

        return data;
    };

    async syncUsers() {
        const usersJira = await this.usersJira.getUserOnJira();
        const usersBd = await this.accountUsersJiraRepository.find();
        let match = [];
        let users = [];
        usersJira.data.forEach((user) => {
            usersBd.forEach((value) => {
                if(user.accountId != value.accountId) {
                    users.push(value);
                } else {
                    users.push(null);
                }
            });
            if(users.includes(null)) {
                users = [];
            } else {
                match.push({
                    displayName: user.displayName,
                    accountId: user.accountId,
                    avatarUrl: user.avatarUrls['48x48'],
                });
            }
        });

        if(match.length > 0) {
            await this.accountUsersJiraRepository.save(match);
            return {
                message: 'Usuarios sincronizados',
                status: true
            };
        }

        return {
            message: 'Los usuarios ya estan sincronizados',
            status: false
        };
    };

}


