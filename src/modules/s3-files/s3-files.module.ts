import { Module } from '@nestjs/common';
import { S3FilesService } from './s3-files.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [S3FilesService]
})
export class S3FilesModule {}
