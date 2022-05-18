import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginModule } from './login/login.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { MenuModule } from './menu/menu.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './login/role.guard';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', '127.0.0.0'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USER', 'root'),
        password: configService.get('DB_PASSWORD', 'root'),
        database: configService.get('DB_DATABASE', 'blog'),
        timezone: '+08:00',
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register(),
    LoginModule,
    UserModule,
    RoleModule,
    MenuModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
