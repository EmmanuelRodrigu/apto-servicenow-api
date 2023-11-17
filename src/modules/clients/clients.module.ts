import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from 'src/entities/client.entity';
import { AccountClient } from 'src/entities/account-client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacts } from 'src/entities/contacts.entity';
import { TaxData } from 'src/entities/tax-data.entity';
import { Project } from 'src/entities/project.entity';
import { SupportRequest } from 'src/entities/support-request.entity';
import { S3FilesService } from '../s3-files/s3-files.service';
import { Weekly } from 'src/entities/weekly.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, AccountClient, Contacts, TaxData, Project, SupportRequest, Weekly])],
  providers: [ClientsService, S3FilesService],
  controllers: [ClientsController]
})
export class ClientsModule {}