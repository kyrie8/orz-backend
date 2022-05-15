import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class FindUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: '角色' })
  @IsString()
  readonly role_id: string;

  @ApiProperty({ description: '页数', default: 1 })
  @IsOptional()
  @IsPositive()
  page_num: number;

  @ApiProperty({ description: '条数', default: 10 })
  @IsOptional()
  @IsPositive()
  page_size: number;
}
