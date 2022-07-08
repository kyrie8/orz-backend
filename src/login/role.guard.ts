import {
  CACHE_MANAGER,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Reflector } from '@nestjs/core';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const auth: string[] = (await this.cacheManager.get('auth')) || [];
    console.log('req', req);
    const {
      user,
      url,
      method,
      params: { id },
    } = req;

    const reg = /\/(user|role)\/\d/g;
    const reg2 = /\/user\/\d/g;
    if (+id === user.user_id && reg2.test(url) && 'DELETE' === method) {
      console.log(1111, user);
      throw new HttpException('不可以删除自己', HttpStatus.BAD_REQUEST);
    }
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    const isAuth = auth.some((item) => roles.includes(item));
    if (
      (!auth.includes('admin') &&
        reg.test(url) &&
        ['PATCH', 'DELETE'].includes(method)) ||
      !isAuth
    ) {
      console.log(111);
      //不让修改和删除
      throw new UnauthorizedException('没有权限');
    }
    return true;
  }
}
