import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async remove(id: string) {
    const ids = id.split(',');
    const menu = await this.menuRepository.findByIds(ids);
    const allMenu = await this.menuRepository
      .createQueryBuilder('menu')
      .getMany();
    const parent = menu.filter((item) => item.type === 1);
    const child = menu.filter((item) => item.type === 0);
    if (!child.length && !parent.length) {
      throw new HttpException('数据不存在', HttpStatus.BAD_REQUEST);
    }
    let list = [];
    if (parent.length) {
      parent.forEach((item) => {
        allMenu.forEach((v) => {
          if (item.menu_id === v.parent_id) {
            list.push(item.menu_id, v.menu_id);
          }
        });
      });
    }
    if (child.length) {
      child.forEach((item) => {
        list = [...list, item.menu_id];
      });
    }
    return await this.menuRepository.delete(list);
  }
}
