import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { TypeProject } from 'src/entities/type-project.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dtos/createProject.dto';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project) private projectRepository: Repository<Project>,
        @InjectRepository(TypeProject) private typeProjectRepository: Repository<TypeProject>,
    ) {}

        async getAllProjects() {
            const projects = await this.projectRepository.find();
            const typeProject = await this.typeProjectRepository.find();
            const data = [];
            projects.forEach((element, index) => {
                data.push({ data: element, typeProject: typeProject[index]})
            });
            
            return data;
        }

        async createProject(data: CreateProjectDto) {
            const { typeProject } = data;
            const projects = await this.typeProjectRepository.find();
            const saveProject = await this.projectRepository.save(data)
            if(!saveProject) {
                return new HttpException('Error al crear proyecto', HttpStatus.CONFLICT);
            }
            return saveProject;
        }

}
