import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeProject } from 'src/entities/type-project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { Client } from 'src/entities/client.entity';
import { Contacts } from 'src/entities/contacts.entity';
import { SupportRequest } from 'src/entities/support-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeProject, Project, Client, Contacts, SupportRequest])],
  providers: [ProjectsService],
  controllers: [ProjectsController]
})
export class ProjectsModule {}
