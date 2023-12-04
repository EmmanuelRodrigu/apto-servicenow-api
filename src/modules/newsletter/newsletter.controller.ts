import { Controller, Get, Body, Post, UseInterceptors, UploadedFile, Put, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { BASE_PREFIX_API } from 'src/config/constants';
import { NewsletterService } from './newsletter.service';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { ApiTags } from '@nestjs/swagger';
import { CreateNewsletterDto } from './dto/create.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(`${BASE_PREFIX_API}/newsletter`)
export class NewsletterController {
    constructor(
        private newsService: NewsletterService,
    ) {}

    @ApiTags('newsletter')
    @Get('')
    async allNewsletter() {
        return await this.newsService.allNewsletter();
    };

    @ApiTags('newsletter')
    @Get('view')
    async getNewsletter() {
        return await this.newsService.getNewsletter();
    };

    @ApiTags('newsletter')
    @UseInterceptors(FileInterceptor('file'))
    @Post('create')
    async createNewsletter(
        @Body() body: CreateNewsletterDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return await this.newsService.createNewsletter(body, file);
    };

    @ApiTags('newsletter')
    @Put('change-status/:id')
    async changeStatus(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.newsService.changeStatus(id)
    };

    @ApiTags('newsletter')
    @Delete('/:id/delete')
    async deleteNewsletter(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return await this.newsService.deleteNewsletter(id)
    }

}
