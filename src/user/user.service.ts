import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeptService } from 'src/dept/dept.service';
import { Dept } from 'src/dept/entities/dept.entity';
import { Role } from 'src/role/entities/role.entity';
import { RoleService } from 'src/role/role.service';
import { EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private roleService: RoleService,
    private deptService: DeptService,
  ) {}
  async create(createUserDto: CreateUserDto, maneger: EntityManager) {
    const { username, role_id, dept_id } = createUserDto;
    const user = await this.userRepository.findOne({
      where: { username },
    });
    if (user) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }
    //const entity = new User();
    const newUser = this.userRepository.create(createUserDto);
    if (role_id) {
      const roles = await this.roleService.findByIds(role_id.split(','));
      newUser.roles = roles;
    }
    if (dept_id) {
      const dept = await this.deptService.findOne(dept_id);
      newUser.dept = dept.list;
    }
    return this.userRepository.save(newUser);
  }

  async findAll(query: FindUserDto) {
    const { page_size = 10, page_num = 1, ...params } = query;
    console.log(params);
    const users = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .orderBy('update_time', 'DESC');
    users.where(params);
    users.skip(page_size * (page_num - 1));
    users.take(page_size);
    const total = await users.getCount();
    const list = await users.getMany();
    return { list, total };
  }

  async findOne(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.roles', 'role')
      .where('user.user_id=:user_id', { user_id: id })
      .getOne();
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    return { list: user };
  }

  async update(
    user_id: number,
    UpdateUserDto: UpdateUserDto,
    maneger: EntityManager,
  ) {
    //const { role_id } = maneger;
    const user = await this.userRepository.findOne({
      where: { user_id },
    });
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const { role_id, dept_id } = UpdateUserDto;
    const entity = new User();
    if (role_id) {
      const ids = role_id.split(',');
      const roles = await maneger.findByIds(Role, ids);
      entity.roles = roles;
    }
    if (dept_id) {
      const dept = await this.deptService.findOne(dept_id);
      entity.dept = dept.list;
    }
    maneger.merge(User, entity, { user_id, ...UpdateUserDto });
    await maneger.save(entity);
  }

  async remove(id: number, maneger: EntityManager) {
    await maneger.delete(User, id);
  }

  //role del
  // async role_delete(role_id: number) {
  //   const user = await this.userRepository.findByIds()
  // }
}
