import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportRequest } from 'src/entities/support-request.entity';
import { User } from 'src/entities/user.entity';
import { Client } from 'src/entities/client.entity';
import { Project } from 'src/entities/project.entity';
import { CommetsRequest } from 'src/entities/commets-request.entity';
import { RequestJira } from './requestsJira/requests-jira';
import { AccountUsersJira } from 'src/entities/account-user-jira.entity';
import { MailModule } from '../mail/mail.module';
import { S3FilesService } from '../s3-files/s3-files.service';
import { DescriptionRequest } from 'src/entities/description-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    SupportRequest, 
    User, 
    Client, 
    Project, 
    CommetsRequest, 
    AccountUsersJira,
    DescriptionRequest
  ]),
  MailModule
  ],
  providers: [RequestsService, RequestJira, S3FilesService],
  controllers: [RequestsController]
})
export class RequestsModule {}
