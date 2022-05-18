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
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor) //序列化参数
  create(@Body() createUserDto: CreateUserDto) {
    console.log('createUserDto', createUserDto);
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles('user:view')
  @UseGuards(RolesGuard)
  //@UsePipes(new ValidationPipe())
  findAll(@Query() query: FindUserDto) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @Roles('user:view')
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: number) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
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
