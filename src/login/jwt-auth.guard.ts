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
    const req = ctx.getRequest();
    const { url } = req;
    if (url === '/login') return true;
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (info && !!info.expiredAt) {
      throw new HttpException('token过期，请重新登录', 401);
    }
    if (err || !user) {
      throw new UnauthorizedException('token错误');
    }
    return user;
  }
}
