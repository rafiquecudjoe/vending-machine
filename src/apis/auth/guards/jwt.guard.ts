import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import redis from '../../../common/redis';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<any> {
    const request = context.switchToHttp().getRequest();
    const authToken = request.headers.authorization;
    const jwt = authToken.split(' ')[1];

    // check jwt from redis
    const retrievedJwt = await redis.KEYS(`*${jwt}*`);
    if (retrievedJwt.length === 0) return false;

    return super.canActivate(context);
  }
}
