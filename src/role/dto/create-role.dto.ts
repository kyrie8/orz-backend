import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ description: '角色名称' })
  @IsNotEmpty({ message: '角色名称不能空' })
  readonly role_name: string;

  @ApiProperty({ description: '描述' })
  readonly remark: string;
}
