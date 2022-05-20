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
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { FindMenuDto } from './dto/find-menu.dto';
import { Roles, RolesGuard } from 'src/login/role.guard';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('菜单')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiOperation({ summary: '菜单添加' })
  @ApiBearerAuth()
  @Roles('menu:add')
  @UseGuards(RolesGuard)
  create(@Body() createMenuDto: CreateMenuDto) {
    console.log('co', createMenuDto);
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @ApiOperation({ summary: '菜单查找（全部）' })
  @ApiBearerAuth()
  @Roles('menu:view')
  @UseGuards(RolesGuard)
  findAll(@Query() query: FindMenuDto) {
    return this.menuService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '菜单查找' })
  @ApiBearerAuth()
  @Roles('menu:view')
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '菜单编辑' })
  @ApiBearerAuth()
  @Roles('menu:edit')
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '菜单删除' })
  @ApiBearerAuth()
  @Roles('menu:delete')
  @UseGuards(RolesGuard)
  @Transaction()
  remove(
    @Param('id') id: string,
    @TransactionManager() maneger: EntityManager,
  ) {
    return this.menuService.remove(id, maneger);
  }
}
