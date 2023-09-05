import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/entities/client.entity';
import { Repository } from 'typeorm';
import { ClientDto } from './dtos/clients.dto';
import { CreateClientDto } from './dtos/create-client.dto';
import { Contacts } from 'src/entities/contacts.entity';

@Injectable()
export class ClientsService {
    constructor(
        @InjectRepository(Client) private clientRepository: Repository<Client>,
        @InjectRepository(Contacts) private contactsRepository: Repository<Contacts>,
    ) {}

    async getAllClients(data: ClientDto) {
        const allClients = await this.clientRepository.find();
        const contact = await this.contactsRepository.find();
        const dataClient = [];
        allClients.forEach((element, index) => {
            dataClient.push({ client: element, major_contact: contact[index]})
        });
        return dataClient;
    }

    async createClient(data: CreateClientDto) {
        const createclient = await this.clientRepository.save(data);
        if(!createclient) {
            return new HttpException('Error al crear usuario', HttpStatus.CONFLICT);
        }
        return createclient;
    }

}
