import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common/pipes';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as exphbs from 'express-handlebars';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const options = new DocumentBuilder()
    .setTitle('Code API')
    .setDescription('ServiceNow')
    .setVersion('1.0')
    .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/docs', app, document, {
      explorer: true,
      swaggerOptions: {
        filter: true,
        showRequestDuration: true,
      }
    })

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: join(__dirname, '../..', 'views', 'layout'),
    partialsDir: join(__dirname, '../', 'views', 'partials'),
    helpers: {
      pathImage: (initialPath : string) => `${AppModule.appUrl}/${initialPath}`,
    },
  });
  app.setBaseViewsDir(join(__dirname, '../..', 'views'));
  app.engine('hbs', hbs.engine);
  app.setViewEngine('hbs');

  //Cors
  app.enableCors();

  //Port
  await app.listen(process.env.PORT || AppModule.port, () => {
    console.log(`SERVER LISTENING AT ${process.env.PORT || AppModule.port}`);
  })
}
bootstrap();
