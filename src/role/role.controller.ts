import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { FindRoleDto } from './dto/find-role.dto';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { Roles, RolesGuard } from 'src/login/role.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('角色')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  @ApiOperation({ summary: '角色添加' })
  @ApiBearerAuth()
  @Roles('role:add')
  @UseGuards(RolesGuard)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: '角色查找（全部）' })
  @ApiBearerAuth()
  @Roles('role:view')
  @UseGuards(RolesGuard)
  findAll(@Query() query: FindRoleDto) {
    return this.roleService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '角色查找' })
  @ApiBearerAuth()
  @Roles('role:view')
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '角色编辑' })
  @ApiBearerAuth()
  @Roles('role:edit')
  @UseGuards(RolesGuard)
  @Transaction()
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
    @TransactionManager() maneger: EntityManager,
  ) {
    return this.roleService.update(+id, updateRoleDto, maneger);
  }

  @Delete(':id')
  @ApiOperation({ summary: '角色删除' })
  @ApiBearerAuth()
  @Roles('role:delete')
  @UseGuards(RolesGuard)
  @Transaction()
  remove(
    @Param('id') id: string,
    @TransactionManager() maneger: EntityManager,
  ) {
    return this.roleService.remove(id, maneger);
  }
}
