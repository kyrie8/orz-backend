import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名称' })
  @IsNotEmpty({ message: '用户名称不能空' })
  readonly username: string;

  @ApiProperty({ description: '密码' })
  @IsNotEmpty({ message: '密码不能空' })
  readonly password: string;

  @ApiProperty({ description: '邮箱' })
  readonly email: string;

  @ApiProperty({ description: '头像' })
  readonly avatar: string;

  @ApiProperty({ description: '描述' })
  readonly desc: string;

  @ApiProperty({ description: '状态' })
  readonly status: number;

  @ApiProperty({ description: '角色' })
  readonly role_id: string;
}
