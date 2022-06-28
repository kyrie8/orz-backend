import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/menu/entities/menu.entity';
import { MenuService } from 'src/menu/menu.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { EntityManager, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { FindRoleDto } from './dto/find-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private menuService: MenuService,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const { role_name, menu_id } = createRoleDto;
    const has_name = await this.roleRepository.findOne({
      where: { role_name },
    });
    if (has_name) {
      throw new HttpException('角色名已存在', HttpStatus.BAD_REQUEST);
    }
    const new_role = await this.roleRepository.create(createRoleDto);
    if (menu_id) {
      const menus = await this.menuService.findByIds(menu_id.split(','));
      new_role.menus = menus;
    }
    return this.roleRepository.save(new_role);
  }

  async findAll(query: FindRoleDto) {
    const { page_size = 10, page_num = 1, ...params } = query;
    const db = this.roleRepository.createQueryBuilder('role');
    db.where(params);
    db.orderBy('update_time', 'DESC');
    db.skip(page_size * (page_num - 1));
    db.take(page_size);
    const total = await db.getCount();
    const list = await db.getMany();
    return { list, total };
  }

  //user调用
  async findByIds(ids: unknown[]) {
    return await this.roleRepository.findByIds(ids);
  }

  async findOne(id: number) {
    const role = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.menus', 'menu')
      .where('role.role_id=:role_id', { role_id: id })
      .getOne();
    if (!role) {
      throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST);
    }
    return { list: role };
  }

  async update(
    role_id: number,
    updateRoleDto: UpdateRoleDto,
    maneger: EntityManager,
  ) {
    const role = await this.roleRepository.findOne({
      where: { role_id },
    });
    if (!role) {
      throw new HttpException('角色不存在', HttpStatus.BAD_REQUEST);
    }
    const ids = updateRoleDto.menu_id.split(',');
    const menus = await maneger.findByIds(Menu, ids);
    const entity = new Role();
    entity.role_id = role_id;
    entity.menus = menus;
    maneger.merge(Role, entity, { ...updateRoleDto });
    await maneger.save(entity);
  }

  async remove(role_id: string, maneger: EntityManager) {
    const ids: any[] = role_id.split(',');
    const db = await maneger.findByIds(Role, ids, {
      relations: ['users'],
    });
    console.log('db', db);
    const user_id = [];
    if (db.length) {
      db.forEach((item) => {
        item.users.forEach((ele) => {
          if (!user_id.includes(ele.user_id)) {
            user_id.push(ele.user_id);
          }
        });
      });
    }
    if (user_id.length) {
      const len = user_id.length;
      const entity = new User();
      for (let index = 0; index < len; index++) {
        entity.user_id = user_id[index];
        entity.roles = [];
        await maneger.save(entity);
      }
    }
    await maneger.delete(Role, ids);
    //return { list: db };
  }

  //userMenu
  async getMenu(id: number) {
    const userMenu = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.menus', 'menu')
      .where('role.role_id=:role_id', { role_id: id })
      .getOne();
    return userMenu.menus;
  }
}
