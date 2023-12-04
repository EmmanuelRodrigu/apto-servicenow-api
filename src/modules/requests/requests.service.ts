import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupportRequest } from 'src/entities/support-request.entity';
import { Repository } from 'typeorm';
import { CreateRequestDto } from './dtos/create-request-dto';
import { UpdateRequestDto } from './dtos/update-request-dto';
import { AcceptRequest } from './dtos/accept-request.dto';
import { CreateCommentDto } from './dtos/create-commet.dto';
import { User } from 'src/entities/user.entity';
import { Client } from 'src/entities/client.entity';
import { Project } from 'src/entities/project.entity';
import { CommetsRequest } from 'src/entities/commets-request.entity';
import { Pagination, IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { RequestJira } from './requestsJira/requests-jira';
import { FOR_PAGE } from 'src/config/constants';
import { AccountUsersJira } from 'src/entities/account-user-jira.entity';
import { MailService } from '../mail/mail.service';
import { S3FilesService } from '../s3-files/s3-files.service';
import { DescriptionRequest } from 'src/entities/description-request.entity';

@Injectable()
export class RequestsService {
    constructor(
        @InjectRepository(SupportRequest) private requestRepository: Repository<SupportRequest>,
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Client) private clientRepository: Repository<Client>,
        @InjectRepository(Project) private projectRepository: Repository<Project>,
        @InjectRepository(CommetsRequest) private commentReporsitory: Repository<CommetsRequest>,
        @InjectRepository(AccountUsersJira) private accountUsersJiraReporsitory: Repository<AccountUsersJira>,
        @InjectRepository(DescriptionRequest) private descriptionRequestRepository: Repository<DescriptionRequest>,
        private readonly requestJira: RequestJira,
        private readonly mailService: MailService,
        private s3FileService: S3FilesService,
    ) {}

    async createRequest(body: CreateRequestDto, clientId: number, file: Express.Multer.File) {
        const project = await this.projectRepository.findOne({
            where: {
                clientId: clientId,
            }
        });
        if(!project) {
            return new HttpException('El cliente no existe', HttpStatus.NOT_FOUND);
        };

        const reporter = await this.accountUsersJiraReporsitory.findOne({
            where: {
                accountId: body.reporter
            }
        });
        
        const date = new Date();
        const request = {
            type_request: body.type_request,
            summary: body.summary,
            created_at: date,
            projectId: project.id,
            status: 'Backlog',
            reporterId: reporter.id
        };
        const saveRequest = await this.requestRepository.save(request);
        let descriptionRequest = []
        body.description.map((value) => {
            descriptionRequest.push({ 
                depth: value.depth,
                key: value.key,
                text: value.text,
                type: value.type,
                requestId: saveRequest.id
            })
        })
        await this.descriptionRequestRepository.save(descriptionRequest)

        await this.mailService.sendCreateIssue(body.email, body.type_request, reporter.displayName, body.summary);
        await this.projectRepository.update({ id: project.id }, { no_requests: project.no_requests + 1 });
        let uploadFile;
        if(file) {
            uploadFile = await this.s3FileService.uploadFile(file);
        }

        return {
            saveRequest, 
            uploadFile,
        };
        

    };

    async getRequest(id: number) {
        let request = await this.requestRepository.findOne({
            where: { id },
        });

        const project = await this.projectRepository.findOne({
            where: { id: request.projectId },
        });

        const accountReporter = await this.accountUsersJiraReporsitory.findOne({
            where: {
                id: request.reporterId
            }
        });
        const reporter = await this.requestJira.getUser(accountReporter.accountId);
        const users = await this.requestJira.getUsersJira();
        let issue;

        if(request.key) {
            issue = await this.requestJira.getIssue(request.key);
            if(issue.fields.status.name != request.status) {
                await this.requestRepository.update({id: id}, { status: issue.fields.status.name });
                request = await this.requestRepository.findOne({
                    where: { id },
                });
            }
        }

        const comments = await this.commentReporsitory.find({
            where: { requestId:  id}
        });

        const descriptionRequest = await this.descriptionRequestRepository.find({
            where: {
                requestId: request.id
            }
        });

        let blocks = [];
        descriptionRequest.map((value) => {
            blocks.push(
                {
                    text: value.text,
                    type: value.type,
                    depth: value.depth,
                    inlineStyleRanges: [],
                    entityRanges: [],
                    data: {},
                }
            )
        })

        if(request.assigneeId != null) {
            const accountAssignee = await this.accountUsersJiraReporsitory.findOne({
                where: {
                    id: request.assigneeId
                }
            });
            const assignee = await this.requestJira.getUser(accountAssignee.accountId);
            return {
                ...request,
                project: {
                    name: project.name,
                    avatarUrl: project.avatar_url
                },
                reporter: [{value: reporter.accountId, label: reporter.displayName}],
                assignee: [{value: assignee.accountId, label: assignee.displayName}],
                users: users,
                issue: issue,
                comments: comments,
                description: [{
                    blocks,
                    entityMap: {}
                }],
            };
        };
        return {
            ...request,
            project: project.name,
            reporter: [{value: reporter.accountId, label: reporter.displayName}],
            users: users,
            issue: issue,
            comments: comments,
            description: [{
                blocks,
                entityMap: {}
            }],
        };
        
    };

    async allRequests(options: IPaginationOptions, query: string, order: 'ASC' | 'DESC', option: string): Promise<Pagination<SupportRequest>> {
        const querySearchRequests = this.requestRepository.createQueryBuilder('request');
        if(query) {
            querySearchRequests
                .leftJoinAndSelect(
                    'request.project',
                    'project'
                )
                .having('request.summary LIKE :title', { title: `%${query}%`})
                .orHaving('request.id = :id', { id: query })
                .limit(FOR_PAGE);
        } else {
            querySearchRequests
                .leftJoinAndSelect(
                    'request.project', 
                    'project'
                )
                .orderBy(
                    option && option != 'summary' && option != 'name_project' ? `request.${option}` : 'request.id', order ? order : 'ASC'
                )
                .addOrderBy(
                    option && option == 'summary' ? 'request.summary' : 'request.id', order ? order : 'ASC'
                )
                .addOrderBy(
                    option && option == 'name_project' ? 'project.name' : 'request.id', order ? order : 'ASC'
                )
                .limit(FOR_PAGE);
        }

        return paginate<SupportRequest>(querySearchRequests,  options);
    };

    async requestsClient(options: IPaginationOptions, clientId: number, query: string): Promise<Pagination<SupportRequest>> {
        const project = await this.projectRepository.findOne({
            where: {
                clientId: clientId,
            }
        });

        const querySearchRequestForProject = this.requestRepository.createQueryBuilder('request');
        querySearchRequestForProject
            .leftJoinAndSelect(
                'request.reporter',
                'reporter',
            )
            .having(
                'request.projectId = :projectId', { projectId: project.id }
            )
            .orHaving(
                'request.summary LIKE :title', { title: `%${query}%` }
            )
            .orHaving(
                'request.summary LIKE :id', { id: query }
            )
            .limit(FOR_PAGE);

        return paginate<SupportRequest>(querySearchRequestForProject, options);
    };

    async updateRequest(body: UpdateRequestDto, id: number) {
        const assignee = await this.accountUsersJiraReporsitory.findOne({
            where: {
                accountId: body.assignee
            }
        });

        const data = {
            summary: body.summary,
            assigneeId: assignee.id
        }
        const updateRequest = await this.requestRepository.update({ id: id }, data);
        if(updateRequest.affected < 1){
            return new HttpException('Error al actualizar solicitud', HttpStatus.CONFLICT);
        };
        const request = await this.requestRepository.findOne({
            where: { id: id }
        })
        let updateAssign;
        if(request.key) {
            updateAssign = await this.requestJira.updateTask(request.id_jira, body.assignee);
            if(updateAssign ) {
                return {
                    message: 'Solicitud actualizada exitosamente',
                    status: true,
                };
            };
            return {
                message: 'Error al actualizar solicitud',
                status: false,
            };
        };

        return {
            message: 'Solicitud actualizada exitosamente',
            status: true,
        };

    };

    async acceptRequest(id: number, body: AcceptRequest) {
        const parseIdProject = parseInt(body.projectId)
        const projectId = await this.projectRepository.findOne({
            where: {
                id: parseIdProject
            }
        });
        const assignee = await this.accountUsersJiraReporsitory.findOne({
            where: {
                accountId: body.assigneeId
            }
        })

        const createTask = await this.requestJira.createTask(body, projectId.id_jira);
        const updateRequest = await this.requestRepository.update({ id: id }, {id_jira: createTask.id, key: createTask.key, assigneeId: assignee.id});
        if(updateRequest.affected > 0) {
            return {
                message: 'Tarea creada en jira',
                status: true
            };
        };
        return {
            message: 'Error al aceptar solicitud',
            status: false,
        };
    };

    async deleteRequest(id: number) {
        const issue = await this.requestRepository.findOne({
            where: { id: id },
        });

        await this.commentReporsitory.delete({
            requestId: id
        });

        await this.descriptionRequestRepository.delete({
            requestId: id
        });

        const deleteRequest = await this.requestRepository.delete(id);
        if(deleteRequest.affected > 0) {
            if(issue.key) {
                await this.requestJira.deleteIssue(issue.key);
            }
            return {
                message: 'Solicitud eliminada exitosamente',
                status: true,
            };
        }
        return {
            message: 'Error al eliminar solicitud',
            status: false,
        }
    };

    async createComment(data: CreateCommentDto) {
        console.log(data)
        const request = await this.requestRepository.findOne({
            where: {
                id: data.requestId
            }
        });
        const createOnJira = await this.requestJira.addComment(request.key, data.comment);
        if(createOnJira) {
            await this.commentReporsitory.save(data);
            return true;
        }
        return false;
    }

}
