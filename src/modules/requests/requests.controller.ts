import { Controller, Post, Get, Body, UseGuards, Param, ParseIntPipe, Query, DefaultValuePipe, Put, Delete, Request } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateRequestDto } from './dtos/create-request-dto';
import { UpdateRequestDto } from './dtos/update-request-dto';
import { AcceptRequest } from './dtos/accept-request.dto';
import { CreateCommentDto } from './dtos/create-commet.dto';
import { BASE_PREFIX_API, FOR_PAGE, DEFAULT_PAGE } from 'src/config/constants';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';

@Controller(`${BASE_PREFIX_API}/requests`)     
export class RequestsController {
    constructor(
        private requestService: RequestsService,
    ) {}

    @ApiTags('all-requests')
    @Get('')
    async getAllRequests(
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = DEFAULT_PAGE,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = FOR_PAGE,
        @Query('query') query: string,
        @Query('order') order: 'ASC' | 'DESC',
        @Query('option') option: string,
    ) {
        const allRequests = await this.requestService.allRequests({page, limit}, query, order, option);
        return {
            data: allRequests.items, 
            paginate: { 
                page: allRequests.meta.itemCount, 
                pageCount: allRequests.meta.totalPages 
            }
        };
    };

    @Get('/:clientId')
    async requestClient(
        @Param('clientId', ParseIntPipe) id: number,
        @Query('page', new DefaultValuePipe(DEFAULT_PAGE), ParseIntPipe) page: number = DEFAULT_PAGE,
        @Query('limit', new DefaultValuePipe(FOR_PAGE), ParseIntPipe) limit: number = FOR_PAGE,
        @Query('query') query: string,
    ) {
        const requestForClient = await this.requestService.requestsClient({page, limit}, id, query);
        return requestForClient.items
    }

    @ApiTags()
    @Get('/:id/details')
    async getRequest(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.requestService.getRequest(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiTags('create')
    @Post('/create/:clientId')
    async createRequest(
        @Body() body: CreateRequestDto,
        @Param('clientId', ParseIntPipe) clientId: number,
    ) {
        const create = await this.requestService.createRequest(body, clientId);
        return create;
    }

    @ApiTags('update')
    @Put('update/:id')
    async updateRequest(
        @Body() body: UpdateRequestDto,
        @Param('id', ParseIntPipe) id: number,
    ) {
        const updateRequest = await this.requestService.updateRequest(body, id);
        return updateRequest;
    }

    @ApiTags('accept')
    @Post('/accept/:id')
    async acceptRequest(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: AcceptRequest,
    ) {
        const acceptRequest = await this.requestService.acceptRequest(id, body);
        return acceptRequest;
    }

    @ApiTags('delete')
    @Delete('/delete/:id')
    async deleteRequest(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.requestService.deleteRequest(id);
    };

    //@UseGuards(JwtAuthGuard)
    @ApiTags('/comment')
    @Post('/comment')
    async createComment(
        @Body() data: CreateCommentDto,
       // @Request() req,
    ) {
        //const { user } = req;
        return await this.requestService.createComment(data);
    }

}
