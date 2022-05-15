import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateLoginDto {
  @ApiProperty({ description: '用户名称' })
  @IsNotEmpty({ message: '用户名称不能空' })
  readonly username: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '密码不能空' })
  readonly password: string;
}
