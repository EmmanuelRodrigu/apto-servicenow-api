import { Module } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { NewsletterController } from './newsletter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Newsletter } from 'src/entities/newsletter.entity';
import { Banner } from 'src/entities/banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Newsletter, Banner])],
  providers: [NewsletterService],
  controllers: [NewsletterController],
})
export class NewsletterModule {}
