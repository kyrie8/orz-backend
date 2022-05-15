import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { FindRoleDto } from './dto/find-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  async create(createRoleDto: CreateRoleDto) {
    const { role_name } = createRoleDto;
    const has_name = await this.roleRepository.findOne({
      where: { role_name },
    });
    if (has_name) {
      throw new HttpException('角色名已存在', HttpStatus.BAD_REQUEST);
    }
    const new_role = await this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(new_role);
  }

  async findAll(query: FindRoleDto) {
    const { page_size = 10, page_num = 1, ...params } = query;
    const db = this.roleRepository.createQueryBuilder('role');
    db.where(params);
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
    return await this.roleRepository.findOne({
      where: { role_id: id },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    return await this.roleRepository.update({ role_id: id }, updateRoleDto);
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
