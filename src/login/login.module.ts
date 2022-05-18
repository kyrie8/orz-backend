import { CacheModule, CACHE_MANAGER, Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { LocalStorage } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/entities/role.entity';
import { MenuService } from 'src/menu/menu.service';
import { Menu } from 'src/menu/entities/menu.entity';

const jwtModule = JwtModule.registerAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService) => {
    return {
      secret: configService.get('SECRET'),
      signOptions: { expiresIn: '8h' },
    };
  },
});

@Module({
  exports: [jwtModule],
  imports: [
    TypeOrmModule.forFeature([User, Role, Menu]),
    PassportModule,
    jwtModule,
    CacheModule.register(),
  ],
  controllers: [LoginController],
  providers: [
    LoginService,
    LocalStorage,
    JwtStrategy,
    ConfigService,
    RoleService,
    MenuService,
  ],
})
export class LoginModule {}
