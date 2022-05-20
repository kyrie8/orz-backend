import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';
import { CreateDeptDto } from './create-dept.dto';

export class FindDeptDto extends PartialType(CreateDeptDto) {
  @ApiProperty({ description: '部门名称' })
  readonly name: string;

  @ApiProperty({ description: '页数', default: 1 })
  @IsOptional()
  @IsPositive()
  page_num: number;

  @ApiProperty({ description: '条数', default: 10 })
  @IsOptional()
  @IsPositive()
  page_size: number;
}
