import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PERMIT_ALL_KEY } from '@security/decorator/permit-all.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext): any {
    const permitAll = this.reflector.getAllAndOverride<boolean>(PERMIT_ALL_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (permitAll) {
      return true;
    }
    return super.canActivate(context);
  }
}
