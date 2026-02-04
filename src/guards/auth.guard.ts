import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UsersService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAllowed = this.reflector.getAllAndOverride<any>('isAllowed', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isAllowed) return true;
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Please Login');
    }
    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });
      const user = await this.userService.findOne({ id: payload.id });
      if (!user) return false;
      request.user = user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
