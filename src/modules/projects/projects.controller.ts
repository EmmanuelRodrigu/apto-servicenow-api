import { Controller, Body, Get, Post, Param, Delete, Put, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { BASE_PREFIX_API } from 'src/config/constants';
import { ProjectsService } from './projects.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from './dtos/createProject.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';

@Controller(`${BASE_PREFIX_API}/projects`)
export class ProjectsController {
    constructor(
        private projectsService: ProjectsService,
    ) {}

    @ApiTags('projects')
    @Get('')
    async allProjects(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
        @Query('query') query: string,
        @Query('order') order: 'ASC' | 'DESC',
        @Query('option') option: string,
    ) {
        const allProjects = await this.projectsService.getAllProjects({ page, limit }, query, order, option);
        return {
            data: allProjects.items, 
            paginate: { 
                page: allProjects.meta.itemCount, 
                pageCount: allProjects.meta.totalPages 
            },
        };
    }
    
    @ApiTags('projects')
    @Get('jira')
    async getAllUsersJira() {
        const getAllUsersJira = await this.projectsService.getProjectsJira()
        return getAllUsersJira;
    }
    
    @ApiTags('projects')
    @Get('sync')
    async syncProjects() {
        const syncProjects = await this.projectsService.syncProjects()
        return syncProjects;
    }

    @ApiTags('projects')
    @Get('/:id')
    async getPtoject(@Param('id') id: number) {
        const getProject = await this.projectsService.getProject(id);
        return getProject;
    }

    @ApiTags('projects')
    @Post('create')
    async createProject(@Body() body: CreateProjectDto) {
        const createProject = await this.projectsService.createProject(body);
        return createProject;
    }

    @ApiTags('projects')
    @Delete('delete/:id')
    async deleteProject(@Param('id') id: number){
        const deleteProject = await this.projectsService.deleteProject(id);
        return deleteProject;
    }

    @ApiTags('projects')
    @Put('update/:id')
    async updateProject(@Param('id') id: number, @Body() body: UpdateProjectDto) {
        const updateProject = await this.projectsService.updateProject(id, body);
        return updateProject;
    }



}
