import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ description: '菜单名称' })
  @IsNotEmpty({ message: '菜单名称不能空' })
  readonly menu_name: string;

  @ApiProperty({ description: '父级ID，默认0' })
  readonly parent_id: number;

  @ApiProperty({ description: '路径' })
  @IsNotEmpty({ message: '路径不能空' })
  readonly path: string;

  @ApiProperty({ description: '组件' })
  @IsNotEmpty({ message: '组件不能空' })
  readonly component: string;

  @ApiProperty({ description: '图标' })
  readonly icon: string;

  @ApiProperty({ description: '是否是外链，默认不是' })
  readonly is_out_link: number;
}
