import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/role/entities/role.entity';
import { RoleService } from 'src/role/role.service';
import { MenuService } from 'src/menu/menu.service';
import { Menu } from 'src/menu/entities/menu.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, Menu])],
  controllers: [UserController],
  providers: [UserService, RoleService, MenuService],
  exports: [UserService],
})
export class UserModule {}
