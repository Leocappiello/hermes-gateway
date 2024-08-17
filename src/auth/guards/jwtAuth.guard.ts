import { AuthGuard } from '@nestjs/passport';

// export class JwtAuthGuard extends AuthGuard('jwt') {
// canActivate(
//   context: ExecutionContext,
// ): boolean | Promise<boolean> | Observable<boolean> {
//   return super.canActivate(context);
// }
// handleRequest<TUser = any>(
//   err: any,
//   user: any,
//   info: any,
//   context: ExecutionContext,
//   status?: any,
// ): TUser {
//   if (err || !user) {
//     throw err || new UnauthorizedException();
//   }
//   return user;
// }
// }

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../public.guard';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }
}
