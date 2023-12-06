import axios from 'axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/entities/project.entity';
import { TypeProject } from 'src/entities/type-project.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dtos/createProject.dto';
import { Client } from 'src/entities/client.entity';
import { Contacts } from 'src/entities/contacts.entity';
import { SupportRequest } from 'src/entities/support-request.entity';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { GetAllProjects } from './projectsJira/get-all-projects';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project) private projectRepository: Repository<Project>,
        @InjectRepository(TypeProject) private typeProjectRepository: Repository<TypeProject>,
        @InjectRepository(Client) private clientRepository: Repository<Client>,
        @InjectRepository(Contacts) private contactsRepository: Repository<Contacts>,
        @InjectRepository(SupportRequest) private requestRepository: Repository<SupportRequest>,
    ) {}

        async getUsersJira() {
            const username = process.env.JIRA_USERNAME;
            const api_key = process.env.JIRA_KEY;
            const domain = process.env.JIRA_DOMAIN;

            const auth = {
                username: username,
                password: api_key,
            }

            try {

                const baseUrl = `https://${domain}.atlassian.net`;
                const config = {
                    method: 'get',
                    url: `${baseUrl}/rest/api/3/users`,
                    headers: { 'Content-Type': 'application/json' },
                    auth: auth,
                };

                const response = await axios.request(config);
                return response.data;

            } catch(error) {
                console.log('error: ', error)
            }

        }

        async getProjectsJira() {
            const username = process.env.JIRA_USERNAME;
            const api_key = process.env.JIRA_KEY;
            const domain = process.env.JIRA_DOMAIN;

            const auth = {
                username: username,
                password: api_key,
            };

            try {

                const baseUrl = `https://${domain}.atlassian.net`;
                const config = {
                    method: 'get',
                    url: `${baseUrl}/rest/api/3/project/search`,
                    headers: { 'Content-Type': 'application/json'},
                    params: { "maxResults": 100 },
                    auth: auth,
                };

                const response = await axios.request(config);
                return response.data

            } catch(error) {
                console.log('error: ', error);
            };
        }

        async createProjectOnJira() {
            try {

                const username = process.env.JIRA_USERNAME;
                const api_key = process.env.JIRA_KEY;
                const domain = process.env.JIRA_DOMAIN;

                const leadAccountId = process.env.ACCOUNT_ID;
                const baseUrl = `https://${domain}.atlassian.net`;
                const projKey = 'TT'

                const data = {
                    "key": projKey,
                    "name": 'test',
                    "projectTypeKey": 'software',
                    "leadAccountId": leadAccountId,
                }

                const auth = {
                    username: username,
                    password: api_key,
                };

                const config = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    auth: auth
                }

                const response = await axios.post(`${baseUrl}/rest/api/3/project`, data, config);
                console.log(response.data)

            } catch(error) {
                console.log(error.response.data.errors)
                return new HttpException(error, HttpStatus.BAD_REQUEST)
            }
        }

        async getProject(id: number) {
            const project = await this.projectRepository.findOne({
                where: {
                    id: id
                },
            });
            let clientOfProject;
            if(project.clientId) {
                clientOfProject = await this.clientRepository.findOne({
                    where: {
                        id: project.clientId
                    }
                });
                clientOfProject = { value: clientOfProject.id, label: clientOfProject.name + ' - ' + clientOfProject.rfc}
            }
            
            const dataClients = await this.clientRepository.find();
            let clients = [];
            dataClients.map((client) => {
                clients.push({
                    value: client.id,
                    label: client.name + ' - ' + client.rfc
                })
            });

            return {
                dataProject: project,
                clientOfProject: clientOfProject,
                clients: clients,
            }
            
        };

        async getAllProjects(options: IPaginationOptions, query: string, order: 'ASC' | 'DESC', option: string) {
            const querySearchProjects = this.projectRepository.createQueryBuilder('project')
            if(query) {
                querySearchProjects
                    .leftJoinAndSelect(
                        'project.client',
                        'client'
                    )
                    .having('project.name LIKE :name', { name: `%${query}%`})
                    .orHaving('project.id = :id', { id: query })
                    .limit(10)
            } else {
                querySearchProjects
                    .leftJoinAndSelect(
                        'project.client', 
                        'client'
                    )
                    .orderBy(
                        option && option != 'rfc' && option != 'name_client' ? `project.${option}` : 'project.id', order ? order : 'ASC'
                    )
                    .addOrderBy(
                        option && option == 'rfc' ? 'client.rfc' : 'project.id', order ? order : 'ASC'
                    )
                    .addOrderBy(
                        option && option == 'name_client' ? 'client.name' : 'project.name', order ? order : 'ASC'
                    )
                    .limit(10)
            }

            return paginate<Project>(querySearchProjects, options);

            // const projects = await this.projectRepository.find();
            // const clients = await this.clientRepository.find();
            // const contacts = await this.contactsRepository.find()
            // let data = [];
            // projects.forEach((project) => {
            //     clients.map((client, index) => {
            //         project.clientId == client.id && project.clientId == contacts[index].clientId && contacts[index].is_major_contact
            //         ? data.push({
            //             id: project.id,
            //             name_project: project.name,
            //             rfc: client.rfc,
            //             name_client: client.name,
            //             contact: contacts[index].name,
            //             created_at: project.created_at
            //         }) 
            //         : ''
            //     });
            // });
            // return data;
        }

        async createProject(data: CreateProjectDto) {
            const { typeProject } = data;
            const projects = await this.typeProjectRepository.find();
            const saveProject = await this.projectRepository.save(data)
            if(!saveProject) {
                return new HttpException('Error al crear proyecto', HttpStatus.CONFLICT);
            }
            return saveProject;
        };

        async deleteProject(id: number) {
            const existProject = await this.projectRepository.findOne({
                where: { id: id },
            });
            if(!existProject) {
                return new HttpException('El proyecto no existe', HttpStatus.CONFLICT);
            };

            await this.requestRepository.delete({
                projectId: id
            });
            await this.projectRepository.delete(id);

            return true;
        };

        async updateProject(id: number, data: UpdateProjectDto) {
            const existProject = await this.projectRepository.findOne({
                where: { id: id },
            });
            if(!existProject) {
                return new HttpException('El proyecto no existe', HttpStatus.CONFLICT);
            };
            const updateProject = await this.projectRepository.update({ id }, {
                name: data.name,
                clientId: parseInt(data.clientId),
                description: data.description,
            });
            if(updateProject.affected > 0){
                return true;
            }
            return false;

        }

        async syncProjects() {
            const img = '48x48';
            const sync = new GetAllProjects;
            const projectsJira = await sync.getProjects();
            
            if(!projectsJira) {
                return new HttpException('Error al obtener proyectos de jira', HttpStatus.CONFLICT);
            };

            const projectsBd = await this.projectRepository.find()

            if(projectsJira.total === projectsBd.length) {
                return {
                    message: 'Los proyectos ya se encuentran registrados',
                    sync: true,
                }
            };

            let projects = []
            let data = []
            const dateNow = new Date();
            if(projectsJira.total > projectsBd.length && projectsBd.length != 0) {
                projectsJira.values.forEach((value, index) => {
                    projectsBd.forEach((p) => {
                        if(p.id_jira != value.id) {
                            projects.push(value)
                        } else {
                            projects.push(null);
                        }
                    });
                    const validate = projects.includes(null)
                    validate ? projects = [] : data.push({
                        id_jira: value.id,
                        name: value.name,
                        created_at: dateNow,
                        type_project: value.projectTypeKey,
                        key: value.key,
                        avatar_url: value.avatarUrls[img]
                    })
                });
                return await this.projectRepository.save(data)

            } else {
                projectsJira.values.map((value) => {
                    projects.push({
                        id_jira: value.id,
                        name: value.name,
                        created_at: dateNow,
                        type_project: value.projectTypeKey,
                        key: value.key,
                        avatar_url: value.avatarUrls[img]
                    });
                });
                return await this.projectRepository.save(projects);
            }
        }
}
