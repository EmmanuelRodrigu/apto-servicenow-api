import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from 'src/entities/client.entity';
import { AccountClient } from 'src/entities/account-client.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contacts } from 'src/entities/contacts.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, AccountClient, Contacts])],
  providers: [ClientsService],
  controllers: [ClientsController]
})
export class ClientsModule {}
