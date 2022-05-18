import { CacheModule, Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/role/entities/role.entity';
import { User } from 'src/user/entities/user.entity';
import { Menu } from './entities/menu.entity';
import { RoleService } from 'src/role/role.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, Menu]), CacheModule.register()],
  controllers: [MenuController],
  providers: [MenuService, RoleService, UserService],
  exports: [MenuService],
})
export class MenuModule {}
