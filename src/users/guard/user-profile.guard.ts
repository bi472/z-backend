import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class UserProfileGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const uuid = request.params.uuid;

    if (user.uuid !== uuid) {
      throw new ForbiddenException('You can only update your own profile');
    }

    return true;
  }
}
