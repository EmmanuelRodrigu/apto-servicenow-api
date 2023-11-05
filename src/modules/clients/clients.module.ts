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

@Module({
  imports: [TypeOrmModule.forFeature([Client, AccountClient, Contacts, TaxData, Project, SupportRequest])],
  providers: [ClientsService],
  controllers: [ClientsController]
})
export class ClientsModule {}
