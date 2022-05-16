import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsPositive } from 'class-validator';

export class FindMenuDto {
  @ApiProperty({ description: '菜单名称' })
  readonly menu_name: string;

  @ApiProperty({ description: '是否是外链，默认不是' })
  @IsOptional()
  @IsPositive()
  readonly is_out_link: number;
}
