import { Controller, Body, Get, Post } from '@nestjs/common';
import { BASE_PREFIX_API } from 'src/config/constants';
import { ProjectsService } from './projects.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from './dtos/createProject.dto';

@Controller(`${BASE_PREFIX_API}/projects`)
export class ProjectsController {
    constructor(
        private projectsService: ProjectsService,
    ) {}

    @ApiTags('projects')
    @Get('')
    async allProjects() {
        const allProjects = await this.projectsService.getAllProjects();
        return allProjects;
    }

    @ApiTags('create-project')
    @Post('create')
    async createProject(@Body() body: CreateProjectDto) {
        const createProject = await this.projectsService.createProject(body);
        return createProject;
    }

}
