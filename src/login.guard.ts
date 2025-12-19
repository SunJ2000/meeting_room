import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Permission } from './user/entities/perimission.entity';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

export interface JwtUserData {
  userId: number;
  username: string;
  is_admin: boolean;
  roles: string[];
  permissions: Permission[];
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const requireLogin: boolean = this.reflector.getAllAndOverride(
      'require-login',
      [context.getClass(), context.getHandler()],
    );

    if (!requireLogin) {
      return true;
    }
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('请先登录');
    }

    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<JwtUserData>(token);
      request.user = data;
      return true;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }
}
