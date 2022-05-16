import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名称' })
  @IsNotEmpty({ message: '用户名称不能空' })
  readonly username: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '密码不能空' })
  readonly password: string;

  @ApiProperty({ description: '邮箱' })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ description: '头像' })
  @IsString()
  readonly avatar: string;

  @ApiProperty({ description: '描述' })
  @IsString()
  readonly desc: string;

  @ApiProperty({ description: '状态' })
  @IsInt()
  readonly status: number;

  @ApiProperty({ description: '角色' })
  @IsString()
  readonly role_id: string;
}
