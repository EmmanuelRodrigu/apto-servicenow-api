import { Body, Controller, Get, Param, Post, Put, Delete, Query, DefaultValuePipe, ParseIntPipe, UseInterceptors, UseGuards, UploadedFile } from '@nestjs/common';
import { BASE_PREFIX_API, FOR_PAGE, DEFAULT_PAGE } from 'src/config/constants';
import { ClientsService } from './clients.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateClientDto } from './dtos/create-client.dto';
import { UpdateClientDto } from './dtos/update-client.dto';
import { CreateAccountDto } from './dtos/create-account.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { CreateWeeklyDto } from './dtos/create-weekly.dto';

@Controller(`${BASE_PREFIX_API}/clients`)
export class ClientsController {
    constructor(
        private clientsService: ClientsService,
    ) {}

    @ApiTags('clients')
    @Get('')
    async getAllClients(
        @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe) page: number = DEFAULT_PAGE,
        @Query('limit', new DefaultValuePipe(FOR_PAGE), ParseIntPipe) limit: number = FOR_PAGE,
        @Query('query') query: string,
        @Query('order') order: 'ASC' | 'DESC',
        @Query('option') option: string,
    ) {
        const allClients = await this.clientsService.getAllClients({ page, limit }, query, order, option);
        const allContacts = await this.clientsService.getAllContacts({ page, limit });
        let matchData = [];
        allClients.items.forEach((client) => {
            allContacts.items.map((v) => {
                v.is_major_contact && client.id === v.clientId ? matchData.push({
                    id: client.id,
                    rfc: client.rfc,
                    name: client.name,
                    full_name: v.name + v.last_name,
                    email: v.email,
                    phone: v.phone
                }) : ''
            })
        })
        return {data: matchData, paginate:{page: allClients.meta.itemCount, pageCount: allClients.meta.totalPages}};
    };

    @ApiTags('clients')
    @Get('options')
    async getClientsOptions() {
        const options = await this.clientsService.getClientsOptions();
        return options;
    }

    @ApiTags('clients')
    @Post('create')
    async createClient(@Body() body: CreateClientDto) {
        const dataClient = {
            person: body.person,
            dataTaxId: body.tax_data,
            rfc: body.rfc,
            reason_social: body.reason_social,
            name: body.bussiness_name,
            street: body.street,
            cp: body.cp,
            municipality: body.municipality,
            estate: body.estate,
        }

        const dataMajorContact = {
            name: body.name_contact,
            last_name: body.last_name_contact,
            email: body.email_contact,
            phone: body.phone_contact,
            area: body.area_contact,
            is_major_contact: true,
        }

        const dataSecondaryContact = {
            name: body.secondary_contact.name_scontact,
            last_name: body.secondary_contact.last_name_scontact,
            email: body.secondary_contact.email_scontact,
            phone: body.secondary_contact.phone_scontact,
            area: body.secondary_contact.area_scontact,
            is_major_contact: false,
        }
        const createClient = await this.clientsService.createClient(dataClient, dataMajorContact, dataSecondaryContact);
        return createClient;
    }

    @ApiTags('clients')
    @Get('taxdata')
    async getTaxData() {
        const taxData = await this.clientsService.getTaxData()
        return taxData;
    }

    @ApiTags('clients')
    @Get('taxdata/:id')
    async getTaxDataById(@Param('id') id: number) {
        const taxDataById = await this.clientsService.getTaxDataById(id);
        return taxDataById;
    }
    
    @ApiTags('clients')
    @Get('/:id')
    async detailsClient(@Param('id') id: number) {
        const detailsClient = await this.clientsService.detailsClient(id);
        return detailsClient;
    }

    @ApiTags('clients')
    @Put('update/:id')
    async updateClient(@Body() body: UpdateClientDto, @Param('id') id: number ) {
        const dataClient = {
            person: body.person,
            dataTaxId: body.tax_data,
            rfc: body.rfc,
            reason_social: body.reason_social,
            name: body.bussiness_name,
            street: body.street,
            cp: body.cp,
            municipality: body.municipality,
            estate: body.estate,
        }

        const dataMajorContact = {
            name: body.name_contact,
            last_name: body.last_name_contact,
            email: body.email_contact,
            phone: body.phone_contact,
            area: body.area_contact,
            is_major_contact: true,
        }

        const dataSecondaryContact = {
            name: body.secondary_contact.name_scontact,
            last_name: body.secondary_contact.last_name_scontact,
            email: body.secondary_contact.email_scontact,
            phone: body.secondary_contact.phone_scontact,
            area: body.secondary_contact.area_scontact,
            is_major_contact: false,
        }
        const updateClient = await this.clientsService.updateClient(id, dataClient, dataMajorContact, dataSecondaryContact)
        return updateClient;
    }

    @ApiTags('clients')
    @Delete('delete/:id')
    async deleteclient(@Param('id') id: number) {
        const deleteClient = await this.clientsService.deleteClient(id);
        return deleteClient;
    }

    @ApiTags('clients')
    @Post('create-account/:clientId')
    async createAccount(
        @Body() body: CreateAccountDto,
        @Param('clientId', ParseIntPipe) clientId: number,
    ) {
        const createAccount = await this.clientsService.createAccount(body, clientId)
        return createAccount;
    }

    @ApiTags('clients')
    @Get('/:clientId/data-client')
    async getDataClient(
        @Param('clientId', ParseIntPipe) clientId: number,
    ) {
        const getDataClient = await this.clientsService.getDataClient(clientId);
        return getDataClient;
    };

    @ApiTags('clients')
    @Put('change-password')
    async changePassword(
        @Body() body: ChangePasswordDto,
    ) {
        return await this.clientsService.changePassword(body);
    };

    @ApiTags('clients')
    //@UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    @Post('/:clientId/create/weekly')
    async createWeekly(
        @Param('clientId', ParseIntPipe) clientId: number,
        @Body() body: CreateWeeklyDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return await this.clientsService.createWeekly(clientId, body, file);
    };

    @ApiTags('clients')
    @Get('/:clientId/weekly')
    async getWeeklyForClient(
        @Param('clientId', ParseIntPipe) clientId: number,
    ) {
        return await this.clientsService.weeklyForClient(clientId);
    }

}
