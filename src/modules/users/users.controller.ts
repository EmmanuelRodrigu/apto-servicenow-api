import { Body, Controller, Post, Get, UseGuards, Param } from '@nestjs/common';
import { BASE_PREFIX_API } from 'src/config/constants';
import { CreateUserDto } from './dtos/createUser.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { ApiTags } from '@nestjs/swagger/dist/decorators';
import { FilterUsers } from './dtos/filterUser.dto';

@Controller(`${BASE_PREFIX_API}/users`)
export class UsersController {
    constructor(
        private userService: UsersService,
    ) {}
    
    @ApiTags('users')
    //@UseGuards(JwtAuthGuard)
    @Get('')
    async allUsers(@Body() params: FilterUsers) {
        console.log(params)
        const user = await this.userService.allUsers(params);
        return user;
    }

    @ApiTags('id')
    @Get('/:id')
    async getUserById(@Param('id') id: number) {
        const getUserById = await this.userService.getUserById(id);
        return getUserById;
    }

    @ApiTags('users')
    @Post('/create')
    async createUser(@Body() body: CreateUserDto) {
        const data = {
            "name": body.name,
            "first_last_name": body.first_last_name,
            "second_last_name": body.second_last_name,
            'rol': body.rol,
            'user_data': {
                email: body.email, password: body.password
            },
        }
        const createUser = await this.userService.createUser(data);
        return createUser;
    }

}
