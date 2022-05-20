import { RolesGuard } from './../login/role.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
import { Roles } from 'src/login/role.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('用户')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: '用户添加' })
  @ApiBearerAuth()
  @Roles('user:add')
  @UseGuards(RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor) //序列化参数
  create(
    @Body() createUserDto: CreateUserDto,
    @TransactionManager() maneger: EntityManager,
  ) {
    return this.userService.create(createUserDto, maneger);
  }

  @Get()
  @ApiOperation({ summary: '用户查找（全部）' })
  @ApiBearerAuth()
  @Roles('user:view')
  @UseGuards(RolesGuard)
  //@UsePipes(new ValidationPipe())
  findAll(@Query() query: FindUserDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: '用户查找' })
  @ApiBearerAuth()
  @Roles('user:view')
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: number) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '用户编辑' })
  @ApiBearerAuth()
  @Roles('user:edit')
  @UseGuards(RolesGuard)
  @Transaction()
  update(
    @Param('id') id: number,
    @Body() UpdateUserDto: UpdateUserDto,
    @TransactionManager() maneger: EntityManager,
  ) {
    console.log('id', id, 'UpdateUserDto', UpdateUserDto);
    return this.userService.update(+id, UpdateUserDto, maneger);
  }

  @Delete(':id')
  @ApiOperation({ summary: '用户删除' })
  @ApiBearerAuth()
  @Roles('user:delete')
  @UseGuards(RolesGuard)
  @Transaction()
  remove(
    @Param('id') id: string,
    @TransactionManager() maneger: EntityManager,
  ) {
    return this.userService.remove(+id, maneger);
  }
}
