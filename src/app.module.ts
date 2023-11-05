import { Inject, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigType, ConfigModule } from '@nestjs/config';
import baseConfig from './config/registers/base.config';
import validationSchema from './config/env.validation';
import { RequestsModule } from './modules/requests/requests.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ClientsModule } from './modules/clients/clients.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { NewsletterModule } from './modules/newsletter/newsletter.module';
import { AuthModule } from './modules/auth/auth.module';
import { config } from '.././database/ormconfig';
import {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from './config/constants'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [baseConfig],
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [
          __dirname + '/**/*.entity{.ts,.js}'
      ],
      synchronize: true,
    }),
    UsersModule,
    RequestsModule,
    ProjectsModule,
    ClientsModule,
    PaymentsModule,
    NewsletterModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static appName: string;
  static port: number | string;
  static appUrl: string;
  constructor(@Inject(baseConfig.KEY) private readonly bsConfig: ConfigType<typeof baseConfig>) {
    AppModule.appName = this.bsConfig.appName;
    AppModule.port = this.bsConfig.port;
    AppModule.appUrl = this.bsConfig.appUrl;
  }
}
