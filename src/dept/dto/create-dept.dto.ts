import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateDeptDto {
    @ApiProperty({ description: '部门名称' })
    @IsNotEmpty({ message: '部门名称不能空' })
    readonly name: string;

    @ApiProperty({ description: '描述' })
    @IsOptional()
    @IsString()
    readonly remark: string;

    @ApiProperty({ description: '父级ID' })
    @IsOptional()
    @IsString()
    readonly parent_id: number;
}



  