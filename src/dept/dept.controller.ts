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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles, RolesGuard } from 'src/login/role.guard';
import { EntityManager, TransactionManager } from 'typeorm';
import { DeptService } from './dept.service';
import { CreateDeptDto } from './dto/create-dept.dto';
import { FindDeptDto } from './dto/find-dept.dto';
import { UpdateDeptDto } from './dto/update-dept.dto';

@ApiTags('部门')
@Controller('dept')
export class DeptController {
  constructor(private readonly deptService: DeptService) {}

  @Post()
  @ApiOperation({ summary: '部门添加' })
  @ApiBearerAuth()
  @Roles('dept:add')
  @UseGuards(RolesGuard)
  create(@Body() createDeptDto: CreateDeptDto) {
    return this.deptService.create(createDeptDto);
  }

  @Get()
  @ApiOperation({ summary: '部门查找（全部）' })
  @ApiBearerAuth()
  @Roles('dept:view')
  @UseGuards(RolesGuard)
  findAll(@Query() query: FindDeptDto) {
    return this.deptService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '部门查找' })
  @ApiBearerAuth()
  @Roles('dept:view')
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.deptService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '部门编辑' })
  @ApiBearerAuth()
  @Roles('dept:edit')
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() updateDeptDto: UpdateDeptDto) {
    return this.deptService.update(+id, updateDeptDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除' })
  @ApiBearerAuth()
  @Roles('dept:delete')
  @UseGuards(RolesGuard)
  remove(
    @Param('id') id: string,
    @TransactionManager() maneger: EntityManager,
  ) {
    return this.deptService.remove(id, maneger);
  }
}
