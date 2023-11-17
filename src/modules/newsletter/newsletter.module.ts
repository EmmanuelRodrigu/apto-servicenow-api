import { Module } from '@nestjs/common';
import { NewsletterController } from './newsletter.controller';
import { NewsletterService } from './newsletter.service';
import { Newsletter } from "../../entities/newsletter.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3FilesService } from '../s3-files/s3-files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Newsletter
    ])
  ],
  controllers: [NewsletterController],
  providers: [NewsletterService, S3FilesService]
})
export class NewsletterModule {}
