import { Injectable } from '@nestjs/common';
import { SupportRequest, TypeRequest } from 'src/entities/support-request.entity';
import { Project } from 'src/entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryBuilder } from 'typeorm';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(SupportRequest) private requestRepository: Repository<SupportRequest>,
        @InjectRepository(Project) private projectRepository: Repository<Project>,
    ) {}

    async getRequestsForClient(status = 'Backlog') {
        const projects = await this.projectRepository.find();
        const data = projects.map((project) => { return { name: project.name, requests: project.no_requests } });

        const requestInBacklog = await this.requestRepository.findAndCount({
            where: { status: 'Backlog' }
        });
        const requestInTodo = await this.requestRepository.findAndCount({
            where: { status: 'To Do' }
        });
        const requestInProgress = await this.requestRepository.findAndCount({
            where: { status: 'In Progress' }
        });
        const requestWorkInProgress = await this.requestRepository.findAndCount({
            where: { status: 'Work in progress' }
        });
        const requestInReview = await this.requestRepository.findAndCount({
            where: { status: 'In Review' }
        });
        const requestInDone = await this.requestRepository.findAndCount({
            where: { status: 'Done' }
        });

        const requestForFunctionality = await this.requestRepository.findAndCount({
            where: { type_request: TypeRequest.FUNCTIONALITY }
        });
        const requestForBug = await this.requestRepository.findAndCount({
            where: { type_request: TypeRequest.BUG }
        });
        const requestForSupport = await this.requestRepository.findAndCount({
            where: { type_request: TypeRequest.SUPPORTREQUEST }
        });



        return {
            data,
            requestForStatus: [
                requestInBacklog[0].length,
                requestInTodo[0].length,
                requestInProgress[0].length,
                requestWorkInProgress[0].length,
                requestInReview[0].length,
                requestInDone[0].length,
            ],
            requestForType: [
                requestForFunctionality[0].length,
                requestForBug[0].length,
                requestForSupport[0].length,
            ]
        }
    }
}
