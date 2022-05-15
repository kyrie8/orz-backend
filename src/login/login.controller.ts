import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { CreateLoginDto } from './dto/create-login.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('验证')
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}
  @UseGuards(AuthGuard('local'))
  @UseInterceptors(ClassSerializerInterceptor) //序列化参数
  @Post()
  async login(@Body() createLoginDto: CreateLoginDto) {
    return this.loginService.login(createLoginDto);
  }
}
