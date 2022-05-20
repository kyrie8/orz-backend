import { Dept } from 'src/dept/entities/dept.entity';
import { CacheModule, Module } from '@nestjs/common';
import { DeptService } from './dept.service';
import { DeptController } from './dept.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/entities/role.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { MenuService } from 'src/menu/menu.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Dept, Role, Menu]),
    CacheModule.register(),
  ],
  controllers: [DeptController],
  providers: [DeptService, UserService, RoleService, MenuService],
  exports: [DeptService],
})
export class DeptModule {}
