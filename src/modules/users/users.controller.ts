import { Body, Controller, Post, Get, UseGuards, Param, Query, DefaultValuePipe, ParseIntPipe, Put } from '@nestjs/common';
import { BASE_PREFIX_API, FOR_PAGE, DEFAULT_PAGE } from 'src/config/constants';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { ApiTags } from '@nestjs/swagger/dist/decorators';

@Controller(`${BASE_PREFIX_API}/users`)
export class UsersController {
    constructor(
        private userService: UsersService,
    ) {}
    
    @ApiTags('users')
    //@UseGuards(JwtAuthGuard)
    @Get('')
    async allUsers(
        @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe) page: number = DEFAULT_PAGE,
        @Query('limit', new DefaultValuePipe(FOR_PAGE), ParseIntPipe) limit: number = FOR_PAGE,
        @Query('query') query: string,
        @Query('order') order: 'ASC' | 'DESC',
        @Query('rol') rol: number,
        @Query('option') option: string,
    ) {
        const user = await this.userService.allUsers({page, limit}, query, order, rol, option);
        return {data: user.items, paginate: { page: user.meta.itemCount, pageCount: user.meta.totalPages }};
    }
    
    @Get('/jira')
    async getUsersJira() {
        const getUsersJira = await this.userService.getUsersJira();
        return getUsersJira;
    }

    @Get('/synchronizer')
    async syncUsers(){
        return await this.userService.syncUsers();
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

    @ApiTags('update')
    @Put('/update/:id')
    async updateUser(
        @Body() body: UpdateUserDto,
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.userService.updateUser(body, id);
    };



}
