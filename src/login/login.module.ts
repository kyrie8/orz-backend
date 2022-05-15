import { Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/user/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { LocalStorage } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

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
  imports: [TypeOrmModule.forFeature([User]), PassportModule, jwtModule],
  controllers: [LoginController],
  providers: [LoginService, LocalStorage, JwtStrategy, ConfigService],
})
export class LoginModule {}
