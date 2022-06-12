import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ description: '菜单名称' })
  @IsNotEmpty({ message: '菜单名称不能空' })
  readonly menu_name: string;

  @ApiProperty({ description: '父级ID，默认0' })
  @IsOptional()
  @IsInt()
  readonly parent_id: number;

  @ApiProperty({ description: '路径' })
  @IsOptional()
  @IsString()
  readonly path: string;

  @ApiProperty({ description: '组件' })
  @IsNotEmpty({ message: '组件不能空' })
  readonly component: string;

  @ApiProperty({ description: '图标' })
  @IsOptional()
  @IsString()
  readonly icon: string;

  @ApiProperty({ description: '是否是外链，默认不是' })
  @IsInt()
  readonly is_out_link: number;

  @ApiProperty({ description: '是否隐藏，默认不是' })
  @IsBoolean()
  readonly hidden: boolean;

  @ApiProperty({ description: '1组件，0按钮' })
  @IsInt()
  readonly type: number;
}
