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
    const auth: string[] = await this.cacheManager.get('auth');
    //console.log('req',req)
    console.log(auth);
    const { user, url, method } = req;
    const reg = /^\role|user/g;
    console.log(reg.test(url));
    console.log('url', url, method);
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
