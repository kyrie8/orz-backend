import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './httpFilter/filter';
import { TransformInterceptor } from './interceptor/interceptor';
import { JwtAuthGuard } from './login/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter()); //全局异常拦截
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, //过滤不要的参数
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  ); //全局参数验证
  app.useGlobalInterceptors(new TransformInterceptor()); //全局返回参数格式
  app.useGlobalGuards(new JwtAuthGuard()); //全局token
  // 设置swagger文档
  const config = new DocumentBuilder()
    .setTitle('管理后台')
    .setDescription('管理后台接口文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
