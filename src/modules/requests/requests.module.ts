import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
import { TypeRequest } from 'src/entities/type-request.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupportRequest } from 'src/entities/support-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeRequest, SupportRequest])],
  providers: [RequestsService],
  controllers: [RequestsController]
})
export class RequestsModule {}
