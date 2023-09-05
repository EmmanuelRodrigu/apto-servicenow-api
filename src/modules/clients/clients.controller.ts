import { Body, Controller, Get, Post } from '@nestjs/common';
import { BASE_PREFIX_API } from 'src/config/constants';
import { ClientsService } from './clients.service';
import { ApiTags } from '@nestjs/swagger';
import { ClientDto } from './dtos/clients.dto';
import { CreateClientDto } from './dtos/create-client.dto';

@Controller(`${BASE_PREFIX_API}/clients`)
export class ClientsController {
    constructor(
        private clientsService: ClientsService,
    ) {}

    @ApiTags('allClients')
    @Get('')
    async getAllClients(@Body() body: ClientDto) {
        const allClients = await this.clientsService.getAllClients(body);
        return allClients;
    }

    @ApiTags('create')
    @Post('create')
    async createClient(@Body() body: CreateClientDto) {
        const createClient = await this.clientsService.createClient(body);
        return createClient;
    }
}
