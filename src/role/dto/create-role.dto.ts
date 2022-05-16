import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称' })
  @IsNotEmpty({ message: '角色名称不能空' })
  readonly role_name: string;

  @ApiProperty({ description: '描述' })
  @IsString()
  readonly remark: string;

  @ApiProperty({ description: '权限数据ID' })
  @IsString()
  readonly menu_id: string;
}
