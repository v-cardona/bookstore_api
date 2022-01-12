import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerDocumentOptions, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('BookStore Documentation')
    .setDescription('BookStore: backend for users and authors to see books')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
    
    const options: SwaggerDocumentOptions =  {
      operationIdFactory: (
        controllerKey: string,
        methodKey: string
      ) => methodKey,
    };
  const document = SwaggerModule.createDocument(app, config, options);
  
  const customOptions: SwaggerCustomOptions = {
    customSiteTitle: 'BookStore API Documentation',
  };
  
  SwaggerModule.setup('docs', app, document, customOptions);

  await app.listen(AppModule.port);
}
bootstrap();
