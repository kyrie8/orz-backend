import { Dept } from 'src/dept/entities/dept.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';
import { EntityManager, Repository } from 'typeorm';
import { FindDeptDto } from './dto/find-dept.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

export interface Ilist {
  children?: Partial<Ilist>[];
  dept_id: number;
  parent_id: number;
  remark: string;
  name: string;
  createTime: unknown;
  updateTime: unknown;
}
@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(Dept)
    private readonly deptRepository: Repository<Dept>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createDeptDto: CreateDeptDto) {
    const { name } = createDeptDto;
    const has_name = await this.deptRepository.findOne({
      where: { name },
    });
    if (has_name) {
      throw new HttpException('部门已存在', HttpStatus.BAD_REQUEST);
    }
    const new_dept = this.deptRepository.create(createDeptDto);
    return this.deptRepository.save(new_dept);
  }

  getTreeList(list: Ilist[], id = 0) {
    return list.reduce((pre, cur: Ilist) => {
      if (cur.parent_id === id) {
        const children = this.getTreeList(list, cur.dept_id);
        if (children.length) {
          cur.children = children;
        }
        pre.push(cur);
      }
      return pre;
    }, []);
  }

  async findAll(query: FindDeptDto) {
    //const { page_size = 10, page_num = 1, ...params } = query;
    const db = this.deptRepository.createQueryBuilder('dept');
    db.where(query);
    // db.skip(page_size * (page_num - 1));
    // db.take(page_size);
    // const total = await db.getCount();
    const list = await db.getMany();
    const tree = this.getTreeList(list, 0);
    return { list: tree };
  }

  async findOne(id: number) {
    const dept = await this.deptRepository
      .createQueryBuilder('dept')
      .where('dept.dept_id=:dept_id', { dept_id: id })
      .getOne();
    if (!dept) {
      throw new HttpException('部门不存在', HttpStatus.BAD_REQUEST);
    }
    return { list: dept };
  }

  async update(id: number, updateDeptDto: UpdateDeptDto) {
    return await this.deptRepository.update({ dept_id: +id }, updateDeptDto);
  }

  async remove(id: string, maneger: EntityManager) {
    const db = await this.userRepository
      .createQueryBuilder('user')
      .where('user.dept_id = :dept_id', { dept_id: id })
      .getMany();
    for (let index = 0; index < db.length; index++) {
      const v = db[index];
      await this.userRepository.update({ user_id: v.user_id }, { dept: null });
    }
    await this.deptRepository.delete(id);
  }
}
