/* eslint-disable @typescript-eslint/ban-types */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const { page_num, page_size } = value;
    if (!page_num) {
      value.page_num = 1;
    }
    if (!page_size) {
      value.page_size = 10;
    }
    value = {
      ...value,
      page_num: parseInt(value.page_num),
      page_size: parseInt(value.page_size),
    };
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      console.log(errors);
      const msg = Object.values(errors[0].constraints)[0];
      throw new HttpException(msg, HttpStatus.BAD_REQUEST);
    }
    return value;
  }
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
