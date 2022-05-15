import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';
import { CreateRoleDto } from './create-role.dto';

export class FindRoleDto extends PartialType(CreateRoleDto) {
  @ApiProperty({ description: '角色名称' })
  readonly role_name: string;

  @ApiProperty({ description: '页数', default: 1 })
  @IsOptional()
  @IsPositive()
  page_num: number;

  @ApiProperty({ description: '条数', default: 10 })
  @IsOptional()
  @IsPositive()
  page_size: number;
}
