import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/role/entities/role.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { FindMenuDto } from './dto/find-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';

export interface menuStr {
  menu_id: number;
  parent_id: number;
  menu_name: string;
  path: string;
  component: string;
  icon: string;
  type: number;
  is_out_link: number;
  createTime: any;
  updateTime: any;
}

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}
  async create(createMenuDto: CreateMenuDto) {
    const { menu_name } = createMenuDto;
    const has_name = await this.menuRepository.findOne({
      where: { menu_name },
    });
    if (has_name) {
      throw new HttpException('菜单名已存在', HttpStatus.BAD_REQUEST);
    }
    const new_menu = await this.menuRepository.create(createMenuDto);
    console.log('new_menu', new_menu);
    return this.menuRepository.save(new_menu);
  }

  //转成树形
  getTreeList(data: menuStr[], child = [], parent_id: number) {
    const list = child;
    data.forEach((item) => {
      if (item.parent_id === parent_id) {
        list.push(item);
      }
    });
    list.forEach((item) => {
      item.children = [];
      this.getTreeList(data, item.children, item.menu_id);
      if (!item.children.length) {
        delete item.children;
      }
    });
    return list;
  }
  async findAll(query: FindMenuDto) {
    const db = this.menuRepository.createQueryBuilder('menu');
    db.where(query);
    const data = await db.getMany();
    const list = this.getTreeList(data, [], 0);
    return { list };
  }

  async findAuth() {
    const db = this.menuRepository.createQueryBuilder('menu');
    db.where({ type: 0 });
    const data = await db.getMany();
    return data;
  }

  async findOne(id: number) {
    const menu = await this.menuRepository.findOne({ where: { menu_id: id } });
    if (!menu) {
      throw new HttpException('菜单不存在', HttpStatus.BAD_REQUEST);
    }
    return { list: menu };
  }

  async findByIds(ids: unknown[]) {
    return await this.menuRepository.findByIds(ids);
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    return await this.menuRepository.update({ menu_id: id }, updateMenuDto);
  }

  //若删除的父级，应该把子级删除？
  async remove(id: string, maneger: EntityManager) {
    const ids = id.split(',');
    const db = await maneger.findByIds(Menu, ids, {
      relations: ['roles'],
    });
    const role_id = [];
    if (db.length) {
      db.forEach((item) => {
        item.roles.forEach((ele) => {
          if (!role_id.includes(ele.role_id)) {
            role_id.push(ele.role_id);
          }
        });
      });
    }
    if (role_id.length) {
      const len = role_id.length;
      const entity = new Role();
      for (let index = 0; index < len; index++) {
        entity.role_id = role_id[index];
        entity.menus = [];
        await maneger.save(entity);
      }
    }
    await maneger.delete(Menu, ids);
  }
}
