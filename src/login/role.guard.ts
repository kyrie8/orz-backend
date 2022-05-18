import {
  CACHE_MANAGER,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  SetMetadata,
  UnauthorizedException
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    //private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    console.log('roles', roles)
    const req = context.switchToHttp().getRequest();
    const auth: string[] = await this.cacheManager.get('auth')
    //console.log('req',req)
    const {user, url, method} = req;
    console.log('user', user)
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }
    if (['/role', '/user'].includes(url) && (['PATCH', 'DELETE'].includes(method))) {
      //不让修改和删除
      throw new UnauthorizedException('没有权限')
    }
    return auth.some(item => roles.includes(item));
  }
}
