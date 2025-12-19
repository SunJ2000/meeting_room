import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtUserData } from './login.guard';

export const RequireLogin = () => SetMetadata('require-login', true);
export const RequirePermission = (...permission: string[]) =>
  SetMetadata('require-permission', permission);

export const UserInfo = createParamDecorator<
  keyof JwtUserData | undefined,
  JwtUserData | JwtUserData[keyof JwtUserData] | null
>((data: keyof JwtUserData | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();

  if (!request.user) {
    return null;
  }

  return data ? request.user[data] : request.user;
});
