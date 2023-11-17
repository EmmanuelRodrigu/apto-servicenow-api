import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Newsletter } from 'src/entities/newsletter.entity';
import { Repository } from 'typeorm';
import { CreateNewsletterDto } from './dto/create.dto';
import { S3FilesService } from '../s3-files/s3-files.service';

@Injectable()
export class NewsletterService {
    constructor(
        @InjectRepository(Newsletter) private newsRepository: Repository<Newsletter>,
        private s3Service: S3FilesService,
    ) {}

    async allNewsletter() {
        return await this.newsRepository.find();
    }

    async getNewsletter() {
        return await this.newsRepository.findOne({
            where: { isView: true }
        });
    };

    async createNewsletter(body: CreateNewsletterDto, file: Express.Multer.File) {
        const uploadFile = await this.s3Service.uploadFile(file);
        const dateNow = new Date();
        const data = {
            ...body,
            created_at: dateNow,
            url: uploadFile.Location,
        }
        const create = await this.newsRepository.save(data);
        if(!create) {
            throw new HttpException('Error al crear noticia', HttpStatus.CONFLICT);
        };
        return {
            message: 'Noticia creada exitosamente',
            status: true,
        };
    };

    async changeStatus(id: number) {
        const news = await this.newsRepository.findOne({ 
            where: { 
                id 
            } 
        });
        await this.newsRepository.update({  }, { isView: false });
        const change = await this.newsRepository.update({ id }, { isView: !news.isView})

        if(!change) {
            throw new HttpException('Error al cambiar estatus', HttpStatus.CONFLICT);
        };

        return {
            message: 'Estatus cambiado exitosamente',
            status: true,
        };
    };

    async deleteNewsletter(id: number) {
        const deleteNews = await this.newsRepository.delete({id});
        if(!deleteNews) throw new HttpException('Error al eliminar noticia', HttpStatus.CONFLICT)

        return {
            message: 'Noticia eliminada',
            status: true,
        }
    }

}
