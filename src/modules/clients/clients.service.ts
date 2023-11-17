import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/entities/client.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { DataClient, DataContact } from './interfaces';
import { Contacts } from 'src/entities/contacts.entity';
import { TaxData } from 'src/entities/tax-data.entity';
import { Project } from 'src/entities/project.entity';
import { AccountClient } from 'src/entities/account-client.entity';
import { Pagination, IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { CreateAccountDto } from './dtos/create-account.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { SupportRequest } from 'src/entities/support-request.entity';
import { Weekly } from 'src/entities/weekly.entity';
import { CreateWeeklyDto } from './dtos/create-weekly.dto';
import { S3FilesService } from '../s3-files/s3-files.service';

@Injectable()
export class ClientsService {
    constructor(
        @InjectRepository(Client) private clientRepository: Repository<Client>,
        @InjectRepository(Contacts) private contactsRepository: Repository<Contacts>,
        @InjectRepository(TaxData) private taxDataRepository: Repository<TaxData>,
        @InjectRepository(Project) private projectRepository: Repository<Project>,
        @InjectRepository(AccountClient) private accountClientRepository: Repository<AccountClient>,
        @InjectRepository(Weekly) private weeklyRepository: Repository<Weekly>,
        private s3FilesService: S3FilesService,
    ) {}

    async getAllClients(options: IPaginationOptions, query: string, order: 'ASC' | 'DESC', option: string): Promise<Pagination<Client>> {
        const querySearchClients = this.clientRepository.createQueryBuilder('client');
        if(query) {
            querySearchClients
                .having('client.name LIKE :name', { name: `%${query}%` })
                .orHaving('client.id = :id', { id: query })
                .limit(10)
        } else {
            querySearchClients.orderBy(option ? `client.${option}` : 'client.id', order ? order : 'ASC');
        }

        return paginate<Client>(querySearchClients, options);

        // const allClients = await this.clientRepository.find();
        // const allContacts = await this.contactsRepository.find();
        // let matchData = [];
        // allClients.forEach((client, index) => {
        //     allContacts.map((contact, i) => {
        //         client.id === contact.clientId && contact.is_major_contact ? matchData.push({client, contact}) : ''
        //     })
        // })
        // return matchData;
    }

    async getAllContacts(options: IPaginationOptions): Promise<Pagination<Contacts>> {
        const querySearchContacts = this.contactsRepository.createQueryBuilder('contact');
        querySearchContacts.orderBy('contact.clientId', 'ASC');
        return paginate<Contacts>(querySearchContacts, options);
    }

    async getClientsOptions() {
        const clients = await this.clientRepository.find();
        const options = clients.map((client) => {
            return {value: client.id, label: client.name + ' - ' + client.rfc}
        })
        return options;
    }

    async createClient(dataClient: DataClient, dataMajorContact: DataContact, dataSecondaryContact: DataContact) {
        const searchByRfc = await this.clientRepository.findOne({
            where: { rfc: dataClient.rfc }
        });
        if(searchByRfc) {
            return new HttpException('El RFC ya se encuentra registrado', HttpStatus.CONFLICT);
        };
        const searchMajorContact = await this.contactsRepository.findOne({
            where: { email: dataMajorContact.email}
        })
        if(searchMajorContact) {
            return new HttpException('El email de contacto principal ya se encuentra registrado', HttpStatus.CONFLICT);
        };
        const createClient = await this.clientRepository.save(dataClient);
        let createSecondaryContact: Contacts;
        if(dataSecondaryContact.email) {
            const searchSecondaryContact = await this.contactsRepository.findOne({
                where: { email: dataSecondaryContact.email}
            })
            if(searchSecondaryContact) {
                return new HttpException('El email de contacto secundario ya se encuentra registrado', HttpStatus.CONFLICT);
            };
            createSecondaryContact = await this.contactsRepository.save({
                ...dataSecondaryContact,
                is_major_contact: false,
                clientId:  createClient.id
            })
        }

        const createMajorContact = await this.contactsRepository.save({
            ...dataMajorContact,
            is_major_contact: true,
            clientId: createClient.id,
        })

        return {
            createClient, 
            createMajorContact, 
            createSecondaryContact
        }
    }

    async updateClient(id: number, dataClient: DataClient, dataMajorContact: DataContact, dataSecondaryContact: DataContact) {
        const client = await this.clientRepository.find({
            where: { id: id },
        });

        if(!client) {
            return new HttpException('El RFC no se encuentra registrado', HttpStatus.CONFLICT);
        };

        const updateClient = await this.clientRepository.update({ id: id }, dataClient);
        if(updateClient.affected < 1) {
            return new HttpException('Error al actualizar cliente', HttpStatus.CONFLICT);
        };

        const majorContact = await this.contactsRepository.find({
            where: { clientId: id, is_major_contact: true }
        });
        
        const updateMajorContact = await this.contactsRepository.update({ email: majorContact[0].email }, dataMajorContact)
        if(updateMajorContact.affected < 1) {
            return new HttpException('Error al actualizar contacto principal', HttpStatus.CONFLICT);
        };

        const secondaryContact = await this.contactsRepository.find({
            where: { clientId: id, is_major_contact: false},
        });
        if(secondaryContact.length < 1) {
            const saveContact = {
                ...dataSecondaryContact,
                clientId: id
            }
            const createSecondaryContact = await this.contactsRepository.save(saveContact);
            if(!createSecondaryContact) {
                return new HttpException('Error al agregar contacto secundario', HttpStatus.CONFLICT);
            };
        } else {
            const updateSecondaryContact = await this.contactsRepository.update({ email: secondaryContact[0].email }, dataSecondaryContact);
            if(updateSecondaryContact.affected < 1) {
                return new HttpException('Error al actualizar contacto secundario', HttpStatus.CONFLICT);
            };
        }

        return true;

    }

    async detailsClient(id: number) {
        const dataClient = await this.clientRepository.findOne({
            where: { id },
        });
        if (!dataClient) {
            return new HttpException('El cliente no existe', HttpStatus.NOT_FOUND);
        };
        const contactsClient = await this.contactsRepository.find({
            where: { clientId: id },
        })
        if (!contactsClient) {
            return new HttpException('Error al obtener contactos del cliente', HttpStatus.CONFLICT);
        };
        let major_contact;
        let secondary_contact;
        contactsClient.map((contact) => {
            contact.is_major_contact ? major_contact = contact : secondary_contact = contact;
        });
        let accountClient;
        if(dataClient.accountClientId) {
            accountClient = await this.accountClientRepository.findOne({
                where: {  id: dataClient.accountClientId }
            });
        };
        return { 
            dataClient: dataClient ,
            accountClient: accountClient ,
            major_contact: major_contact ,
            secondary_contact: secondary_contact,
         }
    }

    async deleteClient(id: number) {
        const clientExist = await this.clientRepository.findBy({id});
        if(!clientExist) {
            return new HttpException('El cliente no existe', HttpStatus.NOT_FOUND);
        };

        const deleteProject = await this.projectRepository.delete({clientId: clientExist[0].id})
        if(!deleteProject) {
            return new HttpException('Error al eliminar el projecto', HttpStatus.CONFLICT);
        }

        const deleteContacts = await this.contactsRepository.delete({clientId: id});
        if(!deleteContacts) {
            return new HttpException('Error al eliminar contactos', HttpStatus.CONFLICT);
        };
        
        const deleteAccountClient = await this.accountClientRepository.delete({id: clientExist[0].accountClientId});
        if(!deleteAccountClient) {
            return new HttpException('Error al eliminar cliente', HttpStatus.CONFLICT);
        };
        
        const deleteDocuments = await this.weeklyRepository.delete({ clientId: id });
        if(!deleteDocuments) {
            return new HttpException('Error al eliminar cliente', HttpStatus.CONFLICT);
        };

        const deleteClient = await this.clientRepository.delete({id});
        if(!deleteClient) {
            return new HttpException('Error al eliminar cliente', HttpStatus.CONFLICT);
        };
        

        
        return true;
         
    }

    async getTaxData() {
        const data = await this.taxDataRepository.find()
        const taxData = data.map((v) => {
            return { value: v.id, label: v.name_tax_data }
        });

        return taxData;
    }

    async getTaxDataById(id: number) {
        const taxData = await this.getTaxData();
        const client = await this.clientRepository.findOne({
            where: { id }
        });
        const taxDataById = await this.taxDataRepository.findOne({
            where: { id: client.dataTaxId }
        });
        const dataClient = { value: taxDataById.id, label: taxDataById.name_tax_data };
        return { taxData: taxData, taxDataClient: dataClient}
    }

    async createAccount(body: CreateAccountDto, clientId: number) {
        const client = await this.clientRepository.findOne({
            where: {
                id: clientId
            }
        });
        if(!client) {
            return new HttpException('El cliente no existe', HttpStatus.NOT_FOUND);
        };

        const passwordHashed = await bcrypt.hash(body.password, 10);
        const data = {
            email: body.email,
            password: passwordHashed,
            phone: body.phone,
            isActive: true,
            emailVerified: false,
            clientId: clientId
        };
        const createAccountClient = await this.accountClientRepository.save(data);
        if(!createAccountClient) {
            return new HttpException('Error al crear cuenta de cliente', HttpStatus.CONFLICT);
        };
        await this.clientRepository.update({ id: clientId }, { accountClientId: createAccountClient.id });
        return {
            message: 'Cuenta creada exitosamente',
            status: true,
        };

    };

    async changePassword(body: ChangePasswordDto) {
        const passwordHashed = await bcrypt.hash(body.password, 10);
        const account = await this.accountClientRepository.update({ email: body.email }, { password: passwordHashed });
        if(account.affected > 0) {
            return {
                message: 'Contraseña actualizada',
                status: true,
            }
        }
        return {
            message: 'Error al actualizar contraseña',
            status: false,
        }
    };

    async getDataClient(clientId: number) {
        const client = await this.clientRepository.findOne({
            where: {
                id: clientId
            }
        });
        
        const project = await this.projectRepository.findOne({
            where: {
                clientId: clientId
            }
        });

        return {
            nameClient: client.name,
            rfc: client.rfc,
            nameProject: project.name,
            createdAt: project.created_at,
            avatarUrl: project.avatar_url,
        };
    };

    async createWeekly(clientId: number, body: CreateWeeklyDto, file: Express.Multer.File) {
        const uploadFile = await this.s3FilesService.uploadFile(file);
        const data = {
            ...body,
            urlFile: uploadFile.Location,
            clientId: clientId,
        };
        const saveWeekly = await this.weeklyRepository.save(data);
        if(!saveWeekly) {
            throw new HttpException('Error al crear avance semanal', HttpStatus.CONFLICT)
        };

        return {
            message: 'Avance semanal creado exitosamente',
            status: true,
        };
    };

    async weeklyForClient(clientId: number) {
        return await this.weeklyRepository.find({
            where: { clientId }
        });
    };

}
