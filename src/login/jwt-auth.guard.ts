import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const url = ctx.getRequest().url;
    if (url === '/login') return true;
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    //console.log('user', user);
    if (info && !!info.expiredAt) {
      throw new HttpException('token过期，请重新登录', 403);
    }
    if (err || !user) {
      throw new UnauthorizedException('token错误');
    }
    return user;
  }
}
