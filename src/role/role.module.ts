import { CacheModule, Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Menu } from 'src/menu/entities/menu.entity';
import { MenuService } from 'src/menu/menu.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Role, User, Menu]), CacheModule.register()],
  controllers: [RoleController],
  providers: [RoleService, MenuService],
  exports: [RoleService],
})
export class RoleModule {}
