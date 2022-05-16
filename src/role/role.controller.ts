import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FindRoleDto } from './dto/find-role.dto';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  findAll(@Query() query: FindRoleDto) {
    return this.roleService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  @Transaction()
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @TransactionManager() maneger: EntityManager,
  ) {
    return this.roleService.update(+id, updateRoleDto, maneger);
  }

  @Delete(':id')
  @Transaction()
  remove(
    @Param('id') id: string,
    @TransactionManager() maneger: EntityManager,
  ) {
    return this.roleService.remove(+id, maneger);
  }
}
