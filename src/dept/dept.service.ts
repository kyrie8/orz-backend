import { Dept } from 'src/dept/entities/dept.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeptDto } from './dto/create-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';
import { Repository } from 'typeorm';
import { FindDeptDto } from './dto/find-dept.dto';

@Injectable()
export class DeptService {
  constructor(
    @InjectRepository(Dept)
    private readonly deptRepository: Repository<Dept>
  ) {

  }
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

  async findAll(query: FindDeptDto) {
    const { page_size = 10, page_num = 1, ...params } = query;
    const db = this.deptRepository.createQueryBuilder('role');
    db.where(params);
    db.skip(page_size * (page_num - 1));
    db.take(page_size);
    const total = await db.getCount();
    const list = await db.getMany();
    return { list, total };
  }

  async findOne(id: number) {
    const dept = await this.deptRepository
      .createQueryBuilder('role')
      .where('role.role_id=:role_id', { dept_id: id })
      .getOne();
    if (!dept) {
      throw new HttpException('部门不存在', HttpStatus.BAD_REQUEST);
    }
    return { list: dept };
  }

  async update(id: number, updateDeptDto: UpdateDeptDto) {
    return await this.deptRepository.update({ dept_id: +id }, updateDeptDto);
  }

  remove(id: number) {
    return `This action removes a #${id} dept`;
  }
}
