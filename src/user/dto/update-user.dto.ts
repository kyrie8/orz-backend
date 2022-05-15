import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ description: '角色' })
  @IsNotEmpty({ message: '角色不能空' })
  @IsString()
  readonly role_id: string;
}
