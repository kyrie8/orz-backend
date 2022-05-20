import { CacheModule, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { MenuService } from 'src/menu/menu.service';
import { JwtService } from '@nestjs/jwt';
import { Dept } from 'src/dept/entities/dept.entity';
import { DeptService } from 'src/dept/dept.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User, Menu, Dept]),
    CacheModule.register(),
  ],
  controllers: [RoleController],
  providers: [RoleService, MenuService, DeptService, UserService],
  exports: [RoleService],
})
export class RoleModule {}
