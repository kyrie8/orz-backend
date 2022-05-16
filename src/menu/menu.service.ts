import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMenuDto } from './dto/create-menu.dto';
import { FindMenuDto } from './dto/find-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';

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

  async findAll(query: FindMenuDto) {
    const db = this.menuRepository.createQueryBuilder('menu');
    db.where(query);
    const list = await db.getMany();
    return { list };
  }

  findOne(id: number) {
    return `This action returns a #${id} menu`;
  }

  async findByIds(ids: unknown[]) {
    return await this.menuRepository.findByIds(ids);
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    return await this.menuRepository.update({ menu_id: id }, updateMenuDto);
  }

  remove(id: number) {
    return `This action removes a #${id} menu`;
  }
}
