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

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @Roles('menu:add')
  @UseGuards(RolesGuard)
  create(@Body() createMenuDto: CreateMenuDto) {
    console.log('co', createMenuDto);
    return this.menuService.create(createMenuDto);
  }

  @Get()
  @Roles('menu:view')
  @UseGuards(RolesGuard)
  findAll(@Query() query: FindMenuDto) {
    return this.menuService.findAll(query);
  }

  @Get(':id')
  @Roles('menu:view')
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Patch(':id')
  @Roles('menu:edit')
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
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
