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
} from '@nestjs/common';
import { EntityManager, Transaction, TransactionManager } from 'typeorm';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';
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
  //@UsePipes(new ValidationPipe())
  findAll(@Query() query: FindUserDto) {
    console.log('query', query);
    return this.userService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
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
  @Transaction()
  remove(
    @Param('id') id: string,
    @TransactionManager() maneger: EntityManager,
  ) {
    return this.userService.remove(+id, maneger);
  }
}
